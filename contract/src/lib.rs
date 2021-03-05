#![deny(warnings)]

pub mod corgi;
pub mod dict;

use crate::corgi::{decode, encode, Corgi, CorgiDTO, CorgiId, CorgiKey, Rarity};
use crate::dict::Dict;
use core::panic;
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

/// Fee to pay in (yocto Ⓝ) to allow the user to store Corgis in our contract.
pub const MINT_FEE: u128 = 1_000_000_000_000_000_000_000_000;

const CORGIS: &[u8] = b"a";
const CORGIS_BY_OWNER: &[u8] = b"b";
const CORGIS_BY_OWNER_PREFIX: &str = "B";
const ITEMS: &[u8] = b"d";
const ITEMS_PREFIX: &str = "D";

macro_rules! log {
    ($($arg:tt)*) => {{
        env::log(format!($($arg)*).as_bytes());
    }}
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: Dict<CorgiKey, Corgi>,
    corgis_by_owner: UnorderedMap<AccountId, Dict<CorgiKey, ()>>,
    items: UnorderedMap<CorgiKey, (Dict<AccountId, (Balance, u64)>, u64)>,
}

impl Default for Model {
    fn default() -> Self {
        log!("Default::default() contract v{}", env!("CARGO_PKG_VERSION"));
        Self {
            corgis: Dict::new(CORGIS.to_vec()),
            corgis_by_owner: UnorderedMap::new(CORGIS_BY_OWNER.to_vec()),
            items: UnorderedMap::new(ITEMS.to_vec()),
        }
    }
}

#[near_bindgen]
impl Model {
    /// Initializes the corgis contract.
    #[init]
    pub fn new() -> Self {
        log!("new()");
        Self::default()
    }

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
        log!(
            "create_corgi({}, {}, {}, {})",
            name,
            quote,
            color,
            background_color
        );

        let owner = env::predecessor_account_id();
        let deposit = env::attached_deposit();

        if deposit != MINT_FEE {
            panic!("Deposit must be MINT_FEE but was {}", deposit)
        }

        let check = |value: &String, max: usize, message: &str| {
            if value.len() > max {
                panic!("{}", message);
            }
        };
        check(&name, 32, "Name exceeds max 32 chars allowed");
        check(&quote, 256, "Quote exceeds max 256 chars allowed");
        check(&color, 64, "Color exceeds max 64 chars allowed");
        check(&background_color, 64, "Back color exceeds 64 chars");

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
        log!("get_corgi_by_id({})", id);

        let key = decode(&id);
        match self.corgis.get(&key) {
            None => panic!("The given corgi id `{}` was not found", id),
            Some(corgi) => {
                assert!(corgi.id == id, "Corgi ids do not match");
                self.get_for_sale(key, corgi)
            }
        }
    }

    /// Gets the `Corgi`s owned by the `owner` account id.
    pub fn get_corgis_by_owner(&self, owner: AccountId) -> Vec<CorgiDTO> {
        log!("get_corgis_by_owner({})", owner);

        match self.corgis_by_owner.get(&owner) {
            None => Vec::new(),
            Some(list) => list
                .into_iter()
                .map(|(key,_)| {
                    let maybe_corgi = self.corgis.get(&key);
                    assert!(maybe_corgi.is_some(), "Could not find Corgi by key `{:?}` in heap", key);

                    let corgi = maybe_corgi.unwrap();
                    assert!(corgi.id == encode(key));
                    assert!(corgi.owner == owner, "The corgi with key `{:?}` owned by `{}` was found while fetching `{}`'s corgis", key, corgi.owner, owner);

                    self.get_for_sale(key, corgi)
                })
                .collect(),
        }
    }

    /// Delete the `Corgi` by `id`. Only the owner of the `Corgi` can delete it.
    pub fn delete_corgi(&mut self, id: CorgiId) {
        log!("delete_corgi({})", id);

        let owner = env::predecessor_account_id();
        self.delete_corgi_from(&owner, &id);
    }

    /// Returns a list of all `Corgi`s that have been created.
    pub fn get_global_corgis(&self) -> Vec<CorgiDTO> {
        log!("get_global_corgis()");

        let page_limit = self.get_corgis_page_limit() as usize;

        let mut result = Vec::new();
        for (key, corgi) in &self.corgis {
            if result.len() >= page_limit as usize {
                break;
            }
            result.push(self.get_for_sale(key, corgi));
        }

        result
    }

    /// Returns the max amount of `Corgi`s returned by `get_global_corgis`.
    pub fn get_corgis_page_limit(&self) -> u64 {
        log!("get_corgis_page_limit()");

        12
    }

    /// Transfer the Corgi with the given `id` to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: AccountId, id: CorgiId) {
        log!("transfer_corgi({}, {})", receiver, id);

        if !env::is_valid_account_id(receiver.as_bytes()) {
            panic!("Receiver account `{}` is not a valid account id", receiver);
        }

        let sender = env::predecessor_account_id();
        if sender == receiver {
            panic!("Account `{}` attempted to make a self transfer", receiver);
        }

        let key = decode(&id);
        let mut corgi = match self.corgis.get(&key) {
            None => panic!("Attempt to transfer a nonexistent Corgi id `{}`", id),
            Some(corgi) => corgi,
        };

        assert_eq!(corgi.id, id, "Corgi ids do not match");

        if sender != corgi.owner {
            panic!("Sender does not own `{}`", id);
        }

        if let Some((_bids, expires)) = self.items.get(&key) {
            panic!("Corgi `{}` is currently locked until {}", id, expires);
        }

        self.delete_corgi_from(&corgi.owner, &id);

        corgi.owner = receiver;
        corgi.sender = sender;
        corgi.modified = env::block_timestamp();

        self.push_corgi(key, corgi);
    }

    pub fn get_items_for_sale(&self) -> Vec<CorgiDTO> {
        log!("get_items_for_sale()");

        let mut result = Vec::new();
        for (key, item) in self.items.iter() {
            let corgi = self.corgis.get(&key);
            assert!(corgi.is_some());
            let corgi = corgi.unwrap();

            result.push(CorgiDTO::for_sale(corgi, item));
        }
        result
    }

    pub fn add_item_for_sale(&mut self, token_id: CorgiId, duration: u32) -> U64 {
        log!("add_item_for_sale({}, {})", token_id, duration);

        let key = decode(&token_id);
        match self.corgis.get(&key) {
            None => panic!("Token `{}` does not exist", token_id),
            Some(corgi) => {
                if corgi.owner != env::predecessor_account_id() {
                    panic!("Only token owner can add item for sale")
                }

                match self.items.get(&key) {
                    None => {
                        let bids = Dict::new(get_collection_key(ITEMS_PREFIX, token_id));
                        let expires = env::block_timestamp() + duration as u64 * 1_000_000_000;
                        self.items.insert(&key, &(bids, expires));

                        U64(expires)
                    }
                    Some(_) => {
                        panic!("Item `{}` already for sale", token_id);
                    }
                }
            }
        }
    }

    #[payable]
    pub fn bid_for_item(&mut self, token_id: CorgiId) {
        log!("bid_for_item({})", token_id);

        let key = decode(&token_id);
        match self.items.get(&key) {
            None => panic!("Item `{}` is not available for sale", token_id),
            Some((mut bids, auction_ends)) => {
                let bidder = env::predecessor_account_id();

                if bidder == self.corgis.get(&key).expect("Corgi not found").owner {
                    panic!("You cannot bid for your own Corgi `{}`", token_id)
                }

                if env::block_timestamp() > auction_ends {
                    panic!("The auction for item `{}` has expired", token_id)
                }

                let price =
                    env::attached_deposit() + bids.get(&bidder).map(|(p, _)| p).unwrap_or_default();

                let top_price = bids
                    .into_iter()
                    .next()
                    .map(|(_, (p, _))| p)
                    .unwrap_or_default();
                if price <= top_price {
                    panic!("The bid Ⓝ {} does not cover top bid Ⓝ {}", price, top_price)
                }

                bids.remove(&bidder);
                bids.push_front(&bidder, (price, env::block_timestamp()));
                self.items.insert(&key, &(bids, auction_ends));
            }
        }
    }

    pub fn clearance_for_item(&mut self, token_id: CorgiId) {
        log!("clearance_for_item({})", token_id);

        let key = decode(&token_id);
        match self.items.get(&key) {
            None => panic!("Item `{}` not found for sale", token_id),
            Some((mut bids, auction_ends)) => {
                let corgi = {
                    let corgi = self.corgis.get(&key);
                    assert!(corgi.is_some());
                    corgi.unwrap()
                };
                let signer = env::predecessor_account_id();
                if signer == corgi.owner {
                    let mut it = bids.into_iter();
                    if let Some((bidder, (price, _timestamp))) = it.next() {
                        if env::block_timestamp() <= auction_ends {
                            panic!("Auction for token `{}` has not yet expired", token_id)
                        }

                        self.items.remove(&key);

                        self.transfer_corgi(bidder, token_id);
                        Promise::new(signer).transfer(price);
                        for (bidder, (price, _timestamp)) in it {
                            Promise::new(bidder).transfer(price);
                        }
                    } else {
                        self.items.remove(&key);
                    }
                } else {
                    if let Some((bidder, (price, _timestamp))) = bids.into_iter().next() {
                        if bidder == signer {
                            panic!("Your bid Ⓝ {} is the highest and cannot be cleared", price)
                        }
                    }
                    match bids.remove(&signer) {
                        None => panic!("You cannot clear an item if you are not bidding for it"),
                        Some((price, _)) => Promise::new(signer).transfer(price),
                    };
                }
            }
        }
    }

    fn get_for_sale(&self, key: CorgiKey, corgi: Corgi) -> CorgiDTO {
        match self.items.get(&key) {
            None => CorgiDTO::new(corgi),
            Some(item) => CorgiDTO::for_sale(corgi, item),
        }
    }

    fn push_corgi(&mut self, key: CorgiKey, corgi: Corgi) -> Corgi {
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

    fn delete_corgi_from(&mut self, owner: &AccountId, id: &CorgiId) {
        assert!(env::predecessor_account_id() == *owner);

        match self.corgis_by_owner.get(owner) {
            None => panic!("Account `{}` does not have corgis to delete from", owner),
            Some(mut list) => {
                let key = decode(id);

                if let Some((_bids, expires)) = self.items.get(&key) {
                    panic!("Corgi `{}` is currently locked until {}", id, expires);
                }

                if list.remove(&key).is_none() {
                    panic!("Corgi id `{}` does not belong to account `{}`", id, owner);
                }
                self.corgis_by_owner.insert(&owner, &list);

                let was_removed = self.corgis.remove(&key);
                assert!(was_removed.is_some(), "Corgi id `{}` not found in dict", id);
            }
        }
    }
}

fn get_collection_key(prefix: &str, mut key: String) -> Vec<u8> {
    key.insert_str(0, prefix);
    key.as_bytes().to_vec()
}
