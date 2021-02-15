use std::cmp::min;

pub fn pack(data: &[u8]) -> u128 {
    let mut result = 0u128;
    for i in 0..min(data.len(), 16) {
        result += (data[i] as u128) << (i * 8);
    }

    result
}
