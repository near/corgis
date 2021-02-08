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

## Interacing with Corgis contracts

Here is a quick reference on how to interact with the NEAR Blockchain,
using `near-cli`.
The `near-cli` tool allows the developer to interact with contracts on the NEAR Blockchain.

In the following sections,
`$CONTRACT_NAME` refers to the developer account.
This is the account that creates and deploys the contracts below.
On the other hand, `$ACCOUNT_NAME` refers to the end user account that uses the
corgi site.

### Display global list of corgis

```sh
near view $CONTRACT_NAME displayGlobalCorgis
```

This command returns all corgis that have been created.

### Create corgi

In order to run the following command,
you must be logged in with the `$ACCOUNT_NAME`.

```sh
near --accountId $ACCOUNT_NAME call $CONTRACT_NAME createCorgi '{"name":"doggydog", "color":"green", "backgroundColor":"red","quote":"Test contract from cli"}'
```

### Get corgi list

```sh
near view $CONTRACT_NAME getCorgisList '{"owner":"$ACCOUNT_NAME"}' 
```
