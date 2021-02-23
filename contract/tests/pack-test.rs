use corgis_nft::pack::pack;

#[test]
fn pack_zeros_is_zero() {
    assert_eq!(0, pack(&[0; 16]));
}

#[test]
fn pack_less_than_8_bytes() {
    assert_eq!(
        127,
        pack(&[127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    );
    assert_eq!(256, pack(&[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    assert_eq!(512, pack(&[0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    assert_eq!(
        65536,
        pack(&[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    );
    assert_eq!(
        65536 + 256 + 1,
        pack(&[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    );
}

#[test]
fn pack_more_than_8_bytes() {
    assert_eq!(
        3 + (1 << 8 * 8),
        pack(&[3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0])
    );
    assert_eq!(
        1 + (2 << 7 * 8) + (3 << 8 * 8) + (4 << 15 * 8),
        pack(&[1, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 4])
    );
}

#[test]
fn pack_full_is_max() {
    assert_eq!(u128::MAX, pack(&[0xff; 16]));
}
