const canvas = document.querySelector('canvas'), 
	ctx = canvas.getContext('2d'),
	MAXW = 2024,
	MAXH = 2400;

let width = canvas.width = $('body').width();
let height = canvas.height = $('body').height();
$(window).on('resize', function(){
	console.log('resize');
	width = canvas.width = $('body').width();
	height = canvas.height = $('body').height();
});

let tinySnowBalls = [];
let teenySnowBalls = [];
function SnowBall(x, y, r, vel){
	this.x = x;
	this.y = y;
	this.r = r;
	this.vel = vel || 1;
}

SnowBall.prototype.draw = function(){
	ctx.fillStyle = 'rgba(180, 231, 248, .3)';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	ctx.fill();
}
SnowBall.prototype.move = function(){
	this.y += this.vel;
	if( this.y > MAXH + 10 ){ this.y = -10 ; }
}

function makeSnow(){
	for(let y = 12 ; y < MAXH ; y += 48){
		let ittTiny = 12;
		let ittTeeny = 20;

		while(ittTeeny < MAXW){
			let snowFlake = new SnowBall(ittTeeny, y , 8);
			tinySnowBalls.push(snowFlake);
			ittTeeny += 32;
		}

		while(ittTiny < MAXW){
			let snowFlake1 = new SnowBall(ittTiny, y+32, 4),
				snowFlake2 = new SnowBall(ittTiny+8, y+24, 4),
				snowFlake3 = new SnowBall(ittTiny+16, y+32, 4),
				snowFlake4 = new SnowBall(ittTiny+40, y+16, 4),
				snowFlake5 = new SnowBall(ittTiny+48, y+24, 4),
				snowFlake6 = new SnowBall(ittTiny+56, y+16, 4);
			teenySnowBalls = [...teenySnowBalls, snowFlake1, snowFlake2, snowFlake3, snowFlake4, snowFlake5, snowFlake6];
			ittTiny += 80;
		}
	}
	console.log('teeny', teenySnowBalls, 'tiny', tinySnowBalls);
}

function makeItSnow(){
	// get rid of old snow
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, width, height);

	teenySnowBalls.forEach(function(item){
		item.draw();
		item.move();
	});
	tinySnowBalls.forEach(function(item){
		item.draw();
		item.move();
	});

	requestAnimationFrame(makeItSnow);
}
makeSnow();
makeItSnow();
//setInterval(makeItSnow, 100);
