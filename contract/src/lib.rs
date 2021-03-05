#![deny(warnings)]

pub mod dict;

use core::panic;
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    bs58,
    collections::UnorderedMap,
    env,
    json_types::{U128, U64},
    near_bindgen,
    serde::Serialize,
    wee_alloc::WeeAlloc,
    AccountId, Balance, Promise,
};
use std::{convert::TryInto, mem::size_of, ops::Deref, usize};

use dict::Dict;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

pub const MINT_FEE: u128 = 1_000_000_000_000_000_000_000_000;

const CORGIS: &[u8] = b"a";
const CORGIS_BY_OWNER: &[u8] = b"b";
const CORGIS_BY_OWNER_PREFIX: &str = "B";
const ITEMS: &[u8] = b"d";
const ITEMS_PREFIX: &str = "D";

fn get_collection_key(prefix: &str, mut key: String) -> Vec<u8> {
    key.insert_str(0, prefix);
    key.as_bytes().to_vec()
}

pub type CorgiKey = [u8; size_of::<u128>()];

pub type CorgiId = String;

fn encode(key: CorgiKey) -> CorgiId {
    bs58::encode(key).into_string()
}

fn decode(id: &CorgiId) -> CorgiKey {
    let mut key: CorgiKey = [0; size_of::<CorgiKey>()];
    match bs58::decode(id).into(&mut key) {
        Err(error) => panic!("Could not decode `{}`: {}", id, error),
        Ok(_size) => (),
    }
    key
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: Dict<CorgiKey, Corgi>,
    corgis_by_owner: UnorderedMap<AccountId, Dict<CorgiKey, ()>>,
    items: UnorderedMap<CorgiKey, (Dict<AccountId, (Balance, u64)>, u64)>,
}

/// Represents a `Corgi`.
/// The `name` and `quote` are set by the user.
///
/// The `Corgi` struct is used as part of the public interface of the contract.
/// See, for example, [`get_corgis_by_owner`](Model::get_corgis_by_owner).
/// Every struct that is part of the public interface needs to be serializable
/// to JSON as well.
///
/// In addition, we use the following attributes
///
/// ```example
/// #[cfg_attr(test, derive(PartialEq, Debug))]
/// ```
///
/// to indicate that our struct uses both `PartialEq` and `Debug` traits
/// but only for testing purposes.
#[derive(BorshDeserialize, BorshSerialize, Serialize, PartialEq, Debug)]
pub struct Corgi {
    pub id: CorgiId,
    pub name: String,
    pub quote: String,
    pub color: String,
    pub background_color: String,
    rate: Rarity,
    pub owner: AccountId,
    pub created: u64,
    pub modified: u64,
    pub sender: AccountId,
}

#[derive(Serialize, PartialEq, Debug)]
pub struct CorgiDTO {
    #[serde(flatten)]
    corgi: Corgi,

    pub for_sale: Option<ForSale>,
}

impl Deref for CorgiDTO {
    type Target = Corgi;
    fn deref(&self) -> &Self::Target {
        &self.corgi
    }
}

#[derive(Serialize, PartialEq, Debug)]
pub struct ForSale {
    pub bids: Vec<Bid>,
    pub expires: U64,
}

#[derive(Serialize, PartialEq, Debug)]
pub struct Bid {
    bidder: AccountId,
    amount: U128,
    timestamp: U64,
}

impl Bid {
    pub fn new(bidder: AccountId, amount: u128, timestamp: u64) -> Self {
        Self {
            bidder,
            amount: U128(amount),
            timestamp: U64(timestamp),
        }
    }
}
#[derive(BorshDeserialize, BorshSerialize, Serialize, PartialEq, Debug)]
#[allow(non_camel_case_types)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    VERY_RARE,
}

macro_rules! log {
    ($($arg:tt)*) => {{
        env::log(format!($($arg)*).as_bytes());
    }}
}

impl CorgiDTO {
    fn new(corgi: Corgi) -> Self {
        Self {
            corgi,
            for_sale: None,
        }
    }

    fn for_sale(corgi: Corgi, item: (Dict<AccountId, (Balance, u64)>, u64)) -> CorgiDTO {
        let bids = item
            .0
            .into_iter()
            .map(|(bidder, (amount, timestamp))| Bid::new(bidder, amount, timestamp))
            .collect::<Vec<Bid>>();
        Self {
            corgi,
            for_sale: Some(ForSale {
                bids,
                expires: U64(item.1),
            }),
        }
    }
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
    ///
    /// Use:
    ///
    /// ```sh
    /// near deploy --wasmFile target/wasm32-unknown-unknown/release/corgis_nft.wasm --initFunction init --initArgs '{}'  
    /// ```
    ///
    #[init]
    pub fn new() -> Self {
        log!("new()");
        Self::default()
    }

    fn get_for_sale(&self, key: CorgiKey, corgi: Corgi) -> CorgiDTO {
        match self.items.get(&key) {
            None => CorgiDTO::new(corgi),
            Some(item) => CorgiDTO::for_sale(corgi, item),
        }
    }

    /// Creates a `Corgi` under the `predecessor_account_id`.
    ///
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
        assert!(
            deposit == MINT_FEE,
            "Deposit must be MINT_FEE but was {}",
            deposit
        );

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
            rate: {
                let rate = u128::from_le_bytes(env::random_seed()[..16].try_into().unwrap()) % 100;
                if rate > 10 {
                    Rarity::COMMON
                } else if rate > 5 {
                    Rarity::UNCOMMON
                } else if rate > 1 {
                    Rarity::RARE
                } else {
                    Rarity::VERY_RARE
                }
            },
            owner,
            created: now,
            modified: now,
            sender: "".to_string(),
        };

        CorgiDTO::new(self.push_corgi(key, corgi))
    }

    /// Gets the `Corgi` by the given `id`.
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
    /// The `owner` must be a valid account id.
    ///
    /// Note, the parameter is `&self` (without being mutable)
    /// meaning it doesn't modify state.
    /// In the frontend (`/src/index.js`) this is added to the `"viewMethods"` array.
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

    /// Delete the `Corgi` by `id`.
    /// Only the owner of the `Corgi` can delete it.
    pub fn delete_corgi(&mut self, id: CorgiId) {
        log!("delete_corgi({})", id);

        let owner = env::predecessor_account_id();
        self.delete_corgi_from(&owner, &id);
    }

    /// Get all `Corgi`s from all users.
    ///
    /// Using `near-cli` we can call this contract by:
    ///
    /// ```sh
    /// near view YOU.testnet get_global_corgis
    /// ```
    ///
    /// Returns a list of all `Corgi`s.
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

    /// Transfer the given corgi to `receiver`.
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

        self.delete_corgi_from(&corgi.owner, &id);

        corgi.owner = receiver;
        corgi.sender = sender;
        corgi.modified = env::block_timestamp();

        self.push_corgi(key, corgi);
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
                if list.remove(&key).is_none() {
                    panic!("Corgi id `{}` does not belong to account `{}`", id, owner);
                }
                self.corgis_by_owner.insert(&owner, &list);

                let was_removed = self.corgis.remove(&key);
                assert!(
                    was_removed.is_some(),
                    "The corgi id `{}` was not found in dict",
                    id
                );
            }
        }
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
                    panic!(
                        "Your bid Ⓝ `{}` is not enough to top current bid Ⓝ `{}`",
                        price, top_price
                    )
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

                        self.transfer_corgi(bidder, token_id);
                        Promise::new(signer).transfer(price);
                        for (bidder, (price, _timestamp)) in it {
                            Promise::new(bidder).transfer(price);
                        }
                    }
                    self.items.remove(&key);
                } else {
                    if let Some((bidder, (price, _timestamp))) = bids.into_iter().next() {
                        if bidder == signer {
                            panic!(
                                "You cannot withdraw your bid Ⓝ `{}` because is the highest",
                                price
                            )
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
}
