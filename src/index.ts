import http from "http";
import "dotenv/config";

import { users } from "./data";
import { getReqData } from "./getReqData";
import { createUser } from "./controller";
import { DataForNewUser } from "./interfaces";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async function (req, res) {
  console.log(req.url);
  console.log(req.method);
  if (req.url === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else if (req.url === "/api/users" && req.method === "POST") {
    const userData = (await getReqData(req)) as string;
    console.log("userData:", userData);
    console.log(typeof userData);
    const newUser = await createUser(JSON.parse(userData));
    if (newUser) {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    } else {
      res.end(JSON.stringify({ message: "Incorrect Data" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found!!!" }));
  }
});

server.listen(PORT);

console.log(`Node.js web server at port ${PORT} is running.`);
