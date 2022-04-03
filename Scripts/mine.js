const {Blockchain : BlockChain} = require("../Src/classes/Blockchain/Blockchain")
const { style } = require("cls.js");
const cluster = require("cluster");
const numCPUs = 2;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  };
  

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid} started`);
  const blockChain = new BlockChain();
  blockChain.addBlock("initial");
  let pt, nt, nb, td, average;
  const times = [];
  for (let i = 0; i < 10000; i++) {
    pt = blockChain.chain[blockChain.chain.length - 1].timestamp;
    blockChain.addBlock(`block${i}`);
    nb = blockChain.chain[blockChain.chain.length - 1];
    nt = nb.timestamp;
    td = nt - pt;
    times.push(td);
    average =
      times.reduce((total, num) => {
        return total + num;
      }) / times.length;

    style({
      text: `time to mine block : ${td}ms`,
      color: "blue",
    });
    style({
      text: `Difficulity : ${nb.difficulty}`,
      color: "red",
    });

    style({
      text: `average time : ${Math.floor(average)}ms`,
      color: "yellow",
    });
    style({
      text: `-----------------------`,
      color: "white",
    })
    console.log(BlockChain.isValid(blockChain.chain))
  }
}
