const serverAdress = "803812be3ede.ngrok.io"
const ws = new WebSocket("wss://" + serverAdress)

ws.onmessage = message => {
  msg = JSON.parse(message.data);

  console.log(msg)
  if(msg.method == "connect"){
    const name = prompt("What do you want to be called?")
    send("connect", name)
  }
  if(msg.method == "text"){
    console.log(msg.data)
  }
  if(msg.method == "points"){
    drawData(msg.data)
  }

}
function send(method, data){
  const payLoad = {
    "method": method,
    "data": data
  }
  ws.send(JSON.stringify(payLoad))
}