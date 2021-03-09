const { Near, KeyPair, Contract, keyStores: { InMemoryKeyStore }, utils } = require('near-api-js');
const { CustomConsole } = require('@jest/console');
const getConfig = require('../src/config');
const fs = require('fs');

global.console = new CustomConsole(process.stdout, process.stderr, (_type, message) => message);

const config = getConfig('development');

const corgiConfig = JSON.parse(fs.readFileSync('contract/config.json'));
const GAS = 300000000000000;
const MINT_FEE = corgiConfig.mint_fee.replace(/_/g, '');
const PAGE_LIMIT = corgiConfig.page_limit;
const METHODS = JSON.parse(fs.readFileSync('contract/methods.json'));

async function initContractWithNewTestAccount() {
  const keyStore = new InMemoryKeyStore();

  const near = new Near({
    deps: { keyStore: keyStore },
    ...config
  });

  const generateUniqueAccountId = function (prefix) {
    return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
  }

  const newKeyPair = KeyPair.fromRandom('ed25519');
  const account = await near.createAccount(generateUniqueAccountId('test'), newKeyPair.getPublicKey());

  keyStore.setKey(config.networkId, account.accountId, newKeyPair);

  const contract = new Contract(account, config.contractName, {
    ...METHODS,
    signer: account.accountId
  });

  console.log(contract);

  return {
    contract,
    accountId: account.accountId,
    account,
  };
}

describe('Corgis contract integration tests', () => {

  let alice, bob, ted;

  beforeAll(async () => {
    alice = await initContractWithNewTestAccount();
    bob = await initContractWithNewTestAccount();
    ted = await initContractWithNewTestAccount();
  });

  afterAll(async () => {
    const accid = 'corgis-nft.testnet';
    await alice.account.deleteAccount(accid);
    await bob.account.deleteAccount(accid);
    await ted.account.deleteAccount(accid);
  });

  test('check that test account are actually different', async () => {
    expect(alice.accountId).not.toBe(bob.accountId);
  });

  test('create a corgi', async () => {
    const initial = await initialState(alice);

    const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });
    console.debug('create corgi', newCorgi);

    const globalCorgisCount = await alice.contract.get_global_corgis();
    expect(globalCorgisCount.length).toBe(Math.min(initial.globalCorgis.length + 1, PAGE_LIMIT));

    const corgiById = await alice.contract.get_corgi_by_id({ id: newCorgi.id });
    expect(corgiById.owner).toBe(alice.accountId);

    const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
    expect(corgisByOwner.length).toBe(initial.corgisByOwner.length + 1);
    expect(corgisByOwner.map(corgi => corgi.id)).toContain(newCorgi.id);
  });

  test('create and delete a corgi', async () => {
    const initial = await initialState(alice);

    const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });
    console.debug('create corgi', newCorgi);

    {
      const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
      expect(corgisByOwner.length).toBe(initial.corgisByOwner.length + 1);
    }

    await alice.contract.delete_corgi({ id: newCorgi.id });

    {
      const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
      expect(corgisByOwner.length).toBe(initial.corgisByOwner.length);
    }
  });

  test('create a few corgis', async () => {
    const initial = await initialState(alice);

    const newCorgis = [];
    for (let i = 0; i < PAGE_LIMIT + 1; i++) {
      const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });
      newCorgis.push(newCorgi);
    }

    const globalCorgis = await alice.contract.get_global_corgis();
    expect(globalCorgis.length).toBe(PAGE_LIMIT);

    for (let i = 0; i < 5; i++) {
      const corgiByOwner = await alice.contract.get_corgi_by_id({ id: newCorgis[i].id });
      expect(corgiByOwner.owner).toBe(alice.accountId);
    }

    const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
    expect(corgisByOwner.length).toBe(initial.corgisByOwner.length + newCorgis.length);
  });

  test('create and delete a few corgis', async () => {
    const initial = await initialState(alice);

    const newCorgis = [];
    for (let i = 0; i < PAGE_LIMIT + 2; i++) {
      const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });
      console.debug('create corgi', newCorgi);
      newCorgis.push(newCorgi);
    }

    const checkCorgis = async function () {
      const globalCorgis = await alice.contract.get_global_corgis();
      expect(globalCorgis.length).toBe(PAGE_LIMIT);

      const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
      expect(corgisByOwner.length).toBe(initial.corgisByOwner.length + newCorgis.length);
    }

    const deleteCorgi = async function (i) {
      const [deletedCorgi] = newCorgis.splice(i, 1);
      await alice.contract.delete_corgi({ id: deletedCorgi.id });
      await checkCorgis();
    }

    await checkCorgis();

    await deleteCorgi(1);
    await deleteCorgi(3);
  });

  test('transfer corgi', async () => {
    const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });

    {
      const corgiById = await alice.contract.get_corgi_by_id({ id: newCorgi.id });
      expect(corgiById.owner).toBe(alice.accountId);
      const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
      expect(corgisByOwner.map(corgi => corgi.id)).toContain(newCorgi.id);
    }

    await alice.contract.transfer_corgi({ receiver: bob.accountId, id: newCorgi.id });

    {
      const corgiById = await bob.contract.get_corgi_by_id({ id: newCorgi.id });
      expect(corgiById.owner).toBe(bob.accountId);
      const corgisByOwner = await bob.contract.get_corgis_by_owner({ owner: bob.accountId });
      expect(corgisByOwner.map(corgi => corgi.id)).toContain(newCorgi.id);
    }

    {
      const corgiById = await alice.contract.get_corgi_by_id({ id: newCorgi.id });
      expect(corgiById.owner).toBe(bob.accountId);
      const corgisByOwner = await alice.contract.get_corgis_by_owner({ owner: alice.accountId });
      expect(corgisByOwner.map(corgi => corgi.id)).not.toContain(newCorgi.id);
    }
  });

  test('Marketplace ', async () => {

    balance(alice.account, 'alice');

    const newCorgi = await create_corgi(alice.contract, { name: 'hola', quote: 'asd', color: 'red', background_color: 'yellow' });
    await alice.contract.add_item_for_sale({ token_id: newCorgi.id, duration: 15 });

    await bid_for_item(bob.contract, { token_id: newCorgi.id }, '20');
    await bid_for_item(ted.contract, { token_id: newCorgi.id }, '50');
    await bid_for_item(bob.contract, { token_id: newCorgi.id }, '40');

    const items = await alice.contract.get_items_for_sale();
    console.log(items);
    console.log(items[0].for_sale);
    console.log(items[0].for_sale.bids);

    await sleep(15);
    await alice.contract.clearance_for_item({ token_id: newCorgi.id }, GAS);

    await balance(alice.account, 'alice');
    await balance(bob.account, 'bob');
    await balance(ted.account, 'ted');

    const corgiById = await alice.contract.get_corgi_by_id({ id: newCorgi.id });
    expect(corgiById.owner).toBe(bob.accountId);
  });

});

async function initialState(user) {
  const globalCorgis = await user.contract.get_global_corgis();
  const corgisByOwner = await user.contract.get_corgis_by_owner({ owner: user.accountId });
  return { globalCorgis, corgisByOwner };
}

async function create_corgi(contract, args) {
  const newCorgi = await contract.create_corgi(args, GAS, MINT_FEE);
  return newCorgi;
}

async function bid_for_item(contract, args, amount) {
  await contract.bid_for_item(args, GAS, utils.format.parseNearAmount(amount));
}

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function balance(account, user) {
  const state = await account.state();
  console.log(user);
  console.log(state);
}
