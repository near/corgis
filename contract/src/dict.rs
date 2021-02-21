use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Dict<K, V> {
    dict: UnorderedMap<K, Node<K, V>>,
    first: K,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Node<K, V> {
    next: K,
    prev: K,
    value: V,
}

impl<
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > Dict<K, V>
{
    pub fn new(id: Vec<u8>) -> Self {
        Self {
            dict: UnorderedMap::new(id),
            first: K::default(),
        }
    }

    pub fn push(&mut self, key: &K, value: V) -> Node<K, V> {
        if self.first != K::default() {
            let mut node = self.dict.get(&self.first).unwrap();
            node.prev = key.clone();
            self.dict.insert(&self.first, &node);
        }

        let node = Node {
            next: self.first.clone(),
            prev: K::default(),
            value,
        };

        self.first = key.clone();
        self.dict.insert(&key, &node);

        node
    }

    pub fn delete(&mut self, key: K) {
        let removed_node = self.dict.remove(&key).expect("Id not found");
        if removed_node.prev == K::default() {
            self.first = removed_node.next;
        } else {
            let mut node = self.dict.get(&removed_node.prev).unwrap();
            node.next = removed_node.next;
            self.dict.insert(&removed_node.prev, &node);
        }
    }
}

impl<
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > IntoIterator for Dict<K, V>
{
    type Item = (K, V);

    type IntoIter = DictIntoIterator<K, V>;

    fn into_iter(self) -> Self::IntoIter {
        Self::IntoIter {
            dict: self.dict,
            curr: self.first,
        }
    }
}

pub struct DictIntoIterator<K, V> {
    dict: UnorderedMap<K, Node<K, V>>,
    curr: K,
}

impl<
        K: Default + PartialEq + Clone + BorshDeserialize + BorshSerialize,
        V: BorshDeserialize + BorshSerialize,
    > Iterator for DictIntoIterator<K, V>
{
    type Item = (K, V);

    fn next(&mut self) -> Option<Self::Item> {
        if self.curr == K::default() {
            None
        } else {
            let node = self.dict.get(&self.curr).expect("Not able to get element");

            let result = Some((self.curr.clone(), node.value));
            self.curr = node.next;
            result
        }
    }
}
