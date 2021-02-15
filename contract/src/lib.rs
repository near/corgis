#![deny(warnings)]

pub mod pack;

use std::collections::HashSet;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env, near_bindgen,
    serde::Serialize,
};

use pack::pack;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

const TRY_DELETE_UNKNOWN_ACCOUNT_MSG: &str = "The account does not have any corgis to delete from";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: UnorderedMap<String, Corgi>,
    corgis_by_owner: UnorderedMap<String, HashSet<String>>,
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
#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct Corgi {
    pub id: String,
    pub name: String,
    pub quote: String,
    pub color: String,
    pub background_color: String,
    rate: Rarity,
    sausage: String,
    pub owner: String,
    sender: String,
    message: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(test, derive(PartialEq, Debug))]
#[allow(non_camel_case_types)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    VERY_RARE,
    ULTRA_RARE,
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

        let corgi = {
            fn random_number() -> u128 {
                pack(&env::random_seed()) % 100
            }

            let id = {
                let seed = env::random_seed();
                env::log(format!("seed size: {}", seed.len()).as_bytes());
                let data = env::sha256(&seed);
                base64::encode(&data)
            };
            let rate = {
                let rate = random_number();
                if rate > 10 {
                    Rarity::COMMON
                } else if rate > 5 {
                    Rarity::UNCOMMON
                } else if rate > 1 {
                    Rarity::RARE
                } else if rate > 0 {
                    Rarity::VERY_RARE
                } else {
                    Rarity::ULTRA_RARE
                }
            };
            let sausage = {
                let l = random_number() / 2;
                match rate {
                    Rarity::ULTRA_RARE => 0,
                    Rarity::VERY_RARE => l + 150,
                    Rarity::RARE => l + 100,
                    Rarity::UNCOMMON => l + 50,
                    Rarity::COMMON => l,
                }
            }
            .to_string();
            Corgi {
                id,
                name,
                quote,
                color,
                background_color,
                rate,
                sausage,
                owner,
                sender: "".to_string(),
                message: "".to_string(),
            }
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
    pub fn get_corgis_by_owner(&self, owner: String) -> Vec<Corgi> {
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
            result.push(corgi);
        }
        result
    }

    /// Transfer the given corgi to `receiver`.
    pub fn transfer_corgi(&mut self, receiver: String, id: String, message: String) {
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
        corgi.message = message;

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
