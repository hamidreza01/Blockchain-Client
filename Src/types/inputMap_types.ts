import { SignatureInput } from "elliptic";

export type inputMap_type = {
  timestamp: number;
  address: string;
  amount: number;
  signature: SignatureInput;
};
