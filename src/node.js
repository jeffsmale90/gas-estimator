const SIXTY_FOURTHS = 63 / 64;

function nodeFromData(data) {
  const children = data.children?.map((child) => nodeFromData(child));
  const node = new Node(data.type, data.cost, data.req, data.stipend, children);

  return node;
}

class Node {
  type;
  cost;
  children;
  minimum;
  stipend;

  constructor(type, cost, minimum, stipend, children) {
    this.type = type;
    this.cost = cost;
    this.stipend = stipend;
    this.minimum = minimum || cost;
    if (children) {
      this.children = children;
    }
  }

  requiredGas(applySixtyFloorths) {
    if (this.children === undefined) {
      const result = {
        cost: this.cost,
        minimum: this.minimum,
      };
      console.log(`Fetching gas for ${this.type}`, result);
      return result;
    } else {
      // the minimum and total cost of the subframe
      let childMinimum = 0;
      let childCost = 0;
      for (const child of this.children) {
        const { minimum, cost } = child.requiredGas(true);
        childMinimum = Math.max(childCost + minimum, childMinimum);
        // we need to carry the _actual_ cost forward, as that is what we spend
        childCost += cost;
      }

      // todo: SSTORE op cost may be greater than 2300 so a Math.max must be added somewhere

      if (this.stipend) {
        // Within the call frame, the gas limit will be the gas available + stipend.
        // The minimum gas required at the start of the call frame is the minimum gas required for the children - stipend.
        // The minimum gas required at the CALL opcode, will be the maximum of the CALL opcode gas, and
        // 64/63 of the minimum gas required within the frame.

        console.log(this.type, {
          cost: this.cost,
          minimum: this.minimum,
          stipend: this.stipend,
        });
        console.log("Minimum required to execute child frame: " + childMinimum);
        console.log(
          "Minimum required at the start of the frame: " +
            (childMinimum - this.stipend)
        );
        console.log(
          "Minimum required at the end of the CALL* opcode: " +
            Math.floor((childMinimum - this.stipend) / SIXTY_FOURTHS)
        );

        console.log(
          "Minimum required for CALL* opcode: " +
            (Math.floor((childMinimum - this.stipend) / SIXTY_FOURTHS) +
              this.minimum)
        );
        childMinimum -= this.stipend;
        childCost -= this.stipend;

        // even though the minimum required to execute the child is < 0, we need
        // enough to cover the CALL opcode. Total cost _can_ go negative though,
        // because we get the stipend for free.
        childMinimum = Math.max(0, childMinimum);
        console.log({ childMinimum, childCost });
      }

      if (applySixtyFloorths) {
        childMinimum = Math.floor(childMinimum / SIXTY_FOURTHS);
        console.log({ childMinimum, childCost });
      }

      return {
        cost: childCost + this.cost,
        minimum: childMinimum + this.minimum,
      };
    }
  }
}

module.exports = {
  Node,
  nodeFromData,
};
