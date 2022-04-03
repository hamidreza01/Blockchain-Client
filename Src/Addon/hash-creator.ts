import * as crypto from "crypto";
export const hashCreator = (...data: Array<string>): string => {
  const hash = crypto.createHash("sha256");
  return hash
    .update(
      data
        .sort()
        .map((x) => {
          return JSON.stringify(x);
        })
        .join(" ")
    )
    .digest("hex");
};
