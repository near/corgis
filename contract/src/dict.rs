use std::fmt::Debug;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
};

/// Keeps a mapping from `K` keys to `V` values.
/// It combines `UnorderedMap` to store elements and implements a linked list
/// to allow the user to maintain the insertion order.
/// Any key/value pair is added to the beginning of the list.
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Dict<K, V> {
    heap: Heap<K, V>,
    first: K,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Heap<K, V>(UnorderedMap<K, Node<K, V>>);

#[derive(BorshDeserialize, BorshSerialize, Debug)]
struct Node<K, V> {
    next: K,
    prev: K,
    value: V,
}

pub struct DictIntoIterator<'a, K, V> {
    heap: &'a Heap<K, V>,
    curr: K,
}

impl<
        K: Default + Clone + PartialEq + BorshDeserialize + BorshSerialize + Debug,
        V: BorshDeserialize + BorshSerialize + Debug,
    > Dict<K, V>
{
    pub fn new(id: Vec<u8>) -> Self {
        Self {
            heap: Heap(UnorderedMap::new(id)),
            first: K::default(),
        }
    }

    pub fn get(&self, key: &K) -> Option<V> {
        self.heap.0.get(key).map(|node| node.value)
    }

    pub fn push_front(&mut self, key: &K, value: V) -> V {
        assert!(*key != K::default(), "Attempt to push `default` into heap");

        if self.first != K::default() {
            let mut node = self.heap.get_node(&self.first);
            node.prev = key.clone();
            let res = self.heap.0.insert(&self.first, &node);
            assert!(res.is_some());
        }

        let node = Node {
            next: self.first.clone(),
            prev: K::default(),
            value,
        };

        self.first = key.clone();
        self.heap.0.insert(&key, &node);

        node.value
    }

    pub fn remove(&mut self, key: &K) -> Option<V> {
        match self.heap.0.remove(key) {
            None => None,
            Some(removed_node) => {
                if removed_node.prev == K::default() {
                    self.first = removed_node.next;
                } else {
                    let mut node = self.heap.get_node(&removed_node.prev);
                    node.next = removed_node.next;
                    self.heap.0.insert(&removed_node.prev, &node);
                }
                Some(removed_node.value)
            }
        }
    }
}

impl<K: BorshDeserialize + BorshSerialize, V: BorshDeserialize + BorshSerialize> Heap<K, V> {
    fn get_node(&self, key: &K) -> Node<K, V> {
        let node = self.0.get(&key);
        assert!(node.is_some(), "Element was not found in heap map");
        node.unwrap()
    }
}

impl<
        'a,
        K: Default + Clone + PartialEq + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > IntoIterator for &'a Dict<K, V>
{
    type Item = (K, V);

    type IntoIter = DictIntoIterator<'a, K, V>;

    fn into_iter(self) -> Self::IntoIter {
        Self::IntoIter {
            heap: &self.heap,
            curr: self.first.clone(),
        }
    }
}

impl<
        K: Default + Clone + PartialEq + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > Iterator for DictIntoIterator<'_, K, V>
{
    type Item = (K, V);

    fn next(&mut self) -> Option<Self::Item> {
        if self.curr == K::default() {
            None
        } else {
            let node = self.heap.get_node(&self.curr);
            let result = Some((self.curr.clone(), node.value));
            self.curr = node.next;
            result
        }
    }
}
