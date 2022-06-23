import { _Root } from "../../interfaces/Network/_Root";
import { _Errors } from "../../types/errors_interface";
import { config } from "../../../config";
import express from "express";
import axios from "axios";
import { _Block } from "../../interfaces/Blockchain/_Block";
import uniqid from "uniqid";
export class Root implements _Root {
  readonly app = express();
  private hash = uniqid();
  constructor(private port: number) {}
  start(): void {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log(
        "\nip: %s\npath: %s\nmethod: %s\nbody: %s\n",
        req.ip,
        req.path,
        req.method,
        JSON.parse(Buffer.from(req.body.data, "base64").toString("ascii"))
      );
      req.body.data = JSON.parse(
        Buffer.from(req.body.data, "base64").toString("ascii")
      );
      next();
    });
    this.app.use((req, res, next) => {
      if (req.body.data.hash !== this.hash) {
        console.log("403")
        return res.send("403");
      }
      next();
    });
    this.app.listen(this.port/*,"0.0.0.0"*/);
  }
  bet(channel: string, callback: Function): void {
    this.app.post("/" + channel, (req, res) => {
      callback(req.body.data);
      res.send("ok");
    });
  }
  send(channel: string, data: any) {
    try {
      data.hash = this.hash;
      axios.post(`http://${config.ROOT_URL}/${channel}`, data);
    } catch (err) {
      console.log(`error send data to root server with ${channel} channel`);
    }
  }
}
