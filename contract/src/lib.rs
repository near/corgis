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

pub type CorgiId = String;

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

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: UnorderedMap<String, CorgiNode>,
    corgis_by_owner: UnorderedMap<AccountId, HashSet<String>>,
    first: CorgiId,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct CorgiNode {
    next: CorgiId,
    prev: CorgiId,
    corgi: Corgi,
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
        env::log(format!("Init of corgis contract {}", env!("CARGO_PKG_VERSION")).as_bytes());
        Self {
            corgis: UnorderedMap::new("C".as_bytes().to_vec()),
            corgis_by_owner: UnorderedMap::new("O".as_bytes().to_vec()),
            first: "".to_string(),
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
        env::log(b"Using new to initialize corgis contract");
        Self::default()
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

        self.push_corgi(corgi)
    }

    /// Gets the `Corgi` by the given `id`.
    pub fn get_corgi_by_id(&self, id: CorgiId) -> Corgi {
        let node = self.corgis.get(&id).expect("Corgi not found");
        assert!(node.corgi.id == id);
        node.corgi
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
                    let node = self.corgis.get(&id).expect("Could not find Corgi by id");
                    assert!(node.corgi.id == id);
                    assert!(node.corgi.owner == owner, "The corgi with id `{}` owned by `{}` was found while fetching `{}`'s corgis", id, node.corgi.owner, owner);
                    node.corgi
                })
                .collect(),
        }
    }

    /// Delete the `Corgi` by `id`.
    /// Only the owner of the `Corgi` can delete it.
    pub fn delete_corgi(&mut self, id: String) {
        env::log(format!("delete corgi by id").as_bytes());

        let owner = env::signer_account_id();

        let mut list = self
            .corgis_by_owner
            .get(&owner)
            .expect("The account does not have any corgis to delete from");
        let removed_node = self.corgis.remove(&id).expect("Corgi id not found");
        assert!(removed_node.corgi.owner == owner);
        assert!(removed_node.corgi.id == id);

        self.delete_corgi_from_list(removed_node);

        let was_removed_from_owner_list = list.remove(&id);
        assert!(was_removed_from_owner_list);

        self.corgis_by_owner.insert(&owner, &list);
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
        let mut id = self.first.clone();
        while id != "" {
            if result.len() >= self.get_corgis_page_limit() as usize {
                break;
            }

            let node = self
                .corgis
                .get(&id)
                .expect("Not able to get corgi for display");
            result.push(node.corgi);
            id = node.next
        }

        result
    }

    /// Returns the max amount of `Corgi`s returned by `get_global_corgis`.
    pub fn get_corgis_page_limit(&self) -> u64 {
        10
    }

    /// Transfer the given corgi to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: AccountId, id: String) {
        let owner = env::signer_account_id();
        let mut node = self
            .corgis
            .get(&id)
            .expect("The Corgi with the given id does not exist");

        assert!(node.corgi.id == id);
        assert!(
            node.corgi.owner == owner,
            "The specified Corgi does not belong to sender"
        );
        node.corgi.owner = receiver;
        node.corgi.sender = owner;

        self.delete_corgi(id);
        self.push_corgi(node.corgi);
    }

    fn push_corgi(&mut self, corgi: Corgi) -> Corgi {
        let node = self.push_corgi_to_list(corgi);
        self.corgis.insert(&node.corgi.id, &node);

        let mut ids = self
            .corgis_by_owner
            .get(&node.corgi.owner)
            .unwrap_or_else(|| HashSet::new());
        let is_new_element = ids.insert(node.corgi.id.to_string());
        assert!(is_new_element);

        self.corgis_by_owner.insert(&node.corgi.owner, &ids);

        node.corgi
    }

    fn push_corgi_to_list(&mut self, corgi: Corgi) -> CorgiNode {
        if self.first != "" {
            let mut node = self.corgis.get(&self.first).unwrap();
            node.prev = corgi.id.clone();
            self.corgis.insert(&self.first, &node);
        }

        let node = CorgiNode {
            next: self.first.clone(),
            prev: "".to_string(),
            corgi,
        };

        self.first = node.corgi.id.clone();

        node
    }

    fn delete_corgi_from_list(&mut self, removed_node: CorgiNode) {
        if removed_node.prev == "" {
            self.first = removed_node.next;
        } else {
            let mut node = self.corgis.get(&removed_node.prev).unwrap();
            node.next = removed_node.next;
            self.corgis.insert(&removed_node.prev, &node);
        }
    }
}
