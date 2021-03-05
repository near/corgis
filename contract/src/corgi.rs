use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    bs58,
    json_types::{U128, U64},
    serde::Serialize,
    AccountId, Balance,
};
use std::{convert::TryInto, mem::size_of, ops::Deref, usize};

use crate::dict::Dict;

pub type CorgiKey = [u8; size_of::<u128>()];

pub type CorgiId = String;

#[derive(Serialize, PartialEq, Debug)]
pub struct CorgiDTO {
    #[serde(flatten)]
    corgi: Corgi,

    pub for_sale: Option<ForSale>,
}

/// Represents a `Corgi`.
/// The `name` and `quote` are set by the user.
///
/// The `Corgi` struct is used as part of the public interface of the contract.
/// See, for example, [`get_corgis_by_owner`](Model::get_corgis_by_owner).
/// Every struct that is part of the public interface needs to be serializable
/// to JSON as well.
///
/// In addition, we implement both `PartialEq` and `Debug` traits,
/// but only for testing purposes.
#[derive(BorshDeserialize, BorshSerialize, Serialize, PartialEq, Debug)]
pub struct Corgi {
    pub id: CorgiId,
    pub name: String,
    pub quote: String,
    pub color: String,
    pub background_color: String,
    pub(crate) rate: Rarity,
    pub owner: AccountId,
    pub created: u64,
    pub modified: u64,
    pub sender: AccountId,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, PartialEq, Debug)]
#[allow(non_camel_case_types)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    VERY_RARE,
}

#[derive(Serialize, PartialEq, Debug)]
pub struct ForSale {
    pub bids: Vec<Bid>,
    pub expires: U64,
}

#[derive(Serialize, PartialEq, Debug)]
pub struct Bid {
    bidder: AccountId,
    amount: U128,
    timestamp: U64,
}

pub fn encode(key: CorgiKey) -> CorgiId {
    bs58::encode(key).into_string()
}

pub fn decode(id: &CorgiId) -> CorgiKey {
    let mut key: CorgiKey = [0; size_of::<CorgiKey>()];
    match bs58::decode(id).into(&mut key) {
        Err(error) => panic!("Could not decode `{}`: {}", id, error),
        Ok(_size) => (),
    }
    key
}

impl Deref for CorgiDTO {
    type Target = Corgi;
    fn deref(&self) -> &Self::Target {
        &self.corgi
    }
}

impl CorgiDTO {
    pub fn new(corgi: Corgi) -> Self {
        Self {
            corgi,
            for_sale: None,
        }
    }

    pub fn for_sale(corgi: Corgi, item: (Dict<AccountId, (Balance, u64)>, u64)) -> CorgiDTO {
        let bids = item
            .0
            .into_iter()
            .map(|(bidder, (amount, timestamp))| Bid::new(bidder, amount, timestamp))
            .collect::<Vec<Bid>>();
        Self {
            corgi,
            for_sale: Some(ForSale {
                bids,
                expires: U64(item.1),
            }),
        }
    }
}

impl Rarity {
    pub fn from_seed(seed: Vec<u8>) -> Rarity {
        let rate = u128::from_le_bytes(seed[..16].try_into().unwrap()) % 100;
        if rate > 10 {
            Rarity::COMMON
        } else if rate > 5 {
            Rarity::UNCOMMON
        } else if rate > 1 {
            Rarity::RARE
        } else {
            Rarity::VERY_RARE
        }
    }
}

impl Bid {
    pub fn new(bidder: AccountId, amount: u128, timestamp: u64) -> Self {
        Self {
            bidder,
            amount: U128(amount),
            timestamp: U64(timestamp),
        }
    }
}
