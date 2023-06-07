const SIXTY_FOURTHS = 63 / 64;

function nodeFromData(data) {
  const children = data.children?.map((child) => nodeFromData(child));
  const node = new Node(data.type, data.cost, children);

  return node;
}

class Node {
  type;
  cost;
  children;

  constructor(type, cost, children) {
    this.type = type;
    this.cost = cost;
    if (children) {
      this.children = children;
    }
  }

  requiredGas(applySixtyFloorths) {
    if (this.children === undefined) {
      return {
        cost: this.cost,
        req: this.cost,
      };
    } else {
      let totalReq = this.cost;
      let totalCost = this.cost;
      for (const child of this.children) {
        const { req, cost } = child.requiredGas(true);
        totalReq = Math.max(totalCost + req, totalReq);
        // we need to carry the _actual_ cost forward, as that is what we spend
        totalCost += cost;
      }

      const req = applySixtyFloorths
        ? Math.floor(totalReq / SIXTY_FOURTHS)
        : totalReq;
      console.log(`Calculating gas for ${this.type} node`, {
        cost: totalCost,
        req,
      });
      return {
        cost: totalCost,
        req,
      };
    }
  }
}

module.exports = {
  Node,
  nodeFromData,
};
