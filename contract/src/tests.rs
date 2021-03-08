use std::{
    cmp::min,
    collections::{HashMap, HashSet},
    ops::{Deref, DerefMut},
    panic::{catch_unwind, AssertUnwindSafe},
};

// mod context;
use std::convert::TryInto;

use near_sdk::{
    bs58, json_types::U64, testing_env, AccountId, MockedBlockchain, VMConfig, VMContext,
};
use near_vm_logic::VMLimitConfig;

use crate::{
    corgi::{Bid, CorgiDTO, CorgiId, ForSale},
    Model, MINT_FEE, PAGE_LIMIT,
};

pub struct MockedContext<T> {
    contract: T,
    pub context: VMContext,
}

impl<T> Deref for MockedContext<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.contract
    }
}

impl<T> DerefMut for MockedContext<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.update_context();
        &mut self.contract
    }
}

impl<T> MockedContext<T> {
    pub fn new<F>(init: F) -> Self
    where
        F: FnOnce() -> T,
    {
        let context = Self::create_context("".to_string(), 0, &[0; 16], 1);
        Self {
            contract: init(),
            context,
        }
    }

    pub fn run_as<F>(&mut self, account_id: String, action: F) -> &mut Self
    where
        F: FnOnce(&mut MockedContext<T>) -> (),
    {
        self.context.predecessor_account_id = account_id;
        self.update_context();
        action(self);
        self
    }

    pub fn attach_deposit(&mut self, attached_deposit: u128) -> &mut Self {
        self.context.attached_deposit = attached_deposit;
        println!("{}", attached_deposit);
        self
    }

    fn update_context(&mut self) {
        let random_seed = (u128::from_le_bytes(self.context.random_seed[..16].try_into().unwrap())
            + 1)
        .to_ne_bytes()
        .to_vec();
        self.context = Self::create_context(
            self.context.predecessor_account_id.clone(),
            self.context.attached_deposit,
            &random_seed,
            self.context.block_timestamp + 1,
        );
    }

    fn create_context(
        account_id: String,
        attached_deposit: u128,
        random_seed: &[u8],
        now: u64,
    ) -> VMContext {
        let context = VMContext {
            current_account_id: "contract.mock".to_string(),
            signer_account_id: "signer.mock".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: now,
            account_balance: 100_000,
            account_locked_balance: 100_000,
            // Important to increase storage usage is several items are going to be created.
            // https://github.com/near/near-sdk-rs/issues/159#issuecomment-631847439
            storage_usage: 100_000,
            attached_deposit,
            prepaid_gas: 10u64.pow(18),
            random_seed: random_seed.to_vec(),
            is_view: false,
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

fn alice() -> AccountId {
    "alice.mock".to_string()
}

fn bob() -> AccountId {
    "bob.mock".to_string()
}

fn charlie() -> AccountId {
    "charlie.mock".to_string()
}

fn diana() -> AccountId {
    "diana.mock".to_string()
}

fn any_corgi_id() -> CorgiId {
    bs58::encode(vec![0, 1, 2]).into_string()
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
        contract: Model::default(),
        ids: Vec::new(),
    })
}

impl MockedContext<ContractChecker> {
    fn predecessor_account_id(&self) -> String {
        self.context.predecessor_account_id.clone()
    }

    fn last_id(&self) -> String {
        self.ids[0].0.clone()
    }

    fn get_id(&self, i: usize) -> String {
        self.ids[i].0.clone()
    }

    fn create_test_corgi(&mut self, i: usize) -> CorgiDTO {
        let name = format!("doggy dog {}", i);
        let quote = "To err is human — to forgive, canine";
        let color = "green";
        let background_color = "blue";

        let corgis_by_owner_count = self
            .get_corgis_by_owner(self.predecessor_account_id())
            .len();

        let new_corgi = self.attach_deposit(MINT_FEE).create_corgi(
            name.clone(),
            quote.into(),
            color.into(),
            background_color.into(),
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
        self.ids.insert(0, (new_corgi.id.clone(), account));

        let corgi_by_id = self.get_corgi_by_id(new_corgi.id.clone());
        assert_eq!(corgi_by_id, new_corgi);

        let global_corgis = self.get_global_corgis();
        assert_eq!(
            global_corgis.len(),
            min(self.ids.len(), PAGE_LIMIT as usize)
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
            min(self.ids.len(), PAGE_LIMIT as usize)
        );
        self.check_global_corgis(global_corgis);
        self.check_corgis_by_owner();

        assert_eq!(
            self.get_corgis_by_owner(self.predecessor_account_id())
                .len(),
            corgis_by_owner_count - 1
        );
        assert!(catch_unwind(|| self.get_corgi_by_id(id.clone())).is_err());
        assert!(catch_unwind(AssertUnwindSafe(|| self.contract.delete_corgi(id.clone()))).is_err());
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
                .collect::<Vec<CorgiDTO>>()
        });
    }

    fn check_global_corgis(&self, global_corgis: Vec<CorgiDTO>) {
        assert_eq!(
            &global_corgis
                .into_iter()
                .map(|corgi| (corgi.id.clone(), corgi.owner.clone()))
                .collect::<Vec<(String, String)>>(),
            &{
                let mut ids = self.ids.clone();
                ids.truncate(PAGE_LIMIT as usize);
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

            let ids = self
                .ids
                .iter()
                .filter(|(_, o)| o == owner)
                .map(|(id, _)| id)
                .collect::<Vec<&String>>();

            assert_eq!(ids_by_owner, ids);
        }
    }
}

#[test]
fn initial_state() {
    init_test().run_as(alice(), |contract| {
        assert_eq!(contract.get_global_corgis().len(), 0);
        assert_eq!(contract.get_corgis_by_owner(alice()).len(), 0);
    });
}

#[test]
#[should_panic(expected = "Could not decode `012`:")]
fn corgi_by_id_should_panic_when_id_is_not_base58() {
    init_test().run_as(alice(), |contract| {
        contract.get_corgi_by_id("012".to_string());
    });
}

#[test]
#[should_panic(expected = "Given corgi id was not found")]
fn should_panic_when_corgi_id_does_not_exist() {
    init_test().run_as(alice(), |contract| {
        contract.get_corgi_by_id(any_corgi_id());
    });
}

#[test]
#[should_panic(expected = "Deposit must be MINT_FEE but was 0")]
fn create_free_corgi_should_panic() {
    init_test().run_as(alice(), |contract| {
        contract
            .attach_deposit(0)
            .create_corgi("N".into(), "Q".into(), "C".into(), "B".into());
    });
}

#[test]
#[should_panic(expected = "Name too large")]
fn should_panic_when_name_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.attach_deposit(MINT_FEE).create_corgi(
            ['?'; 32 + 1].iter().collect(),
            "Q".into(),
            "C".into(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Quote too large")]
fn should_panic_when_quote_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.attach_deposit(MINT_FEE).create_corgi(
            "N".into(),
            ['?'; 256 + 1].iter().collect(),
            "C".into(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Color too large")]
fn should_panic_when_color_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.attach_deposit(MINT_FEE).create_corgi(
            "N".into(),
            "Q".into(),
            ['?'; 64 + 1].iter().collect(),
            "B".into(),
        );
    });
}

#[test]
#[should_panic(expected = "Backcolor too large")]
fn should_panic_when_background_color_is_too_large() {
    init_test().run_as(alice(), |contract| {
        contract.attach_deposit(MINT_FEE).create_corgi(
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
            contract.create_test_corgi(i as usize);
            contract.delete_corgi(contract.last_id());
        }
    });
}

#[test]
#[should_panic(expected = "You do not have corgis to delete from")]
fn delete_should_panic_when_there_are_no_corgis() {
    init_test().run_as(alice(), |contract| {
        contract.delete_corgi(any_corgi_id());
    });
}

#[test]
#[should_panic(expected = "Corgi id does not belong to account")]
fn delete_should_panic_when_corgi_does_not_exist() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
        contract.delete_corgi(any_corgi_id());
    });
}

#[test]
fn create_and_delete_a_few_corgis() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=15 {
            contract.create_test_corgi(i);
        }

        contract.delete_corgi_by_index(0);
        contract.delete_corgi_by_index(0);
        contract.delete_corgi_by_index(2);
        contract.delete_corgi_by_index(9);
        contract.delete_corgi_by_index(3);
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
        contract.create_test_corgi(42);
        contract.transfer_corgi(charlie(), contract.last_id());
    });
}

#[test]
fn transfer_a_few_corgis() {
    init_test().run_as(alice(), |contract| {
        for i in 1..=20 {
            contract.create_test_corgi(i);
        }

        contract.transfer_corgi(charlie(), contract.get_id(2));
        contract.transfer_corgi(charlie(), contract.get_id(9));
        contract.transfer_corgi(charlie(), contract.get_id(0));
        contract.transfer_corgi(charlie(), contract.get_id(3));
        contract.transfer_corgi(charlie(), contract.get_id(7));
    });
}

#[test]
#[should_panic(expected = "Self transfers are not allowed")]
fn should_panic_when_self_transfer() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
        contract.transfer_corgi(alice(), contract.last_id());
    });
}

#[test]
#[should_panic(expected = "Given corgi id was not found")]
fn transfer_nonexistent_corgi_should_panic() {
    init_test().run_as(alice(), |contract| {
        contract.transfer_corgi(charlie(), any_corgi_id());
    });
}

#[test]
#[should_panic(expected = "Sender must own Corgi")]
fn should_panic_when_sender_is_not_owner() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
        contract.transfer_corgi(charlie(), contract.last_id());
        contract.transfer_corgi(charlie(), contract.last_id());
    });
}

#[test]
#[should_panic(expected = "Invalid receiver account id")]
fn should_panic_when_transfer_receiver_is_invalid() {
    init_test().run_as(alice(), |contract| {
        contract.create_test_corgi(42);
        contract.transfer_corgi("invalid.mock.".into(), contract.last_id());
    });
}

#[test]
fn market_starts_empty() {
    init_test().run_as(alice(), |contract| {
        assert_eq!(contract.get_items_for_sale(), vec!());
    });
}

const DURATION: u32 = 60 * 60 * 24;

#[test]
#[should_panic(expected = "Given corgi id was not found")]
fn add_non_existent_item_for_sale_should_panic() {
    init_test().run_as(alice(), |contract| {
        contract.add_item_for_sale(any_corgi_id(), DURATION);
    });
}

#[test]
#[should_panic(expected = "Only token owner can add item for sale")]
fn add_item_for_sale_from_non_owner_should_panic() {
    init_test()
        .run_as(alice(), |contract| {
            contract.create_test_corgi(42);
        })
        .run_as(bob(), |contract| {
            let id = contract.ids[0].0.clone();
            contract.add_item_for_sale(id, DURATION);
        });
}

#[test]
#[should_panic(expected = "Corgi already for sale")]
fn add_item_for_sale_twice_should_panic() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id.clone();
        contract.add_item_for_sale(id.clone(), DURATION);
        contract.add_item_for_sale(id.clone(), DURATION);
    });
}

#[test]
#[should_panic(expected = "Corgi is not available for sale")]
fn bid_for_non_existent_item_should_panic() {
    init_test().run_as(alice(), |contract| {
        contract.bid_for_item(any_corgi_id());
    });
}

#[test]
#[should_panic(expected = "You cannot bid for your own Corgi")]
fn bid_for_my_own_corgi_should_panic() {
    init_test().run_as(alice(), |contract| {
        let id = contract.create_test_corgi(42).id.clone();
        contract.add_item_for_sale(id.clone(), DURATION);
        contract.bid_for_item(id.clone());
    });
}

#[test]
#[should_panic(expected = "Auction for corgi has expired")]
fn expired_bid_should_panic() {
    let mut id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.block_timestamp += 60 * 60 * 24 * 1_000_000_000 + 60;
            contract.bid_for_item(id.clone());
        });
}

#[test]
#[should_panic(expected = "Bid 0 does not cover top bid 0")]
fn zero_bid_should_panic() {
    let mut id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 0;
            contract.bid_for_item(id.clone());
        });
}

#[test]
#[should_panic(expected = "Bid 1000 does not cover top bid 1000")]
fn equal_bid_should_panic() {
    let mut id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 1000;
            contract.bid_for_item(id.clone());
        })
        .run_as(charlie(), |contract| {
            contract.context.attached_deposit = 1000;
            contract.bid_for_item(id.clone());
        });
}

#[test]
#[should_panic(expected = "Bid 900 does not cover top bid 1000")]
fn smaller_bid_should_panic() {
    let mut id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 1000;
            contract.bid_for_item(id.clone());
        })
        .run_as(charlie(), |contract| {
            contract.context.attached_deposit = 900;
            contract.bid_for_item(id.clone());
        });
}

#[test]
#[should_panic(expected = "Bid 900 does not cover top bid 1000")]
fn smaller_2nd_bid_should_panic() {
    let mut id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 500;
            contract.bid_for_item(id.clone());
        })
        .run_as(charlie(), |contract| {
            contract.context.attached_deposit = 1000;
            contract.bid_for_item(id.clone());
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 400;
            contract.bid_for_item(id.clone());
        });
}

#[test]
#[should_panic(expected = "Corgi is not available for sale")]
fn clearance_for_non_existent_item_should_panic() {
    init_test().run_as(alice(), |contract| {
        contract.clearance_for_item(any_corgi_id());
    });
}

#[test]
#[should_panic(expected = "Cannot clear an item if not bidding for it")]
fn clearance_for_non_bidder_should_panic() {
    let mut token_id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            token_id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(token_id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.clearance_for_item(token_id.clone());
        });
}

#[test]
#[should_panic(expected = "Your bid is the highest and cannot be cleared")]
fn highest_bid_withdraw_should_panic() {
    let mut token_id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            token_id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(token_id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 100;
            contract.bid_for_item(token_id.clone());
            contract.clearance_for_item(token_id.clone());
        });
}

#[test]
#[should_panic(expected = "Token still in auction")]
fn clear_ongoing_auction_with_bids_should_panic() {
    let mut token_id = String::new();
    init_test()
        .run_as(alice(), |contract| {
            token_id = contract.create_test_corgi(42).id.clone();
            contract.add_item_for_sale(token_id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 100;
            contract.bid_for_item(token_id.clone());
        })
        .run_as(alice(), |contract| {
            contract.clearance_for_item(token_id.clone());
        });
}

#[test]
fn bigger_2nd_bid_tops_bidding() {
    let mut id = String::new();
    let mut auction_ends = U64(0);
    let mut timestamps = HashMap::new();

    init_test()
        .run_as(alice(), |contract| {
            id = contract.create_test_corgi(42).id.clone();
            auction_ends = contract.add_item_for_sale(id.clone(), DURATION);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 400;
            contract.bid_for_item(id.clone());
        })
        .run_as(charlie(), |contract| {
            contract.context.attached_deposit = 600;
            contract.bid_for_item(id.clone());
            timestamps.insert(charlie(), contract.context.block_timestamp);
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 500;
            contract.bid_for_item(id.clone());
            timestamps.insert(bob(), contract.context.block_timestamp);

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(bob(), 900, timestamps[(&bob())]),
                    Bid::new(charlie(), 600, timestamps[&charlie()]),
                ],
            );
        });
}

fn check_items_for_sale(contract: &Model, bids: Vec<Bid>) {
    assert_eq!(
        contract.get_items_for_sale()[0]
            .for_sale
            .as_ref()
            .unwrap()
            .bids,
        bids
    );
}

#[test]
fn market_auction_item() {
    let mut token_id = String::new();
    let mut timestamps = HashMap::new();
    let mut auction_ends = U64(0);

    init_test()
        .run_as(alice(), |contract| {
            token_id = contract.create_test_corgi(42).id.clone();
            auction_ends = contract.add_item_for_sale(token_id.clone(), DURATION);

            assert_eq!(contract.get_items_for_sale()[0].id, token_id);
            assert_eq!(
                contract.get_items_for_sale()[0].for_sale.as_ref().unwrap(),
                &ForSale {
                    bids: vec!(),
                    expires: auction_ends,
                }
            );
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 400;
            contract.bid_for_item(token_id.clone());
            timestamps.insert(bob(), contract.context.block_timestamp);

            check_items_for_sale(contract, vec![Bid::new(bob(), 400, timestamps[&bob()])]);
        })
        .run_as(charlie(), |contract| {
            contract.context.attached_deposit = 600;
            contract.bid_for_item(token_id.clone());
            timestamps.insert(charlie(), contract.context.block_timestamp);

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(charlie(), 600, timestamps[&charlie()]),
                    Bid::new(bob(), 400, timestamps[(&bob())]),
                ],
            );

            contract.context.attached_deposit = 200;
            contract.bid_for_item(token_id.clone());
            timestamps.insert(charlie(), contract.context.block_timestamp);

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(charlie(), 800, timestamps[&charlie()]),
                    Bid::new(bob(), 400, timestamps[(&bob())]),
                ],
            );
        })
        .run_as(diana(), |contract| {
            contract.context.attached_deposit = 900;
            contract.bid_for_item(token_id.clone());
            timestamps.insert(diana(), contract.context.block_timestamp);

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(diana(), 900, timestamps[&diana()]),
                    Bid::new(charlie(), 800, timestamps[&charlie()]),
                    Bid::new(bob(), 400, timestamps[&bob()]),
                ],
            );
        })
        .run_as(bob(), |contract| {
            contract.context.attached_deposit = 700;
            contract.bid_for_item(token_id.clone());
            timestamps.insert(bob(), contract.context.block_timestamp);

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(bob(), 1100, timestamps[&bob()]),
                    Bid::new(diana(), 900, timestamps[&diana()]),
                    Bid::new(charlie(), 800, timestamps[&charlie()]),
                ],
            );
        })
        .run_as(diana(), |contract| {
            contract.clearance_for_item(token_id.clone());

            check_items_for_sale(
                contract,
                vec![
                    Bid::new(bob(), 1100, timestamps[&bob()]),
                    Bid::new(charlie(), 800, timestamps[&charlie()]),
                ],
            );
        })
        .run_as(alice(), |contract| {
            let token_id = contract.ids[0].0.clone();
            contract.context.block_timestamp += 60 * 60 * 24 * 1_000_000_000 + 60;
            contract.clearance_for_item(token_id.clone());

            assert_eq!(contract.get_items_for_sale(), vec!());
            assert_eq!(contract.get_corgi_by_id(token_id.clone()).owner, bob());
            assert_eq!(contract.get_corgi_by_id(token_id.clone()).for_sale, None);
        });
}

#[test]
#[should_panic(expected = "Corgi is currently locked")]
fn transfer_an_item_for_sale_should_panic() {
    init_test().run_as(alice(), |contract| {
        let token_id = contract.create_test_corgi(42).id.clone();
        contract.add_item_for_sale(token_id.clone(), DURATION);
        contract.transfer_corgi(bob(), token_id);
    });
}

#[test]
#[should_panic(expected = "Corgi is currently locked")]
fn delete_an_item_for_sale_should_panic() {
    init_test().run_as(alice(), |contract| {
        let token_id = contract.create_test_corgi(42).id.clone();
        contract.add_item_for_sale(token_id.clone(), DURATION);
        contract.delete_corgi(token_id);
    });
}
