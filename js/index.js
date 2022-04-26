const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "../assets/background.png",
});

const player = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "../assets/martial-hero/sprites/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "../assets/martial-hero/sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "../assets/martial-hero/sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../assets/martial-hero/sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "../assets/martial-hero/sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "../assets/martial-hero/sprites/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc:
        "../assets/martial-hero/sprites/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "../assets/martial-hero/sprites/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const opponent = new Fighter({
  position: {
    x: 760,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "../assets/fantasy-warrior/sprites/Idle.png",
  framesMax: 10,
  scale: 3.1,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "../assets/fantasy-warrior/sprites/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "../assets/fantasy-warrior/sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../assets/fantasy-warrior/sprites/Jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "../assets/fantasy-warrior/sprites/Fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "../assets/fantasy-warrior/sprites/Attack1.png",
      framesMax: 7,
    },
    takeHit: {
      imageSrc: "../assets/fantasy-warrior/sprites/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "../assets/fantasy-warrior/sprites/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  opponent.update();

  player.velocity.x = 0;
  opponent.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (keys.ArrowLeft.pressed && opponent.lastKey === "ArrowLeft") {
    opponent.velocity.x = -5;
    opponent.switchSprite("run");
  } else if (keys.ArrowRight.pressed && opponent.lastKey === "ArrowRight") {
    opponent.velocity.x = 5;
    opponent.switchSprite("run");
  } else {
    opponent.switchSprite("idle");
  }

  if (opponent.velocity.y < 0) {
    opponent.switchSprite("jump");
  } else if (opponent.velocity.y > 0) {
    opponent.switchSprite("fall");
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: opponent,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    opponent.takeHit();
    player.isAttacking = false;

    document.querySelector(".opponent-health").style.width =
      opponent.health + "%";
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: opponent,
      rectangle2: player,
    }) &&
    opponent.isAttacking &&
    opponent.framesCurrent === 2
  ) {
    player.takeHit();
    opponent.isAttacking = false;

    document.querySelector(".player-health").style.width = player.health + "%";
  }

  if (opponent.isAttacking && opponent.framesCurrent === 2) {
    opponent.isAttacking = false;
  }

  if (opponent.health <= 0 || player.health <= 0) {
    determineWinner({ player, opponent, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!opponent.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        opponent.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        opponent.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        opponent.velocity.y = -20;
        break;
      case "ArrowDown":
        opponent.attack();

        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
