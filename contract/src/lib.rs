use near_sdk::collections::Vector;
use near_sdk::collections::UnorderedMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
use near_sdk::serde::Serialize;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Model {
    corgis: UnorderedMap<String, Vector<Corgi>>
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
#[derive(BorshDeserialize, BorshSerialize)]
#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct Corgi {
    id: String,
    name: String,
    quote: String,
    color: String,
    background_color: String,
    rate: Rarity,
    sausage: String,
}

#[derive(BorshDeserialize, BorshSerialize)]
#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(test, derive(PartialEq, Debug))]
#[allow(non_camel_case_types)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    VERY_RARE,
    ULTRA_RARE
}

impl Default for Model {
    fn default() -> Self {
        env::log(b"Default initialization of corgis model");
        Self {
            corgis: UnorderedMap::new(b"corgis".to_vec()),
        }
    }
}

#[near_bindgen]
impl Model {

    /// Initializes the contract.
    /// 
    /// ```sh
    /// near deploy --wasmFile target/wasm32-unknown-unknown/release/rust_corgis.wasm --initFunction init --initArgs '{}'  
    /// ```
    /// 
    #[init]
    pub fn new() -> Self {
        env::log(b"Init non-default CorgisContract");
        Self {
            corgis: UnorderedMap::new(b"corgis".to_vec()),
        }
    }

    /// Creates a `Corgi` under the `signer_account_id`.
    /// 
    /// Returns the `id` of the generated `Corgi` encoded using base64.
    pub fn create_corgi(&mut self, name: String, quote: String, color: String, background_color: String) -> String {
        let owner = env::signer_account_id();
        env::log(format!("create corgi owned by {}", owner).as_bytes());

        let corgi = {
            fn random_number() -> u64 {
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
            }.to_string();
            Corgi {
                id,
                name,
                quote,
                color,
                background_color,
                rate,
                sausage,
            }
        };

        match self.corgis.get(&owner) {
            None => {
                let mut list = Vector::new(b"owner".to_vec());
                list.push(&corgi);
                self.corgis.insert(&owner, &list);
            }
            Some(mut list) => {
                list.push(&corgi);
                self.corgis.insert(&owner, &list);
            }
        };

        corgi.id
    }

    /// Gets the `Corgi`s owned by the `owner` account id.
    /// The `owner` must be a valid account id.
    ///
    /// Note, the parameter is `&self` (without being mutable)
    /// meaning it doesn't modify state.
    /// In the frontend (`/src/index.js`) this is added to the `"viewMethods"` array.
    /// 
    /// Using `near-cli` we can call this contract by:
    ///
    /// ```sh
    /// near view YOU.testnet get_corgis_by_owner
    /// ```
    pub fn get_corgis_by_owner(&self, owner: String) -> Vec<Corgi> {
        env::log(format!("get corgis by owner <{}>", owner).as_bytes());

        match self.corgis.get(&owner) {
            None => Vec::new(),
            Some(list) => list.to_vec(),
        }
    }

    /// Get the `Corgi`s of the current account id.
    /// 
    /// Using `near-cli` we can call this contract by:
    ///
    /// ```sh
    /// near view YOU.testnet get_my_corgis
    /// ```
    pub fn get_my_corgis(&self) -> Vec<Corgi> {
        let owner = env::signer_account_id();
        env::log(format!("get current user's <{}> corgis", owner).as_bytes());

        self.get_corgis_by_owner(owner)
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

        let mut list = Vec::new();
        for set in self.corgis.values() {
            for corgi in set.iter() {
                list.push(corgi);
            }
        }
        list
    }

}

fn pack(data: &[u8]) -> u64 {
    let mut result = 0u64;
    for i in 0..std::cmp::min(data.len(), 8) {
        result += (0xff & data[i] as u64) << (i*8);
    }

    result
}

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // part of writing unit tests is setting up a mock context
    // in this example, this is only needed for env::log in the contract
    // this is also a useful list to peek at when wondering what's available in env::*
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![3, 2, 1],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn initial_global_corgis() {
        let context = get_context(vec![], false);
        testing_env!(context);

        let contract = Model::new();
        let corgis = contract.get_global_corgis();
        assert_eq!(0, corgis.len());
    }

    #[test]
    fn create_a_corgi() {
        let context = get_context(vec![], false);
        let signer = context.signer_account_id.to_owned();
        testing_env!(context);

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let id = create_test_corgi(&mut contract, 0);

        let global_corgis = contract.get_global_corgis();
        assert_eq!(1, global_corgis.len());
        assert_eq!(id, global_corgis.get(0).unwrap().id);

        let corgis_by_owner = contract.get_corgis_by_owner(signer);
        assert_eq!(1, corgis_by_owner.len());

        let corgi = corgis_by_owner.get(0).unwrap();
        println!("Corgi: {:?}", corgi);
        assert_eq!(id, corgi.id);

        assert_eq!(corgis_by_owner, contract.get_my_corgis());
    }

    #[test]
    fn create_a_few_corgis() {
        let context = get_context(vec![], false);
        let signer = context.signer_account_id.to_owned();
        testing_env!(context);

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let mut ids = Vec::new();
        let n = 5;
        for i in 1..=n {
            let id = create_test_corgi(&mut contract, i);
            println!("Test Corgi id: {}", id);
            ids.push(id);
        }

        assert_eq!(n, contract.get_global_corgis().len());

        let corgis_by_owner = contract.get_corgis_by_owner(signer);
        assert_eq!(n, corgis_by_owner.len());
        let cids: Vec<String> = corgis_by_owner.into_iter().map(|corgi| corgi.id).collect();
        assert_eq!(ids, cids);
    }

    fn create_test_corgi(contract: &mut Model, i: usize) -> String {
        contract.create_corgi(
            format!("doggy dog {}", i),
            "To err is human — to forgive, canine".to_string(),
            "green".to_string(),
            "blue".to_string())
    }

    #[test]
    fn pack_test() {
        assert_eq!(0, pack(&[0, 0, 0]));
        assert_eq!(127, pack(&[127, 0, 0]));
        assert_eq!(256, pack(&[0, 1, 0]));
        assert_eq!(512, pack(&[0, 2, 0]));
        assert_eq!(65536, pack(&[0, 0, 1]));
        assert_eq!(65536+256+1, pack(&[1, 1, 1]));

        assert_eq!(3, pack(&[3, 0, 0, 0, 0, 0, 0, 0, 1]));
    }

}