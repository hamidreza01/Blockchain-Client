import { _Root } from "../../interfaces/Network/_Root";
import { _Errors } from "../../types/errors_interface";
import { config } from "../../../config";
import express from "express";
import axios from "axios";
import { _Block } from "../../interfaces/Blockchain/_Block";
export class Root implements _Root {
  private app = express();
  constructor(private port: number) {}
  start(): void {
    this.app.use(express.json());
    this.app.listen(this.port);
  }
  bet(channel: string, callback: Function): void {
    this.app.use(express.json());
    this.app.post("/" + channel, (req, res) => {
      callback(req.body);
      res.send("ok");
    });
  }
  send(channel: string, data: any) {
    try {
      axios.post(`http://${config.ROOT_URL}`, data);
    } catch (err) {
      console.log(`error send data to root server with ${channel} channel`);
    }
  }
}
