use std::{
    cmp::min,
    collections::HashSet,
    ops::Deref,
    panic::{self, AssertUnwindSafe},
    time::{SystemTime, UNIX_EPOCH},
};

use corgis_nft::{Corgi, Model};
use near_sdk::{testing_env, MockedBlockchain, VMConfig, VMContext};
use near_vm_logic::VMLimitConfig;

struct ModelMock {
    contract: Model,
    context: VMContext,
    ids: Vec<(String, String)>,
}

impl Deref for ModelMock {
    type Target = Model;
    fn deref(&self) -> &Self::Target {
        &self.contract
    }
}

impl ModelMock {
    fn new() -> Self {
        let context = Self::test_context(vec![], false, None);
        Self {
            contract: Model::new(),
            context,
            ids: Vec::new(),
        }
    }

    fn signer_account_id(&self) -> String {
        self.context.signer_account_id.to_string()
    }

    fn create_corgi(&mut self, i: usize) -> Corgi {
        let name = format!("doggy dog {}", i);
        let quote = "To err is human — to forgive, canine";
        let color = "green";
        let background_color = "blue";

        let corgis_by_owner_count = self.get_corgis_by_owner(self.signer_account_id()).len();

        let new_corgi = self.contract.create_corgi(
            name.to_string(),
            quote.to_string(),
            color.to_string(),
            background_color.to_string(),
        );
        self.ids
            .push((new_corgi.id.clone(), self.signer_account_id()));

        println!("Created corgi id: {}", new_corgi.id);

        assert_eq!(new_corgi.name, name);
        assert_eq!(new_corgi.quote, quote);
        assert_eq!(new_corgi.color, color);
        assert_eq!(new_corgi.background_color, background_color);
        assert_eq!(new_corgi.sender, "");
        assert_eq!(new_corgi.owner, self.signer_account_id());
        // assert_eq!(new_corgi.created, self.context.block_timestamp);
        // assert_eq!(new_corgi.modified, self.context.block_timestamp);

        let corgi_by_id = self.get_corgi_by_id(new_corgi.id.clone());
        assert_eq!(corgi_by_id, new_corgi);

        let global_corgis = self.get_global_corgis();
        assert_eq!(
            global_corgis.len(),
            min(self.ids.len(), self.get_corgis_page_limit() as usize)
        );
        assert_eq!(
            global_corgis.get(0).unwrap(),
            &new_corgi,
            "First retrieved Corgi in global list was not last created Corgi"
        );
        self.check_global_corgis(global_corgis);

        let corgis_by_owner = self.get_corgis_by_owner(self.signer_account_id());
        assert_eq!(corgis_by_owner.len(), corgis_by_owner_count + 1);
        assert_eq!(&new_corgi, corgis_by_owner.get(0).unwrap());
        self.check_corgis_by_owner();

        Self::test_context(vec![], false, Some(vec![3, 2, 1, i as u8]));

        new_corgi
    }

    fn delete_corgi_by_index(&mut self, i: usize) {
        let (id, _) = self.ids[i].clone();
        self.delete_corgi(id);
    }

    fn transfer_corgi(&mut self, receiver: String, id: String) {
        let pre_global_corgis_count = self.get_global_corgis().len();
        let mut pre_corgis_by_receiver = self.get_corgis_by_owner(receiver.clone());
        let pre_corgis_by_sender = self.get_corgis_by_owner(self.signer_account_id());

        self.contract.transfer_corgi(receiver.clone(), id.clone());

        let corgi = self.get_corgi_by_id(id.to_string());
        assert_eq!(corgi.owner, receiver);

        let global_corgis = self.get_global_corgis();
        assert_eq!(global_corgis.len(), pre_global_corgis_count);
        assert_eq!(global_corgis.get(0).unwrap(), &corgi);

        assert_eq!(self.get_corgis_by_owner(receiver.clone()), {
            pre_corgis_by_receiver.insert(0, corgi);
            pre_corgis_by_receiver
        });

        assert_eq!(self.get_corgis_by_owner(self.signer_account_id()), {
            pre_corgis_by_sender
                .into_iter()
                .filter(|corgi| corgi.id != id)
                .collect::<Vec<Corgi>>()
        });
    }

    fn delete_corgi(&mut self, id: String) {
        let corgis_by_owner_count = self.get_corgis_by_owner(self.signer_account_id()).len();

        self.contract.delete_corgi(id.clone());

        let i = self.ids.iter().position(|x| x.0 == id).unwrap();
        self.ids.remove(i);

        let global_corgis = self.get_global_corgis();
        assert_eq!(
            global_corgis.len(),
            min(self.ids.len(), self.get_corgis_page_limit() as usize)
        );
        self.check_global_corgis(global_corgis);
        self.check_corgis_by_owner();

        assert_eq!(
            self.get_corgis_by_owner(self.signer_account_id()).len(),
            corgis_by_owner_count - 1
        );
        assert!(panic::catch_unwind(|| self.get_corgi_by_id(id.clone())).is_err());
        assert!(panic::catch_unwind(AssertUnwindSafe(|| self.delete_corgi(id.clone()))).is_err());
    }

    fn check_global_corgis(&self, global_corgis: Vec<Corgi>) {
        assert_eq!(
            &global_corgis
                .into_iter()
                .map(|corgi| (corgi.id, corgi.owner))
                .collect::<Vec<(String, String)>>(),
            &{
                let mut ids = self.ids.clone();
                ids.reverse();
                ids.truncate(self.get_corgis_page_limit() as usize);
                ids
            }
        );
    }

    fn check_corgis_by_owner(&self) {
        let owners = self
            .ids
            .iter()
            .map(|(_, owner)| owner)
            .collect::<HashSet<&String>>();
        for owner in owners {
            let corgis_by_owner = self.get_corgis_by_owner(owner.clone());
            let ids_by_owner = corgis_by_owner
                .iter()
                .map(|corgi| &corgi.id)
                .collect::<Vec<&String>>();

            let mut ids = self
                .ids
                .iter()
                .filter(|(_, o)| o == owner)
                .map(|(id, _)| id)
                .collect::<Vec<&String>>();
            ids.reverse();

            assert_eq!(ids_by_owner, ids);
        }
    }

    fn test_context(input: Vec<u8>, is_view: bool, random_seed: Option<Vec<u8>>) -> VMContext {
        let context = VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
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
        };
        testing_env!(
            context.clone(),
            VMConfig {
                limit_config: VMLimitConfig {
                    max_number_logs: 200,
                    ..Default::default()
                },
                ..Default::default()
            },
            Default::default()
        );
        context
    }
}

#[test]
fn get_empty_corgis() {
    let contract = ModelMock::new();
    assert!(contract.get_corgis_page_limit() > 0);
    assert_eq!(contract.get_global_corgis().len(), 0);
    assert_eq!(contract.get_corgis_by_owner("?".to_string()).len(), 0);
}

#[test]
#[should_panic]
fn should_panic_when_corgi_id_does_not_exist() {
    ModelMock::new().get_corgi_by_id("?".to_string());
}

#[test]
#[should_panic]
fn should_panic_when_name_is_too_large() {
    ModelMock::new().contract.create_corgi(
        ['?'; 32 + 1].iter().collect(),
        "Q".into(),
        "C".into(),
        "B".into(),
    );
}

#[test]
#[should_panic]
fn should_panic_when_quote_is_too_large() {
    ModelMock::new().contract.create_corgi(
        "N".into(),
        ['?'; 256 + 1].iter().collect(),
        "C".into(),
        "B".into(),
    );
}

#[test]
#[should_panic]
fn should_panic_when_color_is_too_large() {
    ModelMock::new().contract.create_corgi(
        "N".into(),
        "Q".into(),
        ['?'; 64 + 1].iter().collect(),
        "B".into(),
    );
}

#[test]
#[should_panic]
fn should_panic_when_background_color_is_too_large() {
    ModelMock::new().contract.create_corgi(
        "N".into(),
        "Q".into(),
        "C".into(),
        ['?'; 64 + 1].iter().collect(),
    );
}

#[test]
fn create_a_corgi() {
    ModelMock::new().create_corgi(42);
}

#[test]
fn create_a_few_corgis() {
    let mut contract = ModelMock::new();
    for i in 1..=20 {
        contract.create_corgi(i as usize);
    }
}

#[test]
fn create_and_delete_corgi() {
    let mut contract = ModelMock::new();
    for i in 1..=20 {
        let id = contract.create_corgi(i as usize).id;
        contract.delete_corgi(id);
    }
}

#[test]
#[should_panic]
fn should_panic_when_there_are_no_corgis_to_delete() {
    ModelMock::new().delete_corgi("?".to_string());
}

#[test]
#[should_panic]
fn should_panic_when_corgi_to_delete_does_not_exist() {
    let mut contract = ModelMock::new();
    contract.create_corgi(42);
    contract.delete_corgi("?".to_string());
}

#[test]
fn create_and_delete_a_few_corgis() {
    let mut contract = ModelMock::new();

    for i in 1..=15 {
        contract.create_corgi(i);
    }

    contract.delete_corgi_by_index(2);
    contract.delete_corgi_by_index(3);
    contract.delete_corgi_by_index(0);
}

#[test]
fn transfer_a_corgi() {
    let mut contract = ModelMock::new();
    let receiver = "bob.testnet";

    let id = contract.create_corgi(42).id;
    contract.transfer_corgi(receiver.to_string(), id.clone());
}

#[test]
fn transfer_a_few_corgis() {
    let mut contract = ModelMock::new();

    for i in 1..=20 {
        contract.create_corgi(i);
    }

    let receiver = "bob.testnet";
    contract.transfer_corgi(receiver.to_string(), contract.ids[2].clone().0);
    contract.transfer_corgi(receiver.to_string(), contract.ids[9].clone().0);
    contract.transfer_corgi(receiver.to_string(), contract.ids[0].clone().0);
    contract.transfer_corgi(receiver.to_string(), contract.ids[3].clone().0);
    contract.transfer_corgi(receiver.to_string(), contract.ids[7].clone().0);
}

#[test]
#[should_panic]
fn should_panic_when_self_transfer() {
    let mut contract = ModelMock::new();
    let id = contract.create_corgi(42).id;
    let receiver = contract.signer_account_id();
    contract.transfer_corgi(receiver.clone(), id);
}

#[test]
#[should_panic]
fn should_panic_when_sender_is_not_owner() {
    let mut contract = ModelMock::new();
    let id = contract.create_corgi(42).id;
    let receiver = "bob.testnet";
    contract.transfer_corgi(receiver.to_string(), id.clone());
    contract.transfer_corgi(receiver.to_string(), id.clone());
}

#[test]
#[should_panic]
fn should_panic_when_transfer_receiver_is_invalid() {
    let mut contract = ModelMock::new();
    let id = contract.create_corgi(42).id;
    let invalid_receiver = "bob.testnet.";
    contract.transfer_corgi(invalid_receiver.to_string(), id);
}
