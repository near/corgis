use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    bs58,
    json_types::{U128, U64},
    serde::Serialize,
    AccountId, Balance,
};
use std::{convert::TryInto, mem::size_of, usize};

use crate::dict::Dict;

/// This key is used internally to identify each `Corgi`.
/// A fix sized array prevents to heap-allocate memory when deserializing.
pub type CorgiKey = [u8; size_of::<u128>()];

/// The `Corgi` key visible representation.
/// It is the `CorgiKey` base58-encoded.
pub type CorgiId = String;

/// Represents a `Corgi` together with auction information.
/// In addition, we implement both `PartialEq` and `Debug` traits,
/// but only for testing purposes.
#[derive(Serialize)]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct CorgiDTO {
    /// The `Corgi` of this DTO.
    /// The `flatten` attribute embeds all `corgi` fields into this struct.
    #[serde(flatten)]
    corgi: Corgi,
    /// Additional information about auction.
    pub(crate) for_sale: Option<ForSale>,
}

/// Represents a `Corgi`.
/// The `name` and `quote` are set by the user.
/// The `Corgi` struct is used as part of the public interface of the contract.
/// See, for example, [`get_corgis_by_owner`](Model::get_corgis_by_owner).
/// Every struct that is part of the public interface needs to be serializable
/// to JSON as well.
///
/// In addition, we implement both `PartialEq` and `Debug` traits,
/// but only for testing purposes.
#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct Corgi {
    /// The unique id of this `Corgi`. It is the `CorgiKey` base58-encoded.
    pub id: CorgiId,
    /// A `name` provided by the minter.
    pub name: String,
    /// A `quote` provided by the minter.
    pub quote: String,
    /// A `color` provided by the minter.
    pub color: String,
    /// A `background_color` provided by the minter.
    pub background_color: String,
    /// The `Rarity` of this `Corgi`. This is decided when the `Corgi` is being minted.
    pub(crate) rate: Rarity,
    /// Represents who is the owner of this `Corgi`.
    pub owner: AccountId,
    /// Represents when this `Corgi` was minted, in nanoseconds.
    pub created: u64,
    /// Represents when this `Corgi` was last modified, in nanoseconds. Either when created or transferred.
    pub modified: u64,
    /// If this `Corgi` was transferred, who was the previous owner.
    pub sender: AccountId,
}

/// Defines the types of Rarity available when minting `Corgi`.
#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[cfg_attr(test, derive(PartialEq, Debug))]
#[allow(non_camel_case_types)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    VERY_RARE,
}

/// Holds information related to `Corgi` auctions.
/// It is used as a DTO.
#[derive(Serialize)]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct ForSale {
    /// All bids for this auction, from highest to lowest.
    pub bids: Vec<Bid>,
    /// Timestamp when this auction expires, in seconds.
    pub expires: U64,
}

/// Represents a bid for an auction.
#[derive(Serialize)]
#[cfg_attr(test, derive(PartialEq, Debug))]
pub struct Bid {
    /// Represents who made the bid.
    bidder: AccountId,
    /// And for how much, in yoctoNEAR.
    amount: U128,
    /// And when the `bidder` made the bid, in seconds.
    timestamp: U64,
}

/// Base58-encodes the given `key` into a `CorgiId` (String).
/// This is useful when sending back a `Corgi` identifier.
pub fn encode(key: CorgiKey) -> CorgiId {
    bs58::encode(key).into_string()
}

/// Base58-decodes the given `id` into a `CorgiKey`.
/// This is useful when receiving a `CorgiId` to further process within the contract.
pub fn decode(id: &CorgiId) -> CorgiKey {
    let mut key: CorgiKey = [0; size_of::<CorgiKey>()];
    match bs58::decode(id).into(&mut key) {
        Err(error) => panic!("Could not decode `{}`: {}", id, error),
        Ok(_size) => (),
    }
    key
}

/// Note that this is useful only for testing purposes.
/// When using through the NEAR platform,
/// it is not needed since the JSON serialization will flatten this struct.
#[cfg(test)]
impl std::ops::Deref for CorgiDTO {
    type Target = Corgi;
    fn deref(&self) -> &Self::Target {
        &self.corgi
    }
}

impl CorgiDTO {
    /// Creates a new `CorgiDTO` from an existing `Corgi`, with no sale information.
    pub fn new(corgi: Corgi) -> Self {
        Self {
            corgi,
            for_sale: None,
        }
    }

    /// Creates a new `CorgiDTO` from an existing `Corgi`, using the provided sale information.
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
    /// Transforms a random number into a Rarity.
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
    /// Creates a new `Bid`.
    pub fn new(bidder: AccountId, amount: u128, timestamp: u64) -> Self {
        Self {
            bidder,
            amount: U128(amount),
            timestamp: U64(timestamp),
        }
    }
}
