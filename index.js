const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const score_element = document.querySelector("#score_element");
const start_btn = document.querySelector("#start_btn");
const score_board = document.querySelector("#score_board");
const score_board_value = document.querySelector("#score_board_value");
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemies {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, "white");
let projectiles = [];
let enemies = [];

function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  score = 0;
  score_element.innerHTML = score;
  score_board_value.innerHTML = score;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 6) + 6;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360},50% ,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle) * 1.5,
      y: Math.sin(angle) * 1.5,
    };

    enemies.push(new Enemies(x, y, radius, color, velocity));

    console.log(enemies);
  }, 1000);
}

let animationID;
let score = 0;
function animate() {
  animationID = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, index) => {
    projectile.update();
    // removing projectiles out of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationID);
      score_board.style.display = "flex";
      score_board_value.innerHTML = score;
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // objects touch

      if (dist - enemy.radius - projectile.radius < 1) {
        score += 1;
        score_element.innerHTML = score;
        setTimeout(() => {
          enemies.splice(index, 1);
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = { x: Math.cos(angle) * 7, y: Math.sin(angle) * 7 };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

start_btn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  score_board.style.display = "none";
});
