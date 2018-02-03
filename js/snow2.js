let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const MaxFlakes = 400; 
let flakes = [];
getRand = function(min = 0, max = 1, shouldFloor = true){
	let t = (Math.random() * (max - min)) + min;
	return shouldFloor ? t : Math.floor(t); 
}

function Flake(x, y, r, d) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.d = d;
}

Flake.prototype.draw(){
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	ctx.fill();
}

for(let i=0; i<MaxFlakes; i++){
	flakes.push(new Flake(getRand(0, W), getRand(0, H), getRand(5, 1), getRand(0, MaxFlakes)));
}

//https://codepen.io/therist/pen/YYaeER?editors=1010