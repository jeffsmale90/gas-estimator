const { nodeFromData } = require("./src/node");
const { readFileSync } = require("fs");
// example 1:
// CODE  GASLEFT  GASLIMIT  COST  DEPTH   1/64
// -------------------------------------------
// CALL      103       103    100      0     1
// PUSH        3         2      3      1     0
// RETURN      0        -1      0      1     0 // fail
// STOP        0         0      0      0     0
// GAS SPENT: 103

// CALL      104       103    100      0     1
// PUSH        3         2      3      1     0
// RETURN      0        -1      0      1     0 // fail
// STOP        0         0      0      0     0
// MINIMUM GAS: 107

const rootData = JSON.parse(readFileSync("./tree.json"));
const rootNode = nodeFromData(rootData);

const minimumGas = rootNode.requiredGas();
const gasLeft = rootNode.spendGas(minimumGas.minimum);

console.log();
console.log(`Total gas spent:      ${minimumGas.cost}`);
console.log(`Minimum gas required: ${minimumGas.minimum}`);
console.log(`Gas left over:        ${gasLeft}`);
