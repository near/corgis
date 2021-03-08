import { Near, Contract, keyStores, KeyPair, utils } from 'near-api-js';
import fs from 'fs';
import chalk from 'chalk';
import getConfig from '../src/config.js';

const GAS = 300000000000000;

async function createProfiler(contractPrefix, userPrefix, config, methods) {
  const keyStore = new keyStores.InMemoryKeyStore();
  const near = new Near({
    deps: { keyStore: keyStore },
    ...config
  });

  const info = (message) => process.stdout.write(chalk.gray(message + ' ... '));
  const done = () => process.stdout.write(chalk.green('[DONE]\n'));

  const createAccount = async function (prefix) {
    const generateUniqueAccountId = function () {
      return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    }

    const accountId = generateUniqueAccountId();

    info('Creating account ' + accountId);
    const newKeyPair = KeyPair.fromRandom('ed25519');
    const account = await near.createAccount(accountId, newKeyPair.getPublicKey());
    keyStore.setKey(config.networkId, account.accountId, newKeyPair);
    done();

    return account;
  }

  const contractAccount = await createAccount(contractPrefix);
  const userAccount = await createAccount(userPrefix);
  const contract = new Contract(userAccount, contractAccount.accountId, {
    ...methods,
    signer: userAccount.accountId
  });

  const data = []
  const append = async function (outcome) {
    const getState = async function (account) {
      const state = await account.state();
      const balance = await account.getAccountBalance();
      const amountf = (value) => chalk.yellow(utils.format.formatNearAmount(value, 8));
      const isContract = state.code_hash == '11111111111111111111111111111111' ? '' : '\u270e ';
      console.info(`> ${isContract}${account.accountId} Ⓝ T ${amountf(balance.total)}=S ${amountf(balance.stateStaked)}+A ${amountf(balance.available)}`);

      return { ...state, ...balance };
    }

    data.push({
      ...outcome,
      contract: await getState(contractAccount),
      user: await getState(userAccount)
    });
  };

  append({});

  return {
    accountId: userAccount.accountId,

    deploy: async function (wasmPath) {
      info('Deploying contract ' + wasmPath);
      const wasmData = fs.readFileSync(wasmPath);
      const outcome = await contractAccount.deployContract(wasmData);
      done();
      append(outcome);
    },

    writeTo: function (tracePath) {
      fs.writeFileSync(tracePath, JSON.stringify(data));
    },

    ...[...methods.viewMethods, ...methods.changeMethods].reduce((self, methodName) => {
      self[methodName] = async function (args, fee) {
        const result = await contract.account.functionCall(contract.contractId, methodName, args, GAS, fee);
        append(result);

        const response = Buffer.from(result.status.SuccessValue, 'base64').toString();
        return response ? JSON.parse(response) : null;
      }
      return self;
    }, {}),
  };
}

const contractConfig = JSON.parse(fs.readFileSync('contract/config.json'));
const MINT_FEE = contractConfig.mint_fee.replace(/_/g, '');
const METHODS = JSON.parse(fs.readFileSync('contract/methods.json'));

const profiler = await createProfiler('prof', 'user', getConfig('development'), METHODS);
await profiler.deploy('contract/target/wasm32-unknown-unknown/release/corgis_nft.wasm');

const TIMES = 5;
const corgis = [];

await profiler.get_global_corgis();
await profiler.get_corgis_by_owner({ owner: profiler.accountId });

for (let i = 0; i < TIMES; i++) {
  const corgi = await profiler.create_corgi({
    name: 'doggy dog',
    quote: 'best doggy ever',
    color: 'red',
    background_color: 'yellow'
  }, MINT_FEE);
  console.log(corgi.id)
  corgis.push(corgi);

  await profiler.get_corgi_by_id({ id: corgi.id });
}

await profiler.get_corgis_by_owner({ owner: profiler.accountId });

for (const corgi of corgis) {
  await profiler.get_corgi_by_id({ id: corgi.id });
}

for (const corgi of corgis) {
  await profiler.get_corgi_by_id({ id: corgi.id });
  await profiler.delete_corgi({ id: corgi.id });
}

profiler.writeTo('test/trace.json');
