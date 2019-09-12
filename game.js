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
    "img/lg-asteroid.png",
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
    app.ticker.add(delta => gameLoop(delta));
}

// gameLoop function which accepts the gamestate
function gameLoop(delta) {
    gameState(delta);
}

// function for when gamestate = play which enables rocket movement
function play(delta) {
    rocket.x += rocket.velx;
    rocket.y += rocket.vely;
}

function spawnAsteroid() {
    let asteroid = new Sprite(resources["img/lg-asteroid.png"].texture);
    let randScale = randomInt(50, 200) / 100;  // get int between .5 and 2
    let randX = randomInt(0, app.stage.width - asteroid.width);
    let randVelX = randomInt(-6, 6);
    let randVely = randomInt(-6, 6);
    asteroid.scale.set(randScale, randScale);
    asteroid.position.set(randX, 0);
    while(isInBounds(asteroid))
    {
        asteroid.x += randVelX;
        asteroid.y += randVelY;
    }


}

function collision(sprite1, sprite2) {
    // combined half width of the two sprites & combined half height
    let hit, halfWidths, halfHeights, velx, vely, collided = false;

    // half width and half heights for each sprite
    sprite1.halfWidth = sprite1.width / 2
    sprite1.halfHeight = sprite1.height / 2
    sprite2.halfWidth = sprite2.width / 2
    sprite2.halfHeight = sprite2.height / 2

    // center points
    sprite1.centerX = sprite1.x + sprite1.halfWidth;
    sprite1.centerY = sprite1.y + sprite1.halfHeight;
    sprite2.centerX = sprite2.x + sprite2.halfWidth;
    sprite2.centerY = sprite2.y + sprite2.halfHeight;

    // distance vector between the sprites
    distanceVectX = sprite1.centerX - sprite2.centerX;
    distanceVectY = sprite1.centerY - sprite2.centerY;

    // half widths & heights combined for collision detection
    halfWidths = sprite1.halfWidth + sprite2.halfWidth;
    halfHeights = sprite1.halfHeight + sprite2.halfHeight;

    // checking for x axis collision
    if(Math.abs(distanceVectX) < halfWidths) {
        // checking for y axis collision
        if(Math.abs(distanceVectY) < halfHeights)
        {
            collided = true;
        }
    }
    // assume no collision
    return collided;
}

function isInBounds(object) {

}


// random int generator that can't be zero, for when the velocity calls it
function randomInt(min, max) {
  let randnum = Math.floor(Math.random() * (max - min + 1)) + min;
  if(randnum === 0){
    return randomInt(min, max);
  }
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

