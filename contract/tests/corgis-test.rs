use std::{
    cmp::min,
    collections::HashSet,
    ops::{Deref, DerefMut},
    panic::{self, catch_unwind, AssertUnwindSafe},
};

mod context;

use context::MockedContext;

use corgis_nft::{Corgi, Model, NEP4};

fn alice() -> String {
    "alice.mock".to_string()
}

fn bob() -> String {
    "bob.mock".to_string()
}

fn charlie() -> String {
    "charlie.mock".to_string()
}

fn ted() -> String {
    "ted.mock".to_string()
}

struct ContractChecker {
    contract: Model,
    ids: Vec<(String, String)>,
}

impl Deref for ContractChecker {
    type Target = Model;
    fn deref(&self) -> &Self::Target {
        &self.contract
    }
}

impl DerefMut for ContractChecker {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.contract
    }
}

fn init_test() -> MockedContext<ContractChecker> {
    MockedContext::new(|| ContractChecker {
        contract: Model::new(),
        ids: Vec::new(),
    })
}

impl MockedContext<ContractChecker> {
    fn predecessor_account_id(&self) -> String {
        self.context.predecessor_account_id.clone()
    }

    fn create_test_corgi(&mut self, i: usize) -> Corgi {
        let name = format!("doggy dog {}", i);
        let quote = "To err is human — to forgive, canine";
        let color = "green";
        let background_color = "blue";

        let corgis_by_owner_count = self
            .get_corgis_by_owner(self.predecessor_account_id())
            .len();

        let new_corgi = self.contract.create_corgi(
            name.to_string(),
            quote.to_string(),
            color.to_string(),
            background_color.to_string(),
        );

        println!("Created corgi id: {}", new_corgi.id);

        assert_eq!(new_corgi.name, name);
        assert_eq!(new_corgi.quote, quote);
        assert_eq!(new_corgi.color, color);
        assert_eq!(new_corgi.background_color, background_color);
        assert_eq!(new_corgi.sender, "");
        assert_eq!(new_corgi.owner, self.predecessor_account_id());
        assert_eq!(new_corgi.created, self.context.block_timestamp);
        assert_eq!(new_corgi.modified, self.context.block_timestamp);

        let account = self.predecessor_account_id();
        self.ids.push((new_corgi.id.clone(), account));

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

        let corgis_by_owner = self.get_corgis_by_owner(self.predecessor_account_id());
        assert_eq!(corgis_by_owner.len(), corgis_by_owner_count + 1);
        assert_eq!(&new_corgi, corgis_by_owner.get(0).unwrap());
        self.check_corgis_by_owner();

        new_corgi
    }

    fn delete_corgi_by_index(&mut self, i: usize) {
        let (id, _) = self.ids[i].clone();
        println!("del {}", id);
        self.delete_corgi(id);
    }

    fn transfer_corgi(&mut self, receiver: String, id: String) {
        let pre_global_corgis_count = self.get_global_corgis().len();
        let mut pre_corgis_by_receiver = self.get_corgis_by_owner(receiver.clone());
        let pre_corgis_by_sender = self.get_corgis_by_owner(self.predecessor_account_id());

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

        assert_eq!(self.get_corgis_by_owner(self.predecessor_account_id()), {
            pre_corgis_by_sender
                .into_iter()
                .filter(|corgi| corgi.id != id)
                .collect::<Vec<Corgi>>()
        });
    }

    fn delete_corgi(&mut self, id: String) {
        let corgis_by_owner_count = self
            .get_corgis_by_owner(self.predecessor_account_id())
            .len();

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
            self.get_corgis_by_owner(self.predecessor_account_id())
                .len(),
            corgis_by_owner_count - 1
        );
        assert!(panic::catch_unwind(|| self.get_corgi_by_id(id.clone())).is_err());
        assert!(
            panic::catch_unwind(AssertUnwindSafe(|| self.contract.delete_corgi(id.clone())))
                .is_err()
        );
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
}

#[test]
fn initial_state() {
    init_test().run_as(alice(), |contract| {
        assert!(contract.get_corgis_page_limit() > 0);
        assert_eq!(contract.get_global_corgis().len(), 0);
        assert_eq!(contract.get_corgis_by_owner(alice()).len(), 0);
    });
}

#[test]
#[should_panic(expected = "The given corgi id `<?>` was not found")]
fn should_panic_when_corgi_id_does_not_exist() {
    init_test().run_as(alice(), |contract| {
        contract.get_corgi_by_id("<?>".to_string());
    });
}

#[test]
#[should_panic(expected = "Name exceeds max 32 chars allowed")]
fn should_panic_when_name_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.create_corgi(
            ['?'; 32 + 1].iter().collect(),
            "Q".into(),
            "C".into(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Quote exceeds max 256 chars allowed")]
fn should_panic_when_quote_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.create_corgi(
            "N".into(),
            ['?'; 256 + 1].iter().collect(),
            "C".into(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Color exceeds max 64 chars allowed")]
fn should_panic_when_color_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.create_corgi(
            "N".into(),
            "Q".into(),
            ['?'; 64 + 1].iter().collect(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Back color exceeds 64 chars")]
fn should_panic_when_background_color_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.create_corgi(
            "N".into(),
            "Q".into(),
            "C".into(),
            ['?'; 64 + 1].iter().collect(),
        );
    });
}

#[test]
fn create_a_corgi() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
    });
}

#[test]
fn create_a_few_corgis() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=20 {
            contract.create_test_corgi(i as usize);
        }
    });
}

#[test]
fn create_and_delete_corgi() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=20 {
            let id = contract.create_test_corgi(i as usize).id;
            contract.delete_corgi(id);
        }
    });
}

#[test]
#[should_panic(expected = "Account `alice.mock` does not have corgis to delete from")]
fn should_panic_when_there_are_no_corgis_to_delete() {
    init_test().run_as(alice(), |contract| {
        contract.delete_corgi("<?>".to_string());
    });
}

#[test]
#[should_panic(expected = "Corgi id `<?>` does not belong to account `alice.mock`")]
fn should_panic_when_corgi_to_delete_does_not_exist() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
        contract.delete_corgi("<?>".to_string());
    });
}

#[test]
fn create_and_delete_a_few_corgis() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=15 {
            contract.create_test_corgi(i);
        }

        contract.delete_corgi_by_index(2);
        contract.delete_corgi_by_index(3);
        contract.delete_corgi_by_index(0);
    });
}

#[test]
fn prevent_to_delete_someone_else_corgi() {
    init_test()
        .run_as(alice(), |contract| {
            contract.create_test_corgi(42);
        })
        .run_as(bob(), |contract| {
            assert!(catch_unwind(AssertUnwindSafe(|| contract.delete_corgi_by_index(0))).is_err());

            let corgis = contract.get_corgis_by_owner(alice());
            assert_eq!(corgis.len(), 1);
            assert_eq!(corgis[0].id, contract.ids[0].0);
        });
}

#[test]
fn transfer_a_corgi() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id;
        contract.transfer_corgi(charlie(), id);
    });
}

#[test]
fn transfer_a_few_corgis() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=20 {
            contract.create_test_corgi(i);
        }

        let ids = contract.ids.clone();
        contract.transfer_corgi(charlie(), ids[2].clone().0);
        contract.transfer_corgi(charlie(), ids[9].clone().0);
        contract.transfer_corgi(charlie(), ids[0].clone().0);
        contract.transfer_corgi(charlie(), ids[3].clone().0);
        contract.transfer_corgi(charlie(), ids[7].clone().0);
    });
}

#[test]
#[should_panic(expected = "Account `alice.mock` attempted to make a self transfer")]
fn should_panic_when_self_transfer() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id;
        contract.transfer_corgi(alice(), id);
    });
}

#[test]
#[should_panic(expected = "Attempt to transfer a nonexistent Corgi id `<?>`")]
fn should_panic_when_transfer_corgi_does_not_exist() {
    init_test().run_as(alice(), |contract| {
        contract.transfer_corgi(charlie(), "<?>".to_string());
    });
}

#[test]
#[should_panic(
    expected = "The specified Corgi `sVNcd4PqiCm2sM9ncEU5eYtNFsOb8L/glJTF2fEu7jA=` does not belong to sender"
)]
fn should_panic_when_sender_is_not_owner() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id;
        contract.transfer_corgi(charlie(), id.clone());
        contract.transfer_corgi(charlie(), id.clone());
    });
}

#[test]
#[should_panic(expected = "Receiver account `invalid.mock.` is not a valid account id")]
fn should_panic_when_transfer_receiver_is_invalid() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id;
        contract.transfer_corgi("invalid.mock.".to_string(), id);
    });
}

#[test]
fn nep4_transfer_a_corgi() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id;
        contract.transfer(charlie(), id);
    });
}

#[test]
fn nep4_check_empty_access() {
    init_test().run_as(ted(), |contract| {
        assert!(!contract.check_access(alice()));
    });
}

#[test]
fn nep4_check_self_access() {
    init_test().run_as(alice(), |contract| {
        assert!(contract.check_access(alice()));
    });
}

#[test]
fn nep4_grant_access() {
    init_test()
        .run_as(alice(), |contract| {
            contract.grant_access(ted());
        })
        .run_as(ted(), |contract| {
            assert!(contract.check_access(alice()));
            assert!(!contract.check_access(charlie()));
        })
        .run_as(alice(), |contract| {
            contract.revoke_access(ted());
        })
        .run_as(ted(), |contract| {
            assert!(!contract.check_access(alice()));
        });
}

#[test]
fn nep4_transfer_from() {
    init_test()
        .run_as(alice(), |contract| {
            contract.create_test_corgi(42);
            contract.contract.grant_access(ted());
        })
        .run_as(ted(), |contract| {
            let id = contract.ids[0].0.clone();
            contract.contract.transfer_from(alice(), bob(), id);
        })
        .run_as(bob(), |contract| {
            let corgis = contract.contract.get_corgis_by_owner(bob());
            assert_eq!(corgis.len(), 1);
        });
}
