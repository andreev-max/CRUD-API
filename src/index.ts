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
import { URL_REGEXP } from "./constants";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  console.log(req.method);
  if (req.url === "/api/users" && req.method === "GET") {
    console.log("WE ARE IN GET");
    const { statusCode, ...data } = getAllUsers();
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (req.url === "/api/users" && req.method === "POST") {
    console.log("WE ARE IN POST");
    const reqData = (await getReqData(req)) as string;
    console.log("reqData - ", reqData);
    const { statusCode, ...data } = createUser(reqData);
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (req.url && req.url?.match(URL_REGEXP) && req.method === "GET") {
    console.log("WE ARE IN GET BY ID");
    const userUuid = req.url.split("/")[3];
    console.log("userUuid:", userUuid);
    const { statusCode, ...data } = getUserById(userUuid);
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (req.url && req.url?.match(URL_REGEXP) && req.method === "PUT") {
    console.log("WE ARE IN PUT");
    const userUuid = req.url.split("/")[3];
    const reqData = (await getReqData(req)) as string;
    console.log("userUuid:", userUuid);
    const { statusCode, ...data } = updateUserById(userUuid, reqData);
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (req.url && req.url?.match(URL_REGEXP) && req.method === "DELETE") {
    console.log("WE ARE IN DELETE");
    const userUuid = req.url.split("/")[3];
    console.log("userUuid:", userUuid);
    const { statusCode, ...data } = deleteUserById(userUuid);
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unfortunatelly, route not found" }));
  }
});

server.listen(PORT, () =>
  console.log(`Node.js web server at port ${PORT} is running.`)
);
