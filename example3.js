const { nodeFromData } = require("./src/node");
// example 3:
// CODE  GASLEFT  GASLIMIT  COST  DEPTH   1/64
// -------------------------------------------
// CALL     1000      1000   100      0     14
// PUSH      900       886     3      1      0
// CALL      897       883   100      1     14
// PUSH      797       769     3      2      0
// RETURN    794       766     0      2      0
// RETURN    794       780     0      1      0
// STOP      794       794     0      0      0

// GAS SPENT: 206
// -------------------------------------------
// CALL      210       210   100      0      3
// PUSH      110       107     3      1      0
// CALL      107       104   100      1      1
// PUSH      7           3     3      2      0
// RETURN    4           0     0      2      0
// RETURN    4           0     0      1      0
// STOP      4           0     0      0      0
// MINIMUM GAS: 210

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
console.log(`Total gas spent:      ${minimumGas.cost}`);
console.log(`Minimum gas required: ${minimumGas.req}`);
