export function getReqData(req: any) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk: { toString: () => string }) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch {
      resolve("");
    }
  }).catch(() => {
    console.log("WE ARE IN CATCH");
    return "";
  });
}
