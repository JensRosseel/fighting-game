function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, opponent, timerId }) {
  clearTimeout(timerId);
  document.querySelector(".info-container").style.display = "flex";
  if (player.health === opponent.health) {
    document.querySelector(".info-container").innerHTML = "Tie";
  } else if (player.health > opponent.health) {
    document.querySelector(".info-container").innerHTML = "Player 1 Wins";
  } else if (player.health < opponent.health) {
    document.querySelector(".info-container").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, opponent, timerId });
  }
}
