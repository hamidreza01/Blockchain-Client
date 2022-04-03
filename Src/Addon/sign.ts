import elliptic, { SignatureInput } from "elliptic";
import { hashCreator } from "./hash-creator";
export const ec = new elliptic.ec("ed25519");
export const verify = (data: {}, sign: SignatureInput, publicKey: string): boolean => {
  const vrf = ec.keyFromPublic(publicKey, "hex");
  try {
    return vrf.verify(hashCreator(JSON.stringify(data)), sign);
  } catch (error) {
    return false;
  }
};
