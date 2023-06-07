const { nodeFromData } = require("./src/node");

// GAS LIMIT: 2436
// example 1:
// CODE  GASLEFT  GASLIMIT  COST  DEPTH   1/64
// -------------------------------------------
// CALL     2436      2436    100      0    36
// SSTORE   2336      2300    200      1     0
// PUSH     2136      2100      3      1     0
// RETURN   2133      2097      0      0     0
// RETURN   2133      2133      0      0     0
// GAS SPENT: 303

const rootData = {
  type: "root",
  cost: 0, // this is the intrinsic gas for the transaction
  children: [
    {
      type: "CALL",
      cost: 100,
      children: [
        {
          type: "SSTORE",
          cost: 200,
          req: 2300,
        },
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
      type: "RETURN",
      cost: 0,
    },
  ],
};

const rootNode = nodeFromData(rootData);

const minimumGas = rootNode.requiredGas();
console.log();
console.log(`Total gas spent:      ${minimumGas.cost} (Expected: 303)`);
console.log(`Minimum gas required: ${minimumGas.req} (Expected: 2436)`);
