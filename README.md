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

- `contract/src/lib.rs` for the contract code
- `src/index.html` for the front-end HTML
- `src/main.js` for the JavaScript front-end code and how to integrate contracts
- `src/app.js` for the first react component

For information about the contract, see [contract/README.md](contract/).

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
