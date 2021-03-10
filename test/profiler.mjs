import { Near, Contract, keyStores, KeyPair, utils } from 'near-api-js';
import fs from 'fs';
import chalk from 'chalk';
import getConfig from '../src/config.js';
import { homedir } from 'os';
import { basename } from 'path';
import { sha256 } from 'js-sha256';
import bs58 from 'bs58';
import BN from 'bn.js';
import { stringify } from 'querystring';

const GAS = 300000000000000;

export async function createProfiler(contractPrefix, methods, ...userPrefixes) {
    const out = process.stdout;
    const msg = chalk.blue;
    const ok = chalk.green;
    const param = chalk.cyan;
    const info = (message) => out.write(msg(message + ' '));
    const infoln = (message) => out.write(chalk.magenta('\u25b6 ') + msg(message) + ok(' \u2713\n'));
    const start = (message) => out.write(chalk.magenta('\u25b6 ') + msg(message + '.. '));
    const prog = (message) => out.write(msg(message + '.. '));
    const done = () => out.write(ok('\u2713\n'));

    const keyDir = homedir() + '/.near-credentials';
    const keyStore = new keyStores.UnencryptedFileSystemKeyStore(keyDir);
    infoln(`Using key store from ${param(keyDir)}`);

    const config = getConfig('development');
    const near = new Near({
        deps: { keyStore: keyStore },
        ...config
    });

    const getAccountFor = async function (prefix) {
        start(`Recovering account for ${param(prefix)}`)
        try {
            const accountId = fs.readFileSync(`neardev/${prefix}-account`).toString();
            const account = await near.account(accountId);
            prog(`found ${param(accountId)}`)
            done();
            return account;
        } catch {
            const generateUniqueAccountId = function () {
                return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
            }

            const accountId = generateUniqueAccountId();
            prog('creating account');
            const newKeyPair = KeyPair.fromRandom('ed25519');
            const account = await near.createAccount(accountId, newKeyPair.getPublicKey());
            keyStore.setKey(config.networkId, account.accountId, newKeyPair);
            if (!fs.existsSync('neardev')) {
                fs.mkdirSync('neardev');
            }
            fs.writeFileSync(`neardev/${prefix}-account`, accountId);
            done();
            return account;
        }
    }

    const contractAccount = await getAccountFor(contractPrefix);
    const users = await Promise.all(userPrefixes.map(async user => {
        const account = await getAccountFor(user);
        const contract = new Contract(account, contractAccount.accountId, {
            ...methods,
            signer: account.accountId
        });
        return { account, contract, user };
    }));

    const data = []
    const append = async function (outcome) {
        const getState = async function (account, prefix) {
            const state = await account.state();
            const balance = await account.getAccountBalance();

            if (!new BN(balance.total).eq(new BN(balance.stateStaked).add(new BN(balance.available)))) {
                console.log('Total neq staked+available');
            }

            const amountf = (value) => chalk.yellow(utils.format.formatNearAmount(value, 4));
            const isContract = state.code_hash == '11111111111111111111111111111111' ? '\u261e' : '\u270e';
            info(`${isContract}${prefix}: Ⓝ S${amountf(balance.stateStaked)}+A${amountf(balance.available)}`);

            return { ...state, ...balance };
        }

        const entry = {
            ...outcome,
            contract: await getState(contractAccount, contractPrefix),
            ...Object.fromEntries(await Promise.all(users.map(async ({ account, _, user }) => [user, await getState(account, user)]))),
        };
        data.push(entry);
        done();
        return entry;
    };

    start('Initial entry');
    const initialEntry = await append({});

    return {
        deploy: async function (wasmPath) {
            start(`Contract ${chalk.cyan(basename(wasmPath))}`);
            const wasmData = fs.readFileSync(wasmPath);
            const wasmHash = sha256.array(wasmData);
            const wasmBase64 = bs58.encode(Buffer.from(wasmHash));
            info('sha256/base58:' + wasmBase64);
            if (initialEntry.contract.code_hash !== wasmBase64) {
                info('deploying');
                const outcome = await contractAccount.deployContract(wasmData);
                done();
                await append(outcome);
            } else {
                info('up to date');
                done();
            }
        },

        writeTo: function (tracePath) {
            infoln(`Writing trace to ${param(tracePath)}`);
            fs.writeFileSync(tracePath, JSON.stringify(data));
        },

        ...Object.fromEntries(users.map(({ account, contract, user }) =>
            [user, {
                accountId: account.accountId,
                ...Object.fromEntries([...methods.viewMethods, ...methods.changeMethods].map(methodName =>
                    [methodName, async function (args, fee) {
                        start(`\u03bb ${param(methodName)} ${stringify(args).replace(/%20/g, ' ').replace(/&/g, '|')}`);
                        const w = out.write;
                        const lines = [];
                        out.write = (str, _encoding, _cb) => {
                            const [prefix, line] = str.split(':').map(s => s.trim());
                            if (prefix === `Log [${contractAccount.accountId}]`) {
                                lines.push(line);
                            } else if (prefix !== 'Receipt') {
                                lines.push(str);
                            }
                        };
                        const result = await contract.account.functionCall(contract.contractId, methodName, args, GAS, fee);
                        out.write = w;

                        info(`${param.dim('\u33d2 ' + lines.join('|'))}`);
                        await append(result);

                        const response = Buffer.from(result.status.SuccessValue, 'base64').toString();
                        return response ? JSON.parse(response) : null;
                    }]
                ))
            }]
        )),

    };
}