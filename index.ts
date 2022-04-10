import { Root } from "./Src/classes/Network/Root";
import { _Root } from "./Src/interfaces/Network/_Root";
import { Blockchain } from "./Src/classes/Blockchain/Blockchain";
import { _Blockchain } from "./Src/interfaces/Blockchain/_Blockchain";
import { _Block } from "./Src/interfaces/Blockchain/_Block";
import { Nodes } from "./Src/classes/Network/Nodes";
import { _Nodes } from "./Src/interfaces/Network/_Nodes";
const blockChain: _Blockchain = new Blockchain();
const port = Math.floor(Math.random() * 10000);
const root: _Root = new Root(port + 2);
const nodes: _Nodes = new Nodes(port);
root
  .start()
  .then((value) => {
    nodes.start(blockChain);
    root.addMe();
  })
  .catch((err) => {
    console.log(err);
  });

root.bet("welcome", (data: Array<string>) => {
  nodes.list = data;
});

root.bet("sliceChain", (data: number) => {
  blockChain.chain = blockChain.chain.filter((x, i) => {
    return i < data;
  });
});

root.bet("reaplceChain", (data: Array<_Block>) => {
  blockChain.chain = data;
});

root.bet("replaceNodes", (data: Array<string>) => {
  nodes.list = data;
});

root.bet("newNode", (data: string) => {
  nodes.list.push(data);
  console.log(nodes.list)
});

root.bet("giveMeData", () => {
  root.giveData(blockChain.chain, nodes.list);
});
