const[PHASE_HIDDEN, PHASE_SHOWING, PHASE_SHOOTING, PHASE_HIDING, PHASE_DEATH] = [1, 2, 3, 4, 5];
const UPDATE_PERIOD = 40; // in ms
const PHASE_LENGTH = 1.5;

var $ = document.querySelector.bind(document);

class Enemy {
  constructor(x, y, amplitude)
  {
	this.phase = PHASE_HIDDEN;
	this.counter = 0;
	this.x = x;
	this.y = y;
	this.width = $("#enemy-ship").width;
	this.height = $("#enemy-ship").height;
	this.dy = 0;
	this.amplitude = amplitude
  }

  update(dt) {
	this.counter += dt;
	switch (this.phase) {
	  case PHASE_HIDDEN:
		if (Math.random() < 0.02 && this.counter > PHASE_LENGTH) {
			this.phase = PHASE_SHOWING;
			this.counter = 0;
		}
		break;

	  case PHASE_SHOWING:
		this.dy = (this.counter / PHASE_LENGTH) * this.amplitude;
		if (this.counter > PHASE_LENGTH) {
		  this.counter = 0;
		  this.phase = PHASE_SHOOTING;
		}
		break;

	  case PHASE_HIDING:
		this.dy = (1 - (this.counter / PHASE_LENGTH)) * this.amplitude;
		if (this.counter > PHASE_LENGTH) {
		  this.counter = 0;
		  this.phase = PHASE_HIDDEN;
		}
		break;

	  case PHASE_SHOOTING:
		this.dy = this.amplitude;
		if (this.counter > .5) {
		  this.counter = 0;
		  this.phase = PHASE_HIDING;
		}
		break;

	  case PHASE_DEATH:
		this.dy = 0;
		if (this.counter > PHASE_LENGTH) {
		  this.counter = 0;
		  this.phase = PHASE_HIDDEN;
		}
	}
  }

  draw(ctx) {
	ctx.drawImage($("#enemy-ship"), this.x, this.y - this.dy);
  }
}

class Game {
  constructor()
  {
	this.enemies = new Array(4);
	this.enemies[0] = new Enemy(10, 150, 75);
	this.enemies[1] = new Enemy(110, 260, 100);
	this.enemies[2] = new Enemy(250, 170, 100);
	this.enemies[3] = new Enemy(425, 100, 100);
  }
}

function start_game()
{
  var canvas = $("#main-canvas");
  this.ctx = canvas.getContext("2d");
  this.game = new Game();
  this.lastFire = 0;
  this.firing = false;
  this.mouseX = 0;
  this.mouseY = 0;
  this.score = 0;
  this.fire_no = 0;
  this.gun_sounds = new Array(10);
  this.death_sounds = new Array(10);
  for (var i = 0; i < 10; ++i) {
	gun_sounds[i] = $("#gun-sound").cloneNode(true);
	death_sounds[i] = $("#death-sound").cloneNode(true);
  }

  setInterval(render.bind(this), 16.66666);
  setInterval(update.bind(this), UPDATE_PERIOD);
  canvas.width = 480;
  canvas.height = 360;

  canvas.onmousedown = (evt) => {
	this.firing = true;
  }

  canvas.onmouseup = (evt) => {
	this.firing = false;
  }

  canvas.onmousemove = (evt) => {
	var rect = this.ctx.canvas.getBoundingClientRect();
	var ratio = this.ctx.canvas.width / (rect.right - rect.left);
	this.mouseX = evt.offsetX * ratio;
	this.mouseY = evt.offsetY * ratio;
  }
}

function update()
{
  this.lastFire -= UPDATE_PERIOD / 1000;
  if ( this.firing && this.lastFire <= 0) {
	this.fire_no++;
	this.gun_sounds[this.fire_no % 10].play();
	var {imgwidth : width, imgheight: height} = $("#enemy-ship");
	this.lastFire = .33;
	this.game.enemies.forEach(e => {
	  if (this.mouseX >= e.x && this.mouseX < e.x + e.width &&
	  this.mouseY >= e.y - e.dy && this.mouseY <= e.y - e.dy + e.height
	  && e.phase != PHASE_HIDDEN) {
		if ((e.phase == PHASE_HIDING && e.count < PHASE_LENGTH * .9) 
		 || (e.phase == PHASE_SHOWING)
		 ||  e.phase == PHASE_SHOOTING) {
		  this.death_sounds[this.score % 10].play();
		  e.phase = PHASE_DEATH;
		  e.count = 0;
		  this.score ++;
		}
	  }
	});
  }

  this.game.enemies.forEach(e => {
	e.update(UPDATE_PERIOD / 1000);
  });
}

function render()
{
  this.ctx.fillStyle = "black";
  this.ctx.drawImage($("#sky-bg"), 0, 0);
  game.enemies[0].draw(ctx);
  this.ctx.drawImage($("#back-bg"), 0, 0);
  game.enemies[1].draw(ctx);
  game.enemies[2].draw(ctx);
  game.enemies[3].draw(ctx);
  this.ctx.drawImage($("#front-bg"), 0, 0);
  this.ctx.fillStyle = "yellow";
  this.ctx.strokeStyle = "black";
  this.ctx.strokeText("Score: " + this.score, 10, 10);
  this.ctx.fillText("Score: " + this.score, 10, 10);
}

