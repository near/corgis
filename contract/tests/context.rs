use std::{
    ops::{Deref, DerefMut},
    time::{SystemTime, UNIX_EPOCH},
};

use corgis_nft::pack::pack;
use near_sdk::{testing_env, MockedBlockchain, VMConfig, VMContext};
use near_vm_logic::VMLimitConfig;

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
        let context = Self::create_context("".to_string(), &[0; 16]);
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

    fn update_context(&mut self) {
        let random_seed = (pack(self.context.random_seed.as_slice()) + 1)
            .to_ne_bytes()
            .to_vec();
        self.context =
            Self::create_context(self.context.predecessor_account_id.clone(), &random_seed);
    }

    fn create_context(account_id: String, random_seed: &[u8]) -> VMContext {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let context = VMContext {
            current_account_id: "contract.mock".to_string(),
            signer_account_id: "signer.mock".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: now,
            account_balance: 0,
            account_locked_balance: 0,
            // Important to increase storage usage is several items are going to be created.
            // https://github.com/near/near-sdk-rs/issues/159#issuecomment-631847439
            storage_usage: 100_000,
            attached_deposit: 0,
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
