var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")



context.beginPath()
context.arc(800, 300, 30, 0, Math.PI * 2, false)
context.strokeStyle = "black"
context.stroke()

