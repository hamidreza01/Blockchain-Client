import { _Root } from "../../interfaces/Network/_Root";
import { _Errors } from "../../types/errors_interface";
import { config } from "../../../config";
import net from "net";
import { _Block } from "../../interfaces/Blockchain/_Block";
export class Root implements _Root {
  private client: any;
  constructor(private port: number) {
    this.client = net.createConnection({
      port: config.ROOT_PORT,
      host: config.ROOT_URL,
      localPort: port,
    });
  }
  private classData: Array<{ betName: string; callBack: Function }> = [
    {
      betName: "genesis",
      callBack: () => {
        console.log('oops, im genesis')
      },
    },
  ];
  start(): Promise<_Errors | boolean> {
    this.client.on("data", (data: any) => {
      console.log(data.toString());
      try {
        data = JSON.parse(data.toString());
      } catch (error) {
        console.log(error);
      }
      let better = this.classData.find((x) => {
        return x.betName === data.action;
      });
      if (better) {
        better.callBack(data.data ? data.data : undefined);
      }
    });
    return new Promise((res, rej) => {
      this.client.on("connect", () => {
        res(true);
      });
      this.client.on("timeout", () => {
        rej({ message: "connect to the root server of timeout", code: 251 });
      });
      this.client.on("error", () => {
        rej({ message: "error connecting to the root server", code: 250 });
      });
    });
  }
  addMe(): void | _Errors {
    this.client.write(JSON.stringify({ action: "addMe" }));
    this.client.on("timeout", () => {
      return { message: "connect to the root server of timeout", code: 251 };
    });
    this.client.on("error", () => {
      return { message: "error connecting to the root server", code: 250 };
    });
  }
  giveData(chain: Array<_Block>, nodeList: Array<string>): void | _Errors {
    this.client.write(
      JSON.stringify({ action: "giveMeData", data: { chain, nodeList } })
    );
    this.client.on("timeout", () => {
      return { message: "connect to the root server of timeout", code: 251 };
    });
    this.client.on("error", () => {
      return { message: "error connecting to the root server", code: 250 };
    });
  }
  bet(betName: string, callBack: Function): void {
    this.classData.push({ betName, callBack });
  }
}
