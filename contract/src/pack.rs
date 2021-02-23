pub fn pack(data: &[u8]) -> u128 {
    assert!(data.len() == 16);

    let mut result = 0u128;
    for i in 0..16 {
        result += (data[i] as u128) << (i * 8);
    }

    result
}
