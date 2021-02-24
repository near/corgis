use std::fmt::Display;

use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Dict<K, V> {
    heap: Heap<K, V>,
    first: K,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Heap<K, V>(UnorderedMap<K, Node<K, V>>);

#[derive(BorshDeserialize, BorshSerialize)]
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
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize + Display,
        V: BorshDeserialize + BorshSerialize,
    > Dict<K, V>
{
    pub fn new(id: Vec<u8>) -> Self {
        Self {
            heap: Heap(UnorderedMap::new(id)),
            first: K::default(),
        }
    }

    pub fn get(&self, key: &K) -> Option<V> {
        self.heap.0.get(key).map(|n| n.value)
    }

    pub fn push_front(&mut self, key: &K, value: V) -> V {
        if self.first != K::default() {
            let mut node = self.heap.get_node(&self.first);
            node.prev = key.clone();
            self.heap.0.insert(&self.first, &node);
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

    pub fn remove(&mut self, key: &K) -> bool {
        match self.heap.0.remove(&key) {
            None => false,
            Some(removed_node) => {
                if removed_node.prev == K::default() {
                    self.first = removed_node.next;
                } else {
                    let mut node = self.heap.get_node(&removed_node.prev);
                    node.next = removed_node.next;
                    self.heap.0.insert(&removed_node.prev, &node);
                }
                true
            }
        }
    }
}

impl<K: BorshDeserialize + BorshSerialize + Display, V: BorshDeserialize + BorshSerialize>
    Heap<K, V>
{
    fn get_node(&self, key: &K) -> Node<K, V> {
        let node = self.0.get(key);
        assert!(node.is_some(), "Element `{}` not found in heap map", key);
        node.unwrap()
    }
}

impl<
        'a,
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize + Display,
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
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize + Display,
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
