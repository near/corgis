use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

type HeapMap<K, V> = near_sdk::collections::LookupMap<K, V>;

/// Keeps a mapping from `K` keys to `V` values.
/// It combines `UnorderedMap` to store elements and implements a linked list
/// to allow the user to maintain the insertion order.
/// Any key-value pair is added to the beginning of the list.
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Dict<K, V> {
    heap: Heap<K, V>,
    first: K,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Heap<K, V>(HeapMap<K, Node<K, V>>);

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
        K: Default + Clone + PartialEq + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > Dict<K, V>
{
    /// Creates a new `Dict` with zero elements.
    /// Use `id` as a unique identifier.
    pub fn new(id: Vec<u8>) -> Self {
        Self {
            heap: Heap(HeapMap::new(id)),
            first: K::default(),
        }
    }

    /// Returns the value corresponding to `key`,
    /// otherwise returns `None`.
    pub fn get(&self, key: &K) -> Option<V> {
        self.heap.0.get(key).map(|node| node.value)
    }

    /// Adds the key-value pair into this `Dict`.
    /// This pair is now the first in the collection, *i.e.*,
    /// the first element returned by the `into_iter` iterator.
    ///
    /// The `default` value for `K` cannot be used as valid key,
    /// as it is used to signal the end of the linked list.
    /// Moreover, the `Dict` does not accept duplicated keys.
    pub fn push_front(&mut self, key: &K, value: V) -> V {
        assert!(key != &K::default());

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
        let was_updated = self.heap.0.insert(&key, &node);
        assert!(was_updated.is_none());

        node.value
    }

    /// Removes `key` from `Dict`.
    /// Returns the removed element, if the key was previously in the `Dict`.
    pub fn remove(&mut self, key: &K) -> Option<V> {
        match self.heap.0.remove(key) {
            None => None,
            Some(removed_node) => {
                if removed_node.prev == K::default() {
                    self.first = removed_node.next.clone();
                } else {
                    let mut node = self.heap.get_node(&removed_node.prev);
                    node.next = removed_node.next.clone();
                    self.heap.0.insert(&removed_node.prev, &node);
                }

                if removed_node.next != K::default() {
                    let mut node = self.heap.get_node(&removed_node.next);
                    node.prev = removed_node.prev;
                    self.heap.0.insert(&removed_node.next, &node);
                }

                Some(removed_node.value)
            }
        }
    }
}

impl<K: BorshDeserialize + BorshSerialize, V: BorshDeserialize + BorshSerialize> Heap<K, V> {
    fn get_node(&self, key: &K) -> Node<K, V> {
        let node = self.0.get(&key);
        assert!(node.is_some());
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
