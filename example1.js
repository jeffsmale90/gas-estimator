const { nodeFromData } = require("./src/node");
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

const rootData = {
  type: "root",
  cost: 0, // this is the intrinsic gas for the transaction
  children: [
    {
      type: "CALL",
      cost: 100,
      children: [
        {
          type: "PUSH",
          cost: 3,
        },
        {
          type: "RETURN",
          cost: 0,
        },
      ],
    },
    {
      type: "STOP",
      cost: 0,
    },
  ],
};

const rootNode = nodeFromData(rootData);

const minimumGas = rootNode.requiredGas();
console.log();
console.log(`Total gas spent:      ${minimumGas.cost}`);
console.log(`Minimum gas required: ${minimumGas.req}`);
