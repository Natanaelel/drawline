// const express = require("express")
// const app = express()

// const port = process.env.PORT || 3000

// app.use(express.static(__dirname + "/public"))

// app.listen(port, () => console.log("App listening on "+port));


const http = require("http")
const websocketServer = require("websocket").server

const ServerPort = process.env.PORT || 3000

const httpServer = http.createServer();

httpServer.listen(ServerPort, () => console.log("Server listening on "+ServerPort));

const wsServer = new websocketServer({
  "httpServer": httpServer
})


clients = {}

wsServer.on("request", request => {
  //on connect
  const connection = request.accept(null, request.orgin)
  connection.id = guid()
  connection.name = "loading"
  console.log("New connection")
  console.log(connection)

  clients[connection.id] = connection

  console.log(clients)

  connection.on("open", () => console.log("opened"))
  connection.on("close", (req, res) => {
    console.log(`${connection.name} (${connection.id}) disconnected`)

    console.log(clients)
    broadcast("text", `${connection.name} disconnected!`)

    delete(clients[connection.id])
  })
  connection.on("message", msg => {
    handleMessage(connection, JSON.parse(msg.utf8Data))
  })


  send(connection, "connect", null)

})

function handleMessage(connection, msg){
  console.log(msg)
  const method = msg.method

  if(method == "connect"){
    connection.name = msg.data || "Unnamed_"+Math.floor(Math.random()*10000).toString().padStart(4,"0")
    broadcast("text", `${connection.name} connected`, connection.id)
  }

  if(method == "points"){
    broadcast("points", msg.data, connection.id)
  }


}



function send(connection, method, data){
  const payLoad = {
    "method": method,
    "data": data
  }
  connection.send(JSON.stringify(payLoad))
}
function broadcast(method, data, senderId){
  for(key in clients){
    if(senderId == key)continue
    send(clients[key], method, data)
  }
}

function guid(){
  const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

  return((S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase())
}
