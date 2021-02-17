#![deny(warnings)]

pub mod pack;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env, near_bindgen,
    serde::Serialize,
    wee_alloc::WeeAlloc,
    AccountId,
};
use std::{collections::HashSet, usize};

use pack::pack;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

/// The token ID type is also defined in the NEP
pub type TokenId = u64;
pub type AccountIdHash = Vec<u8>;

/// This trait provides the baseline of functions as described at:
/// https://github.com/nearprotocol/NEPs/blob/nep-4/specs/Standards/Tokens/NonFungibleToken.md
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

const TRY_DELETE_UNKNOWN_ACCOUNT_MSG: &str = "The account does not have any corgis to delete from";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: UnorderedMap<String, Corgi>,
    corgis_by_owner: UnorderedMap<AccountId, HashSet<String>>,
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

impl Default for Model {
    fn default() -> Self {
        env::log(b"Default initialization of corgis model");
        Self {
            corgis: UnorderedMap::new(b"corgis".to_vec()),
            corgis_by_owner: UnorderedMap::new(b"corgis-by-owner".to_vec()),
        }
    }
}

#[near_bindgen]
impl Model {
    /// Initializes the contract.
    ///
    /// ```sh
    /// near deploy --wasmFile target/wasm32-unknown-unknown/release/corgis_nft.wasm --initFunction init --initArgs '{}'  
    /// ```
    ///
    #[init]
    pub fn new() -> Self {
        env::log(b"Init non-default CorgisContract");
        Self {
            corgis: UnorderedMap::new(b"corgis".to_vec()),
            corgis_by_owner: UnorderedMap::new(b"corgis-by-owner".to_vec()),
        }
    }

    /// Creates a `Corgi` under the `signer_account_id`.
    ///
    /// Returns the `id` of the generated `Corgi` encoded using base64.
    pub fn create_corgi(
        &mut self,
        name: String,
        quote: String,
        color: String,
        background_color: String,
    ) -> Corgi {
        let owner = env::signer_account_id();
        env::log(format!("create corgi owned by {}", owner).as_bytes());

        assert!(
            name.len() <= 32,
            "Corgi's `name` is too large, max 32 chars allowed"
        );
        assert!(
            quote.len() <= 256,
            "Corgi's `quote` is too large, max 256 chars allowed"
        );
        assert!(
            color.len() <= 64,
            "Corgi's `color` is too large, max 64 chars allowed"
        );
        assert!(
            background_color.len() <= 64,
            "Corgi's `background_color` is too large, max 64 chars allowed"
        );

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
                let rate = pack(&env::random_seed()) % 100;
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

        self.append_corgi(&corgi);

        corgi
    }

    /// Gets the `Corgi` by the given `id`.
    pub fn get_corgi_by_id(&self, id: String) -> Corgi {
        let corgi = self.corgis.get(&id).expect("Corgi not found");
        assert!(corgi.id == id);
        corgi
    }

    /// Gets the `Corgi`s owned by the `owner` account id.
    /// The `owner` must be a valid account id.
    ///
    /// Note, the parameter is `&self` (without being mutable)
    /// meaning it doesn't modify state.
    /// In the frontend (`/src/index.js`) this is added to the `"viewMethods"` array.
    pub fn get_corgis_by_owner(&self, owner: AccountId) -> Vec<Corgi> {
        env::log(format!("get corgis by owner <{}>", owner).as_bytes());

        match self.corgis_by_owner.get(&owner) {
            None => Vec::new(),
            Some(list) => list
                .into_iter()
                .map(|id| {
                    let corgi = self.corgis.get(&id).expect("Could not find Corgi by id");
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
        env::log(format!("delete corgi by id").as_bytes());

        let owner = env::signer_account_id();

        match self.corgis_by_owner.get(&owner) {
            None => env::panic(TRY_DELETE_UNKNOWN_ACCOUNT_MSG.as_bytes()),
            Some(mut list) => {
                let was_removed_from_global_list = self.corgis.remove(&id);
                assert!(was_removed_from_global_list.is_some());

                let removed_corgi = was_removed_from_global_list.unwrap();
                assert!(removed_corgi.owner == owner);
                assert!(removed_corgi.id == id);

                let was_removed_from_owner_list = list.remove(&id);
                assert!(was_removed_from_owner_list);

                self.corgis_by_owner.insert(&owner, &list);
            }
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
        env::log(format!("get global list of corgis").as_bytes());

        let mut result = Vec::new();
        for corgi in self.corgis.values() {
            if result.len() >= self.get_corgis_page_limit() as usize {
                break;
            }
            result.push(corgi);
        }
        result
    }

    /// Returns the max amount of `Corgi`s returned by `get_global_corgis`.
    pub fn get_corgis_page_limit(&self) -> u64 {
        8
    }

    /// Transfer the given corgi to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: AccountId, id: String) {
        let owner = env::signer_account_id();
        let mut corgi = self
            .corgis
            .get(&id)
            .expect("The Corgi with the given id does not exist");

        assert!(corgi.id == id);
        assert!(
            corgi.owner == owner,
            "The specified Corgi does not belong to sender"
        );
        corgi.owner = receiver;
        corgi.sender = owner;

        self.delete_corgi(id);
        self.append_corgi(&corgi);
    }

    fn append_corgi(&mut self, corgi: &Corgi) {
        let previous_corgi = self.corgis.insert(&corgi.id, corgi);
        assert!(
            previous_corgi.is_none(),
            "A previous Corgi already exists with id `{}`, aborting",
            corgi.id
        );

        let mut ids = self
            .corgis_by_owner
            .get(&corgi.owner)
            .unwrap_or_else(|| HashSet::new());
        let is_new_element = ids.insert(corgi.id.to_string());
        assert!(is_new_element);

        self.corgis_by_owner.insert(&corgi.owner, &ids);
    }
}
