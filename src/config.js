/* eslint-disable comma-dangle */
/* TODO: fill this in! */
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'new-corgis';

function getConfig(env) {
  switch (env) {
    case 'production':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.mainnet.near.org'
      };
    case 'development':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org'
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.betanet.near.org'
      };
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        contractName: CONTRACT_NAME
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`,
      );
  }
}

module.exports = getConfig;
