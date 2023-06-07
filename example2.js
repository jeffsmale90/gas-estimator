const { nodeFromData } = require("./src/node");
// example 2:
// CODE  GASLEFT  GASLIMIT  COST  DEPTH   1/64
// -------------------------------------------
// CALL     1000      1000   100      0     14
// PUSH      900       886     3      1      0
// PUSH      897       883     3      1      0
// RETURN    894       880     0      1      0
// STOP      894       894     0      0      0
//
// GAS SPENT: 106
// CALL      106       106    100      0     1
// PUSH        6         5      3      1     0
// PUSH        3         2      3      1     0 // <-- fails because this actually needs 1 additional gas
// RETURN      0        -1      0      1     0
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
          type: "PUSH",
          cost: 3,
        },
        {
          type: "RETURN",
          cost: 0,
        },
      ],
    },
  ],
};

const rootNode = nodeFromData(rootData);

const minimumGas = rootNode.requiredGas();
console.log();
console.log(`Total gas spent:      ${minimumGas.cost}`);
console.log(`Minimum gas required: ${minimumGas.req}`);
