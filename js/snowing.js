var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var tinySnowBalls = [];
var teenySnowBalls = [];


function SnowBall(x, y, r, vel){
	this.x = x;
	this.y = y;
	this.r = r;
	this.vel = vel || 3000;
}

SnowBall.prototype.draw = function(){
	ctx.fillStyle = 'rgba(0,0,0,1)'; //update
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	ctx.fill();

}
SnowBall.prototype.move = function(){
	this.y += this.vel;
}

function makeItSnow(){
	let countTiny = Math.floor( width / 32 ) + 1;
	let countTeeny = Math.floor( width / 80 ) + 3;
	let ittTiny = 12;
	let ittTeeny = 20;

	while(tinySnowBalls.length < countTiny){
		let snowFlake = new SnowBall(ittTeeny, 12, 8);
		tinySnowBalls.push(snowFlake);
		ittTeeny += 32;
	}
	while(teenySnowBalls.length < countTeeny){
		let snowFlake1 = new SnowBall(ittTiny, 44, 4),
			snowFlake2 = new SnowBall(ittTiny+8, 36, 4),
			snowFlake3 = new SnowBall(ittTiny+16, 44, 4),
			snowFlake4 = new SnowBall(ittTiny+40, 28, 4),
			snowFlake5 = new SnowBall(ittTiny+48, 36, 4),
			snowFlake6 = new SnowBall(ittTiny+56, 28, 4);
		teenySnowBalls = [...teenySnowBalls, snowFlake1, snowFlake2, snowFlake3, snowFlake4, snowFlake5, snowFlake6];
		ittTeeny += 80;
	}

	teenySnowBalls.forEach(function(item){
		item.draw();
		item.move();
	});
	tinySnowBalls.forEach(function(item){
		item.draw();
		item.move();
	});

}
//setInterval(makeItSnow, 3000);




// first circle 
// x = 12, y = 12, r = 8

// next row
// x = 20, y = 44, r = 4
// x = 28, y = 36, r = 4 (x = firstx + 8)
// x = 36, y = 44, r = 4 (x = firstx + 16)
// x = 60, y = 28, r = 4 (x = firstx + 40)
// x = 68, y = 36, r = 4 (x = firstx + 48) 
// x = 76, y = 28, r = 4 (x = firstx + 56)
