function setup(){
  canvas = createCanvas(windowWidth, windowHeight - 100)
  canvas.parent('canvas')
  canvas.style("display","block")
}
points = []
drawColor = [255,0,0]
size = 10
function draw(){
  // background(220)
  // fill(255,0,0)
  // circle(mouseX, mouseY, 30)
  if(mouseIsPressed){
    points.push([pmouseX, pmouseY])
    stroke(drawColor)
    strokeWeight(size)
    line(pmouseX, pmouseY, mouseX, mouseY)
  }else{
    if(points.length > 0){
      points.push([pmouseX, pmouseY])
      send("points", {
        points: points,
        size: size,
        color: drawColor
      })
    }
    points = []
  }
}


function drawData(data){
  prevpt = data.points[0]
  for(pt of data.points.slice(1)){
    strokeWeight(data.size)
    stroke(data.color)
    line(pt[0], pt[1], prevpt[0], prevpt[1])
    prevpt = pt
  }

}


document.getElementById("color-picker").addEventListener("change", element=>{
  drawColor = colorFromHex(element.target.value)
})
document.getElementById("range").addEventListener("change", element=>{
  size = element.target.value
})

function colorFromHex(hex){
  console.log(hex)
  let r = parseInt(hex.slice(1,3),16)
  let g = parseInt(hex.slice(3,5),16)
  let b = parseInt(hex.slice(5,7),16)
  return([r, g, b])
}