import { utils } from 'near-api-js';
import fs from 'fs';

function formatBalance(balance) {
    const amountf = (b, prop) => utils.format.formatNearAmount(b[prop], 8);
    return `Ⓝ ${amountf(balance, 'total')}=${amountf(balance, 'stateStaked')}+${amountf(balance, 'available')}`;
}

function parseNEAR(yoctoNEAR) {
    return Number(utils.format.formatNearAmount(yoctoNEAR));
}

function calculateGas(result) {
    // let gasBurnt = [];
    let tokensBurnt = [];
    // gasBurnt.push(result.transaction_outcome.outcome.gas_burnt);
    tokensBurnt.push(parseNEAR(result.transaction_outcome.outcome.tokens_burnt));
    for (let i = 0; i < result.receipts_outcome.length; i++) {
        // gasBurnt.push(result.receipts_outcome[i].outcome.gas_burnt);
        tokensBurnt.push(parseNEAR(result.receipts_outcome[i].outcome.tokens_burnt));
    }
    // const gasBurnt = Number((result.transaction_outcome.outcome.gas_burnt / 1e12).toFixed(8));
    return {
        // gasBurnt: gasBurnt.reduce((acc, cur) => acc + cur, 0),
        tokensBurnt: tokensBurnt.reduce((acc, curr) => acc + curr, 0),
    };
}

function formatActions(transaction) {
    if (transaction === undefined) {
        return "<init>";
    }

    let result = "";
    for (const action of transaction.actions) {
        if (action.FunctionCall !== undefined) {
            result += action.FunctionCall.method_name;
        }
        if (action.DeployContract !== undefined) {
            result += '<deploy>';
        }
    }

    return result;
}

const trace = JSON.parse(fs.readFileSync('test/trace.json'));
const createData = [];
const deleteData = [];
let last = 0;

const data = [];
for (const entry of trace) {
    const actions = formatActions(entry.transaction);
    const gas = entry.transaction ? calculateGas(entry).tokensBurnt : '';
    console.log(`${actions}: ${formatBalance(entry.contract)} ${formatBalance(entry.alice)} ${gas}`)

    const stateStaked = parseNEAR(entry.contract.stateStaked);
    switch (actions) {
        case 'create_corgi':
            createData.push(stateStaked - last);
            break;
        case 'delete_corgi':
            deleteData.push(stateStaked - last);
            break;
    }
    last = stateStaked;

    if (actions !== '<init>') {
        data.push({ key: actions, value: stateStaked });
    }
}

fs.writeFileSync('test/data.js', 'const data=' + JSON.stringify(data));

const avg = (list) => list.reduce((acc, cur) => acc + cur, 0) / list.length;
console.log(avg(createData));
console.log(avg(deleteData));

// 0.06379199999999968
// -0.06280000000000009