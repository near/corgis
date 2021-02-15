use std::collections::HashSet;

use corgis_nft::{Corgi, Model};
use near_sdk::{testing_env, MockedBlockchain, VMContext};

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

fn create_test_corgi(contract: &mut Model, i: usize) -> (Corgi, String, String, String, String) {
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
