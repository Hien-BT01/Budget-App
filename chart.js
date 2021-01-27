

let canvas = document.createElement("canvas")

canvas.width = 50;
canvas.height = 50;
console.log($(".chart"))
$(".chart").append(canvas)

const context = canvas.getContext("2d")

context.lineWidth = 8;
const R = 20;
function drawCircle(color,ratio,anticlockwise){
    context.strokeStyle = color;
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height/2 , R, 0, ratio * 2 * Math.PI, anticlockwise);
    context.stroke()
}
function updateDraw(income,outcome,drawCircle){
    context.clearRect(0,0,canvas.width,canvas.height);
    let ratio = income / (income + outcome);
    drawCircle("#fefefe",ratio,true);
    drawCircle("#f0264d",1 - ratio,false);
}