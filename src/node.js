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

  requiredGas() {
    if (this.children === undefined) {
      console.log(`Calculating gas for ${this.type} node`);
      console.log({
        cost: this.cost,
        req: this.cost,
      });
      return {
        cost: this.cost,
        req: this.cost,
      };
    } else {
      let totalReq = this.cost;
      let totalCost = this.cost;
      for (const child of this.children) {
        const { req, cost } = child.requiredGas();
        totalReq = Math.max(totalCost + req, totalReq);
        // we need to carry the _actual_ cost forward, as that is what we spend
        totalCost += cost;
      }

      // this is a hack to _not_ apply sixty_floorths to the "top level" call
      const req =
        this.type === "root" ? totalReq : Math.floor(totalReq / SIXTY_FOURTHS);
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
