# Explore [Corgis](http://corgis.near.org) when you first see this!

## To run on main Testnet

### Requirements

#### IMPORTANT: Make sure you have the latest version of NEAR Shell and Node Version > 10.x

1. node and npm

2. near shell

Install with

```sh
npm i -g near-cli
```

3.(optional) install yarn to build

```sh
npm i -g yarn
```

4.Rust

You need to install Rustup in order to compile Rust contracts.
See the official guide on how to set up Rust in your local environment.

> <https://www.rust-lang.org/tools/install>

By installing `rustup`, you will add the Rust compiler and the `cargo` package manager to your system.

The NEAR platform leverage the use of WASM to execute smart contracts.
Thus, in order to build a suitable binary for the NEAR platform,
we must install the wasm32 target:

```sh
rustup target add wasm32-unknown-unknown
```

### Procedure (deploy the contract for your own project)

Step 1: Create account for the contract.

In the terminal

```sh
near login
```

click the link and create your own contract ID on NEAR Testnet

*After you see the context, "Logged in as [ YOUR_NAME ] with public key [ ed25519:XXXXXX... ] successfully", you are done.*

Step 2: Deploy the contract on the account

Set the following environment variable

```sh
export CONTRACT_NAME=<YOUR_NAME>
```

Alternatively, modify src/config.js line that sets the contractName. Set it with Id from step 1.

```js
const CONTRACT_NAME = process.env.CONTRACT_NAME || "new-corgis"; /* TODO: fill this in! */
```

Step 3:

(For Mac and Ubuntu):
Finally, run the command in your terminal.

```sh
npm install && npm run start
```

with yarn:

```sh
yarn install && yarn start
```

(For Windows):

```sh
yarn install
yarn start
```

The server that starts is for static assets and by default serves them to localhost:1234. Navigate there in your browser to see the app running!

## To Explore

- `assembly/main.ts` for the contract code
- `src/index.html` for the front-end HTML
- `src/main.js` for the JavaScript front-end code and how to integrate contracts
- `src/app.js` for the first react component

### To run on Local Node (May in the old version and need update)

Step 1:
Get nearcore

Step 2:
Use command ```./scripts/start_localnet.py --local``` to start the local node

Step 3:
Install serve with:

```sh
npm i serve
```

Use command ```serve src -p 3000``` to start on localhost:3000

Step 4:
Start frontend with command:

```sh
NODE_ENV=local yarn start
```

Now, open localhost:3000. Navigate there in your browser to see the app running!

Step 5:
Use wallet/login/index.html to create account and start exploring.

## Interacing with Corgis contract

The Corgis contract is located in the `contract` folder.
It is written in Rust.
Here is an overview on how to develop NEAR contracts using Rust:

<https://docs.near.org/docs/develop/contracts/rust/intro>

### Building

To build the Corgis contract:

```sh
cd contract
cargo build --target wasm32-unknown-unknown --release
```

The contract is compiled down to a WASM binary.
You can find this binary in
`contract/target/wasm32-unknown-unknown/release/corgis_nft.wasm`.

### Deploying our Corgis contract

To deploy our contract, we need `near-cli`.
The `near-cli` tool allows us to deploy and interact with contracts on the NEAR Blockchain.

We can deploy our contract with:

```sh
near deploy --wasmFile contract/target/wasm32-unknown-unknown/release/corgis_nft.wasm
```

### Reference

Here is a quick reference on how to interact with our Corgis contract on the NEAR Blockchain.
In the following sections,
`$CONTRACT_NAME` refers to the developer account.
This is the account that creates and deploys the contracts below.
On the other hand, `$ACCOUNT_NAME` refers to the end user account that uses our
Corgi site.

#### `create_corgi`

This contract method creates a corgi in the Blockchain.
In order to run the following command,
you must be logged in with the `$ACCOUNT_NAME`.

```sh
near --accountId $ACCOUNT_NAME call $CONTRACT_NAME create_corgi '{"name":"doggy dog","quote":"To err is human — to forgive, canine","color":"green","background_color":"blue"}'
```

This contract returns the `id` of the created `Corgi`.

#### `get_corgi_by_id`

Returns the `Corgi` given by `id`.

```sh
near view $CONTRACT_NAME get_corgi_by_id '{"id": "<corgi-id>"}'
```

The response returns an the specified `Corgi`, for example:

```js
{
  id: 'J9fEDeGE6vBODSjyetsZpLL7hCjm/IyvKmBTA1jUl3o=',
  name: 'doggy dog',
  quote: 'To err is human — to forgive, canine',
  color: 'green',
  background_color: 'blue',
  rate: 'COMMON',
  sausage: '27',
  owner: 'luis.testnet'
}
```

The `rate` field has the following type:

```typescript
type Rarity = 'COMMON'
            | 'UNCOMMON'
            | 'RARE'
            | 'VERY_RARE'
```

#### `get_corgis_by_owner`

```sh
near view $CONTRACT_NAME get_corgis_by_owner "{\"owner\":\"$ACCOUNT_NAME\"}"
```

Note that in this example we use double-quotes to be able to expand the shell variable `$ACCOUNT_NAME`.

The response returns an array of corgis, similar to:

```js
[
  {
    id: 'J9fEDeGE6vBODSjyetsZpLL7hCjm/IyvKmBTA1jUl3o=',
    name: 'doggy dog',
    quote: 'To err is human — to forgive, canine',
    color: 'green',
    background_color: 'blue',
    rate: 'COMMON',
    sausage: '27'
  },
]
```

#### `delete_corgi`

Deletes a `Corgi` by the given `id`.

```sh
near --accountId $ACCOUNT_NAME call $CONTRACT_NAME delete_corgi '{"id": "<corgi-id>"}'
```

#### `get_global_corgis`

This command returns all corgis that have been created.

```sh
near view $CONTRACT_NAME get_global_corgis
```

For the response body, see `get_corgis_by_owner`.

## Development & Tooling

For Rust development with Visual Studio Code,
you may want to check out the _rust.analyzer_ extension

> <https://rust-analyzer.github.io/>
