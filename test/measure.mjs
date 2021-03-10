import fs from 'fs';
import { createProfiler } from './profiler.mjs';
import { argv } from 'process';

const contractConfig = JSON.parse(fs.readFileSync('contract/config.json'));
const MINT_FEE = contractConfig.mint_fee.replace(/_/g, '');
const METHODS = JSON.parse(fs.readFileSync('contract/methods.json'));

const { deploy, writeTo, alice, bob, charlie } = await createProfiler('prof', METHODS, 'alice', 'bob', 'charlie');

await deploy('contract/target/wasm32-unknown-unknown/release/corgis_nft.wasm');

const numberOfCorgis = argv[2] ? Number.parseInt(argv[2]) : 5;
const corgis = [];

await alice.get_global_corgis();
await alice.get_corgis_by_owner({ owner: alice.accountId });

for (let i = 0; i < numberOfCorgis; i++) {
    const corgi = await alice.create_corgi({
        name: 'd' + i,
        quote: 'bff',
        color: 'b',
        background_color: 'w'
    }, MINT_FEE);
    corgis.push(corgi);

    await alice.get_corgi_by_id({ id: corgi.id });
}

await alice.get_corgis_by_owner({ owner: alice.accountId });

for (const corgi of corgis) {
    await alice.get_corgi_by_id({ id: corgi.id });
}

for (const corgi of corgis) {
    await alice.transfer_corgi({ receiver: bob.accountId, id: corgi.id })
    await bob.transfer_corgi({ receiver: charlie.accountId, id: corgi.id })
}

await alice.get_items_for_sale();

for (const corgi of corgis) {
    const DURATION = 15;
    await charlie.add_item_for_sale({ token_id: corgi.id, duration: DURATION });

    await Promise.all([
        new Promise((resolve) => {
            setTimeout(resolve, (DURATION + 1) * 1000);
        }),
        (async () => {
            await alice.bid_for_item({ token_id: corgi.id }, '1000');
            await bob.bid_for_item({ token_id: corgi.id }, '2000');
            await alice.bid_for_item({ token_id: corgi.id }, '1500');
        })()
    ]);

    await charlie.clearance_for_item({ token_id: corgi.id });
    await alice.get_corgi_by_id({ id: corgi.id });
    await alice.delete_corgi({ id: corgi.id });
}

writeTo('test/trace.json');
