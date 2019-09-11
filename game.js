const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

const app = new Application({
    width: 800,
    height: 800,
    antialias: true,
    transparent: false,
    resolution: 1,
});

// declare global vars
let game = new Container(),
    startScreen = new Container(),
    winScreen,
    loseScreen,
    gameState,
    rocket;


// index.html div to hold the game
const gameport = document.getElementById("gameport");
gameport.appendChild(app.view);

loader.add([
    "img/start-canvas.png",
    "img/start-button.png",
    "img/space-canvas.png",
    "img/rocket.png"
    ])
    .load(initStart);

// add startScreen to game
function initStart() {
    let startCanvas = new Sprite(resources["img/start-canvas.png"].texture),
        startButton = new Sprite(resources["img/start-button.png"].texture);
    startScreen.addChild(startCanvas);
    startScreen.addChild(startButton);
    startButton.position.set(200, 100);
    app.stage.addChild(startScreen);

    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on('pointerdown', initGame);
}



function initGame() {
    startScreen.visible = false;

    // add canvas to game
    let canvas = new Sprite(resources["img/space-canvas.png"].texture);
    game.addChild(canvas);

    // add rocket to game and set properties
    rocket = new Sprite(resources["img/rocket.png"].texture);
    rocket.anchor.set(1, 1);
    rocket.position.set(50, 720);
    rocket.scale.set(1.25, 1.25);
    rocket.velx = 0;
    rocket.vely = 0;
    game.addChild(rocket);

    // add game container to stage
    app.stage.addChild(game);

    let up = keyboard("ArrowUp"),
        down = keyboard("ArrowDown"),
        left = keyboard("ArrowLeft"),
        right = keyboard("ArrowRight");

    //Left arrow key movement
    left.press = () => {
        rocket.velx = -5;
        rocket.vely = 0;
    };

    left.release = () => {
        // stops the rocket when all keys are in release state
        if (!right.isDown && rocket.vely === 0) {
          rocket.velx = 0;
        }
    };

    //Up arrow key movement
    up.press = () => {
        rocket.vely = -5;
        rocket.velx = 0;
    };
    up.release = () => {
        if (!down.isDown && rocket.velx === 0) {
          rocket.vely = 0;
        }
    };

      //Right arrow key movement
    right.press = () => {
        rocket.velx = 5;
        rocket.vely = 0;
    };
    right.release = () => {
        if (!left.isDown && rocket.vely === 0) {
          rocket.velx = 0;
        }
    };

      //Down arrow key movement
    down.press = () => {
        rocket.vely = 5;
        rocket.velx = 0;
    };
    down.release = () => {
        if (!up.isDown && rocket.velx === 0) {
          rocket.vely = 0;
        }
    };

    // set game state to play
    gameState = play;

    // add ticker which updates gameLoop 60 times per second
    app.ticker.add(e => gameLoop(e));
}

// gameLoop function which accepts the gamestate
function gameLoop(e) {
    gameState(e);
}

// function for when gamestate = play which enables rocket movement
function play(e) {
    rocket.x += rocket.velx;
    rocket.y += rocket.vely;
}










function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //handles keypresses
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //handles key up
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener("keydown", downListener, false);
  window.addEventListener("keyup", upListener, false);

  // remove event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

