import { cpus } from "os";
import cluster from "cluster";
import http from "http";
import "dotenv/config";

import { getReqData } from "./getReqData";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "./controller";
import { JSON_HEADER, URL_REGEXP } from "./constants";

const PORT = process.env.PORT || 3000;

export const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  try {
    console.log(req.url);
    console.log(req.method);
    if (url === "/api/users" && method === "GET") {
      console.log("WE ARE IN GET");
      const { statusCode, ...data } = getAllUsers();
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url === "/api/users" && method === "POST") {
      console.log("WE ARE IN POST");
      const reqData = (await getReqData(req)) as string;
      console.log("reqData - ", reqData);
      const { statusCode, ...data } = createUser(reqData);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url?.match(URL_REGEXP) && method === "GET") {
      console.log("WE ARE IN GET BY ID");
      const userUuid = url.split("/")[3];
      console.log("userUuid:", userUuid);
      const { statusCode, ...data } = getUserById(userUuid);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url?.match(URL_REGEXP) && method === "PUT") {
      console.log("WE ARE IN PUT");
      const userUuid = url.split("/")[3];
      const reqData = (await getReqData(req)) as string;
      console.log("userUuid:", userUuid);
      const { statusCode, ...data } = updateUserById(userUuid, reqData);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url.match(URL_REGEXP) && method === "DELETE") {
      console.log("WE ARE IN DELETE");
      const userUuid = url.split("/")[3];
      console.log("userUuid:", userUuid);
      const { statusCode, ...data } = deleteUserById(userUuid);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(404, JSON_HEADER);
      res.end(JSON.stringify({ message: "Unfortunatelly, route not found" }));
    }
  } catch {
    res.writeHead(500, JSON_HEADER);
    res.end(JSON.stringify({ message: "Something went wrong on the server" }));
  }
});
console.log("ENVIRONMENT", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "test") {
  if (cluster.isPrimary && process.env.NODE_ENV === "multi") {
    const CPUS_AMOUNT = cpus().length;

    for (let i = 0; i < CPUS_AMOUNT; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker with id ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    server.listen(PORT, () =>
      console.log(
        `Node.js web server at port ${PORT} and process's id ${process.pid} is running.`
      )
    );
  }
}
