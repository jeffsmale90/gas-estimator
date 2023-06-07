const SIXTY_FOURTHS = 63 / 64;

function nodeFromData(data) {
  const children = data.children?.map((child) => nodeFromData(child));
  const node = new Node(data.type, data.cost, data.req, children);

  return node;
}

class Node {
  type;
  cost;
  children;
  req;

  constructor(type, cost, req, children) {
    this.type = type;
    this.cost = cost;
    this.req = req || cost;
    if (children) {
      this.children = children;
    }
  }

  requiredGas(applySixtyFloorths) {
    if (this.children === undefined) {
      const result = {
        cost: this.cost,
        req: this.req,
      };
      console.log(`Fetching gas for ${this.type}`, result);
      return result;
    } else {
      let totalReq = 0;
      let totalCost = 0;
      for (const child of this.children) {
        const { req, cost } = child.requiredGas(true);
        totalReq = Math.max(totalCost + req, totalReq);
        // we need to carry the _actual_ cost forward, as that is what we spend
        totalCost += cost;
      }

      let req = totalReq;
      if (applySixtyFloorths) {
        req = Math.floor(totalReq / SIXTY_FOURTHS);
      }

      console.log(`Calculating gas for ${this.type}`, {
        cost: totalCost,
        req,
      });
      return {
        cost: totalCost + this.cost,
        req: req + this.req,
      };
    }
  }
}

module.exports = {
  Node,
  nodeFromData,
};
