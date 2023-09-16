import * as http from "http";
import SocketIO from "socket.io";
import { WorkPlace } from "../core/event/event";
var server = http.createServer(function (request, response) {
  response.end("这是页面内容，你请求的路径是：" + request.url);
});

// console.log(SocketIO);
const lobbySocket = SocketIO.listen(server, {
  origins: "*:*",
});

lobbySocket.on("connection", (socket) => {
  console.log(socket.id);
  socket.emit("hello", { name: "小靖" });
});

server.listen(2020, function () {
  console.log("正在监听 %s 端口", 2020);
});
