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
    if (url === "/api/users" && method === "GET") {
      const { statusCode, ...data } = getAllUsers();
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url === "/api/users" && method === "POST") {
      const reqData = (await getReqData(req)) as string;
      const { statusCode, ...data } = createUser(reqData);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url?.match(URL_REGEXP) && method === "GET") {
      const userUuid = url.split("/")[3];
      const { statusCode, ...data } = getUserById(userUuid);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url?.match(URL_REGEXP) && method === "PUT") {
      const userUuid = url.split("/")[3];
      const reqData = (await getReqData(req)) as string;
      const { statusCode, ...data } = updateUserById(userUuid, reqData);
      res.writeHead(statusCode, JSON_HEADER);
      res.end(JSON.stringify(data));
    } else if (url && url.match(URL_REGEXP) && method === "DELETE") {
      const userUuid = url.split("/")[3];
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
