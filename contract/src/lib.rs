#![deny(warnings)]

use std::collections::HashSet;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env, near_bindgen,
    serde::Serialize,
};

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

const TRY_DELETE_UNKNOWN_ACCOUNT_MSG: &str = "The account does not have any corgis to delete from";
// const TRY_DELETE_UNEXISTENT_CORGI: &str = "The specified corgi id was not found";

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
    id: String,
    name: String,
    quote: String,
    color: String,
    background_color: String,
    rate: Rarity,
    sausage: String,
    owner: String,
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

fn pack(data: &[u8]) -> u64 {
    let mut result = 0u64;
    for i in 0..std::cmp::min(data.len(), 8) {
        result += (0xff & data[i] as u64) << (i * 8);
    }

    result
}

// use the attribute below for unit tests
#[cfg(test)]
mod tests {

    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};
    use std::collections::HashSet;

    // part of writing unit tests is setting up a mock context
    // in this example, this is only needed for env::log in the contract
    // this is also a useful list to peek at when wondering what's available in env::*
    fn get_context(input: Vec<u8>, is_view: bool, random_seed: Option<Vec<u8>>) -> VMContext {
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
            // Important to increase storage usage is several items are going to be created.
            // https://github.com/near/near-sdk-rs/issues/159#issuecomment-631847439
            storage_usage: 100_000,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: random_seed.unwrap_or_else(|| vec![3, 2, 1]),
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    fn create_test_corgi(
        contract: &mut Model,
        i: usize,
    ) -> (Corgi, String, String, String, String) {
        let name = format!("doggy dog {}", i);
        let quote = "To err is human — to forgive, canine";
        let color = "green";
        let background_color = "blue";
        (
            contract.create_corgi(
                name.to_string(),
                quote.to_string(),
                color.to_string(),
                background_color.to_string(),
            ),
            name.to_string(),
            quote.to_string(),
            color.to_string(),
            background_color.to_string(),
        )
    }

    fn assert_eq_as_sets(left: &Vec<String>, right: &Vec<String>) {
        assert_eq!(
            left.iter()
                .map(|id| id.to_string())
                .collect::<HashSet<String>>(),
            right
                .iter()
                .map(|id| id.to_string())
                .collect::<HashSet<String>>(),
        );
    }

    #[test]
    fn empty_global_corgis() {
        testing_env!(get_context(vec![], false, None));

        let contract = Model::new();
        let corgis = contract.get_global_corgis();
        assert_eq!(0, corgis.len());
    }

    #[test]
    #[should_panic]
    fn get_unexistent_corgi_by_id() {
        testing_env!(get_context(vec![], false, None));

        let contract = Model::new();
        contract.get_corgi_by_id("?".to_string());
    }

    #[test]
    fn create_a_corgi() {
        let context = get_context(vec![], false, None);
        let signer = context.signer_account_id.to_owned();
        testing_env!(context);

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let (new_corgi, name, quote, color, background_color) = create_test_corgi(&mut contract, 0);

        let corgi = contract.get_corgi_by_id(new_corgi.id.to_string());
        assert_eq!(new_corgi.id, corgi.id);
        assert_eq!(name, corgi.name);
        assert_eq!(quote, corgi.quote);
        assert_eq!(color, corgi.color);
        assert_eq!(background_color, corgi.background_color);
        assert_eq!(signer, corgi.owner);

        let global_corgis = contract.get_global_corgis();
        assert_eq!(1, global_corgis.len());
        assert_eq!(new_corgi.id, global_corgis.get(0).unwrap().id);

        let corgis_by_owner = contract.get_corgis_by_owner(signer);
        assert_eq!(1, corgis_by_owner.len());

        let corgi = corgis_by_owner.get(0).unwrap();
        println!("Corgi: {:?}", corgi);
        assert_eq!(new_corgi.id, corgi.id);
    }

    #[test]
    fn create_and_delete_corgi() {
        let context = get_context(vec![], false, None);
        testing_env!(context);

        let mut contract = Model::new();

        assert_eq!(0, contract.get_global_corgis().len());

        let (new_corgi, ..) = create_test_corgi(&mut contract, 0);

        assert_eq!(1, contract.get_global_corgis().len());

        contract.delete_corgi(new_corgi.id);

        assert_eq!(0, contract.get_global_corgis().len());
    }

    #[test]
    fn create_a_few_corgis() {
        let context = get_context(vec![], false, None);
        let signer = context.signer_account_id.to_owned();
        testing_env!(context);

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let mut ids = Vec::new();
        let n = 5;
        for i in 1..=n {
            let (new_corgi, ..) = create_test_corgi(&mut contract, i);
            testing_env!(get_context(vec![], false, Some(vec![3, 2, 1, i as u8])));
            println!("Test Corgi id: {}", new_corgi.id);
            ids.push(new_corgi.id);
        }

        assert_eq!(n, contract.get_global_corgis().len());

        let corgis_by_owner = contract.get_corgis_by_owner(signer);
        assert_eq!(n, corgis_by_owner.len());
        let cids: Vec<String> = corgis_by_owner.into_iter().map(|corgi| corgi.id).collect();
        assert_eq_as_sets(&ids, &cids);
    }

    #[test]
    fn create_and_delete_a_few_corgis() {
        let context = get_context(vec![], false, None);
        let signer = context.signer_account_id.to_owned();
        testing_env!(context);

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let mut ids = Vec::new();
        let n = 5;
        for i in 1..=n {
            let (new_corgi, ..) = create_test_corgi(&mut contract, i);
            testing_env!(get_context(vec![], false, Some(vec![3, 2, 1, i as u8])));
            println!("Test Corgi id: {}", new_corgi.id);
            ids.push(new_corgi.id);
        }

        assert_eq!(contract.get_global_corgis().len(), n);

        let check_state = |contract: &Model, ids: &Vec<String>| {
            assert_eq!(contract.get_global_corgis().len(), ids.len());
            let corgis_by_owner = contract.get_corgis_by_owner(signer.to_string());
            assert_eq!(corgis_by_owner.len(), ids.len());
            let cids: Vec<String> = corgis_by_owner.into_iter().map(|corgi| corgi.id).collect();
            assert_eq_as_sets(ids, &cids);
        };

        let id = ids.remove(2);
        contract.delete_corgi(id);
        check_state(&contract, &ids);

        let id = ids.remove(3);
        contract.delete_corgi(id);
        check_state(&contract, &ids);

        let id = ids.remove(0);
        contract.delete_corgi(id);
        check_state(&contract, &ids);
    }

    #[test]
    #[should_panic]
    fn try_delete_unexistent_corgi_without_account() {
        let context = get_context(vec![], false, None);
        testing_env!(context);

        let mut contract = Model::new();

        create_test_corgi(&mut contract, 0);
        contract.delete_corgi("?".to_string());
    }

    #[test]
    #[should_panic]
    fn try_delete_unexistent_corgi() {
        let context = get_context(vec![], false, None);
        testing_env!(context);

        let mut contract = Model::new();

        contract.delete_corgi("?".to_string());
    }

    #[test]
    fn transfer_a_corgi() {
        let context = get_context(vec![], false, None);
        testing_env!(context.clone());

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let (new_corgi, ..) = create_test_corgi(&mut contract, 42);
        println!("Test Corgi id: {}", new_corgi.id);
        assert_eq!(1, contract.get_global_corgis().len());
        assert_eq!(
            contract
                .get_corgis_by_owner(context.signer_account_id.to_string())
                .len(),
            1
        );

        let receiver = "bob.testnet";
        contract.transfer_corgi(
            receiver.to_string(),
            new_corgi.id.to_string(),
            "A Corgi will make you happier!".to_string(),
        );

        assert_eq!(1, contract.get_global_corgis().len());

        let corgi = contract.get_corgi_by_id(new_corgi.id.to_string());
        assert_eq!(corgi.owner, receiver);

        let receivers_corgis = contract.get_corgis_by_owner(receiver.to_string());
        assert_eq!(receivers_corgis.len(), 1);
        assert_eq!(receivers_corgis.get(0).unwrap().id, new_corgi.id);

        let senders_corgis = contract.get_corgis_by_owner(context.signer_account_id);
        assert_eq!(senders_corgis.len(), 0);
    }

    #[test]
    fn transfer_a_few_corgis() {
        let context = get_context(vec![], false, None);
        testing_env!(context.clone());

        let mut contract = Model::new();
        assert_eq!(0, contract.get_global_corgis().len());

        let mut ids = Vec::new();
        let n = 5;
        for i in 1..=n {
            let (new_corgi, ..) = create_test_corgi(&mut contract, i);
            testing_env!(get_context(vec![], false, Some(vec![3, 2, 1, i as u8])));
            println!("Test Corgi id: {}", new_corgi.id);
            ids.push(new_corgi.id);
        }

        assert_eq!(contract.get_global_corgis().len(), n);
        assert_eq!(
            contract
                .get_corgis_by_owner(context.signer_account_id.to_string())
                .len(),
            n
        );

        let receiver = "bob.testnet";
        contract.transfer_corgi(
            receiver.to_string(),
            ids[2].to_string(),
            "A Corgi will make you happier!".to_string(),
        );

        assert_eq!(contract.get_global_corgis().len(), n);
        assert_eq!(
            contract
                .get_corgis_by_owner(context.signer_account_id.to_string())
                .len(),
            n - 1
        );
        assert_eq!(contract.get_corgis_by_owner(receiver.to_string()).len(), 1);

        let corgi = contract.get_corgi_by_id(ids[2].to_string());
        assert_eq!(corgi.owner, receiver);

        let receivers_corgis = contract.get_corgis_by_owner(receiver.to_string());
        assert_eq!(receivers_corgis.len(), 1);
        assert_eq!(receivers_corgis.get(0).unwrap().id, ids[2].to_string());

        let senders_corgis = contract.get_corgis_by_owner(context.signer_account_id);
        assert_eq!(
            senders_corgis
                .iter()
                .filter(|corgi| corgi.id == ids[2].to_string())
                .collect::<Vec<&Corgi>>()
                .len(),
            0
        );
    }

    #[test]
    fn pack_test() {
        assert_eq!(0, pack(&[0, 0, 0]));
        assert_eq!(127, pack(&[127, 0, 0]));
        assert_eq!(256, pack(&[0, 1, 0]));
        assert_eq!(512, pack(&[0, 2, 0]));
        assert_eq!(65536, pack(&[0, 0, 1]));
        assert_eq!(65536 + 256 + 1, pack(&[1, 1, 1]));

        assert_eq!(3, pack(&[3, 0, 0, 0, 0, 0, 0, 0, 1]));
    }
}
