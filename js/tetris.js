const game = document.querySelector(".game > ul");

console.log(game);

for (let i = 0; i < 20; i++) {
  const li = document.createElement("li");
  const ul = document.createElement("ul");

  for (let j = 0; j < 10; j++) {
    const horizon = document.createElement("li");
    ul.prepend(horizon);
  }

  li.prepend(ul);
  game.prepend(li);
}
