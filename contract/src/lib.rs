#![deny(warnings)]

pub mod corgi;
pub mod dict;

#[cfg(test)]
pub mod tests;

use crate::corgi::{decode, encode, Corgi, CorgiDTO, CorgiId, CorgiKey, Rarity};
use crate::dict::Dict;
use near_env::near_envlog;
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env,
    json_types::U64,
    near_bindgen,
    wee_alloc::WeeAlloc,
    AccountId, Balance, Promise,
};
use std::{convert::TryInto, mem::size_of, usize};

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

/// Fee to pay (in yocto Ⓝ) to allow the user to store Corgis on-chain.
const MINT_FEE: u128 = include!(concat!(env!("OUT_DIR"), "/mint_fee.val"));

/// Indicates how many Corgi are returned at most in the `get_global_corgis` method.
const PAGE_LIMIT: u32 = include!(concat!(env!("OUT_DIR"), "/page_limit.val"));

/// Keys used to identify our structures within the NEAR blockchain.
const CORGIS: &[u8] = b"a";
const CORGIS_BY_OWNER: &[u8] = b"b";
const CORGIS_BY_OWNER_PREFIX: &str = "B";
const AUCTIONS: &[u8] = b"d";
const AUCTIONS_PREFIX: &str = "D";

/// Holds our data model.
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    /// A mapping from `CorgiKey` to `Corgi` to have quick access to corgis.
    corgis: Dict<CorgiKey, Corgi>,
    /// Represents which account holds which `Corgi`.
    corgis_by_owner: UnorderedMap<AccountId, Dict<CorgiKey, ()>>,
    /// Internal structure to store auctions for a given corgi.
    auctions: UnorderedMap<CorgiKey, (Dict<AccountId, (Balance, u64)>, u64)>,
}

impl Default for Model {
    fn default() -> Self {
        env::log(format!("init v{}", env!("CARGO_PKG_VERSION")).as_bytes());
        Self {
            corgis: Dict::new(CORGIS.to_vec()),
            corgis_by_owner: UnorderedMap::new(CORGIS_BY_OWNER.to_vec()),
            auctions: UnorderedMap::new(AUCTIONS.to_vec()),
        }
    }
}

#[near_bindgen]
#[near_envlog(skip_args, only_pub)]
impl Model {
    /// Creates a `Corgi` under the `predecessor_account_id`.
    /// Returns the `id` of the generated `Corgi` encoded using base58.
    #[payable]
    pub fn create_corgi(
        &mut self,
        name: String,
        quote: String,
        color: String,
        background_color: String,
    ) -> CorgiDTO {
        let owner = env::predecessor_account_id();
        let deposit = env::attached_deposit();

        if deposit != MINT_FEE {
            panic!("Deposit must be MINT_FEE but was {}", deposit)
        }

        macro_rules! check {
            ($value:ident, $max:expr, $message:expr) => {{
                if $value.len() > $max {
                    env::panic($message.as_bytes());
                }
            }};
        }

        check!(name, 32, "Name too large");
        check!(quote, 256, "Quote too large");
        check!(color, 64, "Color too large");
        check!(background_color, 64, "Backcolor too large");

        let now = env::block_timestamp();
        let key = env::random_seed()[..size_of::<CorgiKey>()]
            .try_into()
            .unwrap();
        let corgi = Corgi {
            id: encode(key),
            name,
            quote,
            color,
            background_color,
            rate: Rarity::from_seed(env::random_seed()),
            owner,
            created: now,
            modified: now,
            sender: "".to_string(),
        };

        CorgiDTO::new(self.push_corgi(key, corgi))
    }

    /// Gets `Corgi` by the given `id`.
    pub fn get_corgi_by_id(&self, id: CorgiId) -> CorgiDTO {
        let (key, corgi) = self.get_corgi(&id);
        self.get_for_sale(key, corgi)
    }

    /// Gets the `Corgi`s owned by the `owner` account id.
    pub fn get_corgis_by_owner(&self, owner: AccountId) -> Vec<CorgiDTO> {
        match self.corgis_by_owner.get(&owner) {
            None => Vec::new(),
            Some(list) => list
                .into_iter()
                .map(|(key, _)| {
                    let maybe_corgi = self.corgis.get(&key);
                    assert!(maybe_corgi.is_some());

                    let corgi = maybe_corgi.unwrap();
                    assert!(corgi.id == encode(key));
                    assert!(corgi.owner == owner);

                    self.get_for_sale(key, corgi)
                })
                .collect(),
        }
    }

    /// Delete the `Corgi` by `id`. Only the owner of the `Corgi` can delete it.
    pub fn delete_corgi(&mut self, id: CorgiId) {
        let owner = env::predecessor_account_id();
        self.delete_corgi_from(id, owner);
    }

    /// Deletes the given corgi with `id` and owned by `owner`.
    fn delete_corgi_from(&mut self, id: CorgiId, owner: AccountId) {
        match self.corgis_by_owner.get(&owner) {
            None => env::panic("You do not have corgis to delete from".as_bytes()),
            Some(mut list) => {
                let key = decode(&id);

                self.panic_if_corgi_is_locked(key);

                if list.remove(&key).is_none() {
                    env::panic("Corgi id does not belong to account".as_bytes());
                }
                self.corgis_by_owner.insert(&owner, &list);

                let was_removed = self.corgis.remove(&key);
                assert!(was_removed.is_some());
            }
        }
    }

    /// Returns a list of all `Corgi`s that have been created.
    pub fn get_global_corgis(&self) -> Vec<CorgiDTO> {
        let mut result = Vec::new();
        for (key, corgi) in &self.corgis {
            if result.len() >= PAGE_LIMIT as usize {
                break;
            }
            result.push(self.get_for_sale(key, corgi));
        }

        result
    }

    /// Transfer the Corgi with the given `id` to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: AccountId, id: CorgiId) {
        if !env::is_valid_account_id(receiver.as_bytes()) {
            env::panic("Invalid receiver account id".as_bytes());
        }

        let sender = env::predecessor_account_id();
        if sender == receiver {
            env::panic("Self transfers are not allowed".as_bytes());
        }

        let (key, corgi) = self.get_corgi(&id);
        assert_eq!(corgi.id, id);

        if sender != corgi.owner {
            env::panic("Sender must own Corgi".as_bytes());
        }

        self.panic_if_corgi_is_locked(key);

        self.move_corgi(key, id, sender, receiver, corgi)
    }

    /// Returns all `Corgi`s currently for sale.
    /// That is, all `Corgi`s which are in auction.
    pub fn get_items_for_sale(&self) -> Vec<CorgiDTO> {
        let mut result = Vec::new();
        for (key, item) in self.auctions.iter() {
            let corgi = self.corgis.get(&key);
            assert!(corgi.is_some());
            let corgi = corgi.unwrap();

            result.push(CorgiDTO::for_sale(corgi, item));
        }
        result
    }

    /// Puts the given `Corgi` for sale.
    /// `duration` indicates for how long the auction should last, in seconds.
    pub fn add_item_for_sale(&mut self, token_id: CorgiId, duration: u32) -> U64 {
        let (key, corgi) = self.get_corgi(&token_id);
        if corgi.owner != env::predecessor_account_id() {
            env::panic("Only token owner can add item for sale".as_bytes())
        }

        if let None = self.auctions.get(&key) {
            let bids = Dict::new(get_collection_key(AUCTIONS_PREFIX, token_id));
            let expires = env::block_timestamp() + duration as u64 * 1_000_000_000;
            self.auctions.insert(&key, &(bids, expires));

            U64(expires)
        } else {
            env::panic("Corgi already for sale".as_bytes());
        }
    }

    /// Makes a bid for a `Corgi` already in auction.
    /// This is a `payable` method, meaning the contract will escrow the `attached_deposit`
    /// until the auction ends.
    #[payable]
    pub fn bid_for_item(&mut self, token_id: CorgiId) {
        let (key, mut bids, auction_ends) = self.get_auction(&token_id);
        let bidder = env::predecessor_account_id();

        if bidder == self.corgis.get(&key).expect("Corgi not found").owner {
            env::panic("You cannot bid for your own Corgi".as_bytes())
        }

        if env::block_timestamp() > auction_ends {
            env::panic("Auction for corgi has expired".as_bytes())
        }

        let price = env::attached_deposit() + bids.get(&bidder).map(|(p, _)| p).unwrap_or_default();

        let top_price = bids.into_iter().next().map(|(_, (p, _))| p).unwrap_or(0);
        if price <= top_price {
            panic!("Bid {} does not cover top bid {}", price, top_price)
        }

        bids.remove(&bidder);
        bids.push_front(&bidder, (price, env::block_timestamp()));
        self.auctions.insert(&key, &(bids, auction_ends));
    }

    /// Makes a clearance for the given `Corgi`.
    /// Only the corgi `owner` or the highest bidder can end an auction after it expires.
    /// All other bidders can get their money back when calling this method.
    pub fn clearance_for_item(&mut self, token_id: CorgiId) {
        let (key, mut bids, auction_ends) = self.get_auction(&token_id);
        let corgi = {
            let corgi = self.corgis.get(&key);
            assert!(corgi.is_some());
            corgi.unwrap()
        };
        let owner = corgi.owner.clone();
        let end_auction = |it, bidder, price| {
            if env::block_timestamp() <= auction_ends {
                env::panic("Token still in auction".as_bytes())
            }

            self.auctions.remove(&key);

            self.move_corgi(key, token_id, owner.clone(), bidder, corgi);
            Promise::new(owner.clone()).transfer(price);
            for (bidder, (price, _timestamp)) in it {
                Promise::new(bidder).transfer(price);
            }
        };
        let mut it = bids.into_iter();
        let signer = env::predecessor_account_id();
        if signer == owner.clone() {
            if let Some((bidder, (price, _timestamp))) = it.next() {
                end_auction(it, bidder, price);
            } else {
                self.auctions.remove(&key);
            }
        } else {
            if let Some((bidder, (price, _timestamp))) = it.next() {
                if bidder == signer {
                    end_auction(it, bidder, price);
                    return;
                }
            }
            match bids.remove(&signer) {
                None => env::panic("Cannot clear an item if not bidding for it".as_bytes()),
                Some((price, _)) => Promise::new(signer).transfer(price),
            };
        }
    }

    /// Internal method to transfer a corgi.
    fn move_corgi(
        &mut self,
        key: CorgiKey,
        id: CorgiId,
        old_owner: AccountId,
        new_owner: AccountId,
        mut corgi: Corgi,
    ) {
        self.delete_corgi_from(id, old_owner.clone());

        corgi.owner = new_owner;
        corgi.sender = old_owner;
        corgi.modified = env::block_timestamp();
        self.push_corgi(key, corgi);
    }

    /// Gets the `Corgi` with `id`.
    fn get_corgi(&self, id: &CorgiId) -> (CorgiKey, Corgi) {
        let key = decode(id);
        match self.corgis.get(&key) {
            None => env::panic("Given corgi id was not found".as_bytes()),
            Some(corgi) => {
                assert!(corgi.id == *id);
                (key, corgi)
            }
        }
    }

    /// Gets auction information for the `Corgi` with `token_id` or panics.
    fn get_auction(&self, token_id: &CorgiId) -> (CorgiKey, Dict<AccountId, (u128, u64)>, u64) {
        let key = decode(&token_id);
        match self.auctions.get(&key) {
            None => env::panic("Corgi is not available for sale".as_bytes()),
            Some((bids, expires)) => (key, bids, expires),
        }
    }

    /// Gets sale information for a given `Corgi`.
    fn get_for_sale(&self, key: CorgiKey, corgi: Corgi) -> CorgiDTO {
        match self.auctions.get(&key) {
            None => CorgiDTO::new(corgi),
            Some(item) => CorgiDTO::for_sale(corgi, item),
        }
    }

    /// Inserts a `Corgi` into the top the dictionary.
    fn push_corgi(&mut self, key: CorgiKey, corgi: Corgi) -> Corgi {
        env::log("push_corgi".as_bytes());

        let corgi = self.corgis.push_front(&key, corgi);

        let mut ids = self.corgis_by_owner.get(&corgi.owner).unwrap_or_else(|| {
            Dict::new(get_collection_key(
                CORGIS_BY_OWNER_PREFIX,
                corgi.owner.clone(),
            ))
        });
        ids.push_front(&key, ());

        self.corgis_by_owner.insert(&corgi.owner, &ids);

        corgi
    }

    /// Ensures the given `Corgi` with `key` is not for sale.
    fn panic_if_corgi_is_locked(&self, key: CorgiKey) {
        if self.auctions.get(&key).is_some() {
            env::panic("Corgi is currently locked".as_bytes());
        }
    }
}

fn get_collection_key(prefix: &str, mut key: String) -> Vec<u8> {
    key.insert_str(0, prefix);
    key.as_bytes().to_vec()
}
