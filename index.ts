import { Root } from "./Src/classes/Network/Root";
import { _Root } from "./Src/interfaces/Network/_Root";
import { Blockchain } from "./Src/classes/Blockchain/Blockchain";
import { _Blockchain } from "./Src/interfaces/Blockchain/_Blockchain";
import { _Block } from "./Src/interfaces/Blockchain/_Block";
const root: _Root = new Root();
const blockChain: _Blockchain = new Blockchain();
root
  .start()
  .then((value) => {
    root.addMe();
  })
  .catch((err) => {
    console.log(err);
  });

root.bet("welcome", (data: Array<string>) => {
  console.log(data);
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
  // nodes.list = data;
});

root.bet("newNode", (data: string) => {
  // nodes.add(data)
});

root.bet("giveMeData", () => {
  // root.giveData(blockChain.chain , nodes.list)
});
