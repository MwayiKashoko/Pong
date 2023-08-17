var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

var dx = 2;
var dy = -2;

var playerScore = 0;
var comScore = 0;

var upPressed = false;
var downPressed = false;

var wait = 0;

document.addEventListener("keydown", function(e) {
    if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    }
});

document.addEventListener("keyup", function(e) {
    if (e.keyCode == 38) {
        upPressed = false;
    } else if (e.keyCode == 40) {
        downPressed = false;
    }
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Obj(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
}

Obj.prototype.draw = function() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
};

Obj.prototype.hits = function(obj) {
    if (this.x + this.w > obj.x && this.x < obj.x + obj.w && this.y + this.h > obj.y && this.y < obj.y + obj.h) {
        return true;
    } else {
        return false;
    }
};

var com = new Obj(15, height / 2 - 37.5, 15, 75, "white");
var player = new Obj(width - 30, height / 2 - 37.5, 15, 75, "white");

var ball = new Obj(width / 2 - 10, height / 2 - 10, 20, 20, "white");

function lines() {
    for (let i = 0; i < 13; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(width / 2 - 5, 30 * i + 10, 10, 15);
    }
}

function reset() {
    com.y = height / 2 - player.h / 2;
    player.y = height / 2 - player.h / 2;
    ball.x = width / 2 - ball.w / 2;
    ball.y = height / 2 - ball.h / 2;

    if (random(1, 2) === 1) {
        dx = -2;
    } else {
        dx = 2;
    }

    if (random(1, 2) === 1) {
        dy = -2;
    } else {
        dy = 2;
    }

    wait = 0;
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    com.draw();
    player.draw();

    lines();

    ctx.font = "75px VT323";
    ctx.fillText(comScore, width / 5, 90);
    ctx.fillText(playerScore, width - width / 4, 90);

    ball.draw();

    if (ball.x < -ball.w / 2) {
        playerScore++;
        reset();
    } else if (ball.x > width - ball.w / 2) {
        comScore++;
        reset();
    }

    if (ball.y < 0) {
        dy = Math.abs(dy);
    } else if (ball.y > height - ball.h) {
        dy = -Math.abs(dy);
    }

    if (ball.hits(player) && dx > 0) {
        dx += 1 / 8;
        dx = -Math.abs(dx);

        if (ball.y < player.y + player.h / 2) {
            dy = random(-5, -2);
        } else {
            dy = random(2, 5);
        }
    }

    if (ball.hits(com) && dx < 0) {
        dx -= 1 / 8;
        dx = Math.abs(dx);

        if (ball.y < com.y + com.h / 2) {
            dy = random(-5, -2);
        } else {
            dy = random(2, 5);
        }
    }

    if (wait === 50) {
        ball.x += dx;
        ball.y += dy;

        if (ball.x < width / 2 && dx < 0) {
            if (ball.y < com.y + 32.5) {
                com.y -= 4;
            } else if (ball.y > com.y + 42.5) {
                com.y += 4;
            }
        }

        if (upPressed && player.y > 0) {
            player.y -= 7;
        } else if (downPressed && player.y < height - player.h) {
            player.y += 7;
        }
    }
}

function update() {
    draw();

    if (wait < 50) {
        wait++;
    }

    requestAnimationFrame(update);
}

update();