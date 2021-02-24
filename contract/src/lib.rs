#![deny(warnings)]

pub mod dict;
pub mod pack;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::{UnorderedMap, UnorderedSet},
    env, near_bindgen,
    serde::Serialize,
    wee_alloc::WeeAlloc,
    AccountId,
};
use std::usize;

use dict::Dict;
use pack::pack;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

/// The token ID type is also defined in the NEP
/// Cannot be `u64`.
/// See <https://github.com/near-examples/NFT/issues/117>
pub type TokenId = String;

pub type CorgiId = TokenId;

/// This trait provides the baseline of functions as described at:
/// <https://github.com/nearprotocol/NEPs/blob/nep-4/specs/Standards/Tokens/NonFungibleToken.md>
pub trait NEP4 {
    // Grant the access to the given `accountId` for the given `tokenId`.
    // Requirements:
    // * The caller of the function (`predecessor_id`) should have access to the token.
    fn grant_access(&mut self, escrow_account_id: AccountId);

    // Revoke the access to the given `accountId` for the given `tokenId`.
    // Requirements:
    // * The caller of the function (`predecessor_id`) should have access to the token.
    fn revoke_access(&mut self, escrow_account_id: AccountId);

    // Transfer the given `tokenId` to the given `accountId`. Account `accountId` becomes the new owner.
    // Requirements:
    // * The caller of the function (`predecessor_id`) should have access to the token.
    fn transfer_from(&mut self, owner_id: AccountId, new_owner_id: AccountId, token_id: TokenId);

    // Transfer the given `tokenId` to the given `accountId`. Account `accountId` becomes the new owner.
    // Requirements:
    // * The caller of the function (`predecessor_id`) should be the owner of the token. Callers who have
    // escrow access should use transfer_from.
    fn transfer(&mut self, new_owner_id: AccountId, token_id: TokenId);

    // Returns `true` or `false` based on caller of the function (`predecessor_id) having access to the token
    fn check_access(&self, account_id: AccountId) -> bool;

    // Get an individual owner by given `tokenId`.
    fn get_token_owner(&self, token_id: TokenId) -> String;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: Dict<CorgiId, Corgi>,
    corgis_by_owner: UnorderedMap<AccountId, Dict<CorgiId, ()>>,
    escrows_by_owner: UnorderedMap<AccountId, UnorderedSet<AccountId>>,
}

/// Represents a `Corgi`.
/// The `name` and `quote` are set by the user.
///
/// The `Corgi` struct is used as part of the public interface of the contract.
/// See, for example, [`get_corgis_by_owner`](Model::get_corgis_by_owner).
/// Every struct that is part of the public interface needs to be serializable
/// to JSON as well.
/// The following attributes allows JSON serialization with no need to import
/// `serde` directly.
///
/// ```example
/// #[derive(Serialize)]
/// #[serde(crate = "near_sdk::serde")]
/// ```
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
#[serde(crate = "near_sdk::serde")]
pub struct Corgi {
    pub id: String,
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

#[derive(BorshDeserialize, BorshSerialize, Serialize, PartialEq, Debug)]
#[serde(crate = "near_sdk::serde")]
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

impl Default for Model {
    fn default() -> Self {
        log!("Default::default() contract v{}", env!("CARGO_PKG_VERSION"));
        Self {
            corgis: Dict::new("C".as_bytes().to_vec()),
            corgis_by_owner: UnorderedMap::new("O".as_bytes().to_vec()),
            escrows_by_owner: UnorderedMap::new(vec![b'c']),
        }
    }
}

#[near_bindgen]
impl NEP4 for Model {
    fn grant_access(&mut self, escrow_account_id: AccountId) {
        let owner = env::predecessor_account_id();

        let mut escrows = self
            .escrows_by_owner
            .get(&owner)
            .unwrap_or_else(|| UnorderedSet::new(vec![b'd']));
        escrows.insert(&escrow_account_id);
        self.escrows_by_owner.insert(&owner, &escrows);
    }

    fn revoke_access(&mut self, escrow_account_id: AccountId) {
        let owner = env::predecessor_account_id();
        let mut escrows = self
            .escrows_by_owner
            .get(&owner)
            .expect("Access does not exist");
        if !escrows.remove(&escrow_account_id) {
            panic!("Did not find access for escrow ID `{}`", escrow_account_id);
        }
        self.escrows_by_owner.insert(&owner, &escrows);
    }

    fn transfer_from(&mut self, owner_id: AccountId, new_owner_id: AccountId, token_id: TokenId) {
        let token_owner = self.get_token_owner(token_id.clone());

        assert_eq!(
            owner_id, token_owner,
            "Attempt to transfer a token from a different owner"
        );

        assert!(
            self.check_access(token_owner),
            "Attempt to transfer a token with no access",
        );

        self.transfer(new_owner_id, token_id);
    }

    fn transfer(&mut self, new_owner_id: AccountId, token_id: TokenId) {
        log!("NEP4::transfer({}, {})", new_owner_id, token_id);
        self.transfer_corgi(new_owner_id, token_id);
    }

    fn check_access(&self, account_id: AccountId) -> bool {
        self.can_transfer_on_behalf(account_id)
    }

    fn get_token_owner(&self, token_id: TokenId) -> String {
        log!("NEP4::get_token_owner({})", token_id);
        self.get_corgi_by_id(token_id).owner
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
        log!("::new()");
        Self::default()
    }

    /// Creates a `Corgi` under the `predecessor_account_id`.
    ///
    /// Returns the `id` of the generated `Corgi` encoded using base64.
    pub fn create_corgi(
        &mut self,
        name: String,
        quote: String,
        color: String,
        background_color: String,
    ) -> Corgi {
        log!(
            "::create_corgi({}, {}, {}, {})",
            name,
            quote,
            color,
            background_color
        );

        let owner = env::predecessor_account_id();
        env::log(format!("create corgi owned by {}", owner).as_bytes());

        assert!(name.len() <= 32, "Name exceeds max 32 chars allowed");
        assert!(quote.len() <= 256, "Quote exceeds max 256 chars allowed");
        assert!(color.len() <= 64, "Color exceeds max 64 chars allowed");
        assert!(background_color.len() <= 64, "Back color exceeds 64 chars");

        let now = env::block_timestamp();
        let corgi = Corgi {
            id: {
                let seed = env::random_seed();
                let data = env::sha256(&seed);
                base64::encode(&data)
            },
            name,
            quote,
            color,
            background_color,
            rate: {
                let rate = pack(env::random_seed().get(..16).unwrap()) % 100;
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

        self.push_corgi(corgi)
    }

    /// Gets the `Corgi` by the given `id`.
    pub fn get_corgi_by_id(&self, id: CorgiId) -> Corgi {
        log!("::get_corgi_by_id({})", id);

        match self.corgis.get(&id) {
            None => panic!("The given corgi id `{}` was not found", id),
            Some(corgi) => {
                assert!(corgi.id == id);
                corgi
            }
        }
    }

    /// Gets the `Corgi`s owned by the `owner` account id.
    /// The `owner` must be a valid account id.
    ///
    /// Note, the parameter is `&self` (without being mutable)
    /// meaning it doesn't modify state.
    /// In the frontend (`/src/index.js`) this is added to the `"viewMethods"` array.
    pub fn get_corgis_by_owner(&self, owner: AccountId) -> Vec<Corgi> {
        log!("::get_corgis_by_owner({})", owner);

        match self.corgis_by_owner.get(&owner) {
            None => Vec::new(),
            Some(list) => list
                .into_iter()
                .map(|(id,_)| {
                    let maybe_corgi = self.corgis.get(&id);
                    assert!(maybe_corgi.is_some(), "Could not find Corgi by id `{}`", id);

                    let corgi = maybe_corgi.unwrap();
                    assert!(corgi.id == id);
                    assert!(corgi.owner == owner, "The corgi with id `{}` owned by `{}` was found while fetching `{}`'s corgis", id, corgi.owner, owner);

                    corgi
                })
                .collect(),
        }
    }

    /// Delete the `Corgi` by `id`.
    /// Only the owner of the `Corgi` can delete it.
    pub fn delete_corgi(&mut self, id: String) {
        let owner = env::predecessor_account_id();
        self.delete_corgi_from(owner, id);
    }

    fn delete_corgi_from(&mut self, owner: AccountId, id: String) {
        log!("::delete_corgi({})", id);

        assert!(self.can_transfer_on_behalf(owner.clone()));

        match self.corgis_by_owner.get(&owner) {
            None => panic!("Account `{}` does not have corgis to delete from", owner),
            Some(mut list) => {
                if !list.remove(&id) {
                    panic!("Corgi id `{}` does not belong to account `{}`", id, owner);
                }
                self.corgis_by_owner.insert(&owner, &list);
            }
        }

        if !self.corgis.remove(&id) {
            panic!("Attempt to remove a nonexistent Corgi id `{}`", id);
        }
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
    pub fn get_global_corgis(&self) -> Vec<Corgi> {
        log!("::get_global_corgis()");

        let page_limit = self.get_corgis_page_limit() as usize;

        let mut result = Vec::new();
        let mut id = self.corgis.first.clone();
        while id != "" {
            if result.len() >= page_limit as usize {
                break;
            }

            let node = self
                .corgis
                .dict
                .get(&id)
                .expect("Not able to get corgi for display");
            result.push(node.value);
            id = node.next
        }

        result
    }

    /// Returns the max amount of `Corgi`s returned by `get_global_corgis`.
    pub fn get_corgis_page_limit(&self) -> u64 {
        log!("::get_corgis_page_limit()");

        10
    }

    /// Transfer the given corgi to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: AccountId, id: String) {
        log!("::transfer_corgi({}, {})", receiver, id);

        if !env::is_valid_account_id(receiver.as_bytes()) {
            panic!("Receiver account `{}` is not a valid account id", receiver);
        }

        let owner = env::predecessor_account_id();

        if owner == receiver {
            panic!("Account `{}` attempted to make a self transfer", receiver);
        }

        let mut corgi = match self.corgis.get(&id) {
            None => panic!("Attempt to transfer a nonexistent Corgi id `{}`", id),
            Some(corgi) => corgi,
        };

        assert_eq!(corgi.id, id);

        if !self.can_transfer_on_behalf(corgi.owner.clone()) {
            panic!("The specified Corgi `{}` does not belong to sender", id);
        }

        self.delete_corgi_from(corgi.owner.clone(), id);

        corgi.owner = receiver;
        corgi.sender = owner;
        corgi.modified = env::block_timestamp();

        self.push_corgi(corgi);
    }

    pub fn can_transfer_on_behalf(&self, account_id: AccountId) -> bool {
        let initiator = env::predecessor_account_id();
        initiator == account_id
            || self
                .escrows_by_owner
                .get(&account_id)
                .map_or(false, |escrows| escrows.contains(&initiator))
    }

    fn push_corgi(&mut self, corgi: Corgi) -> Corgi {
        let id = corgi.id.clone();
        let corgi = self.corgis.push_front(&id, corgi);

        let mut ids = self
            .corgis_by_owner
            .get(&corgi.owner)
            .unwrap_or_else(|| Dict::new(corgi.owner.as_bytes().to_vec()));
        ids.push_front(&corgi.id, ());

        self.corgis_by_owner.insert(&corgi.owner, &ids);

        corgi
    }
}
