import {spawnCollectable} from "./collectable.js"

const startButton = document.getElementById("start-button")
const gameWindow = document.getElementById("game-window")
const player = document.getElementById("player")
const scoreElem = document.getElementById("score")

// player
const SPEED = 5
const PLAYER_SIZE = 100
let SPEED_MULT_X = 1
let SPEED_MULT_Y = 1
let score = 0

const DIRECTION = {
    UP: "UP",
    RIGHT: "RIGHT",
    DOWN: "DOWN",
    LEFT: "LEFT"
}

const KEYBOARD = {
    UP: "KeyW",
    RIGHT: "KeyD",
    DOWN: "KeyS",
    LEFT: "KeyA"
}

const SIZE = () => {
    switch (direction) {
        case DIRECTION.LEFT:
        case DIRECTION.RIGHT: {
            return window.innerWidth
        }
        case DIRECTION.UP:
        case DIRECTION.DOWN: {
            return window.innerHeight
        }

        default: {
            console.log("underfined direction case", direction)
        }
    }
}

let direction;
let xPosition;
let yPosition;

const setXPosition = (value) => {
    player.style.left = `${value}px`
    xPosition = value
}

const setYPosition = (value) => {
    player.style.top = `${value}px`
    yPosition = value
}

const renderPlayer = () => {
    direction = DIRECTION.RIGHT
    movePlayer()
}

let lastFrameTimeSec = 0
const deltaFrameTimeSec = 144

const moveVertical = () => {
    const topRaw = player.style.top.substr(0, player.style.top.length-2)
    player.style.top = `${Number(topRaw) + SPEED * SPEED_MULT_Y}px`
}

const moveHorizontal = () => {
    const leftRaw = player.style.left.substr(0, player.style.left.length-2)
    player.style.left = `${Number(leftRaw) + SPEED * SPEED_MULT_X}px`
}

const movePlayerAnimation = (t) => {
    const currFrameTimeSec = t * 1000
    if (currFrameTimeSec - lastFrameTimeSec >= deltaFrameTimeSec) {

        console.log('direction', direction, 'x', xPosition, 'y', yPosition)

        switch(direction) {
            case DIRECTION.LEFT: {
                moveHorizontal()
                if(player.offsetLeft <= -PLAYER_SIZE) {
                    setXPosition(SIZE())
                }
                break
            }

            case DIRECTION.RIGHT: {
                moveHorizontal()
                if(player.offsetLeft >= SIZE()) {
                    setXPosition(0)
                }
                break
            }
            case DIRECTION.UP:{
                moveVertical()
                if(player.offsetTop <= -PLAYER_SIZE) {
                    setYPosition(SIZE())
                }

                break
            }   

            case DIRECTION.DOWN: {
                moveVertical()
              if(player.offsetLeft === 0) {
                  setYPosition(0)
              }
                break
            }
        }
        ///track collision
        const playerRect = player.getBoundingClientRect()
        console.log('rect', playerRect)

        const l1 = {x: playerRect.top, y: playerRect.right}
        const r1 = {x: playerRect.bottom, y: playerRect.left}

        const collectable = document.getElementById('collectable')
        if(collectable) {
            const collectableRect = collectable.getBoundingClientRect()

            const l2 = {x: collectableRect.top, y: collectableRect.right}
            const r2 = {x: collectableRect.bottom, y: collectableRect.left}
    
            console.log(l1, r1)
            console.log(l2, r2)
    
            const collides = isCollide(l1, r1, l2, r2)
            if(collides) {
                console.log('collides', collides)
                const bonusElem = document.getElementById("collectable")
                bonusElem.remove()
                score++
                scoreElem.innerText = score

                // create new bonus element
                spawnCollectable()
            }
        }
        
    }
    window.requestAnimationFrame(movePlayerAnimation);
}

// https://www.geeksforgeeks.org/find-two-rectangles-overlap/
const isCollide = (l1, r1, l2, r2) => { 
    // To check if either rectangle is actually a line
            // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}
    
            if (l1.x == r1.x || l1.y == r1.y || 
                l2.x == r2.x || l2.y == r2.y) {
                    // the line cannot have positive overlap
                    return false;
                }
        
                // If one rectangle is on left side of other
                if (l1.x >= r2.x || l2.x >= r1.x) {
                    return false;
                }
        
                // If one rectangle is above other
                if (r1.y >= l2.y || r2.y >= l1.y) {
                    return false;
                }
        
                return true;
        
    }

const collisionResult1 = isCollide({x: -1, y:0}, {x: 1, y:1}, {x:0, y: -1}, {x: 0, y: 1})
console.log(collisionResult1)

const collisionResult2 = isCollide({x: -10, y:10}, {x: -5, y:5}, {x: -8, y: 8}, {x: -4, y: 4})
console.log(collisionResult2)

const collisionResult3 = isCollide({x: -10, y:10}, {x: -5, y:5}, {x: -4.9, y: 8}, {x: -0.9, y: 4})
console.log(collisionResult3)

const collisionResult4 = isCollide({x: 110, y:180}, {x: 120, y: 170}, {x: 110, y: 210}, {x: 120, y: 200})
console.log(collisionResult4)

const collisionResult5 = isCollide({x: 110, y:180}, {x: 120, y: 170}, {x: 100, y: 210}, {x: 110, y: 200})
console.log(collisionResult5)

const movePlayer = () => {
    setXPosition(0)
    setYPosition(0)
    window.requestAnimationFrame(movePlayerAnimation);
}

// game
const startGame = () => {
    closeStartGameWindow()
    renderPlayer()
}

// game window
const closeStartGameWindow = () => {
    gameWindow.style.display = "none"
}

// event listeners
startButton.addEventListener('click', () => {
    startGame()
})

window.addEventListener( 'keydown', (e) => {
    switch(e.code) {
        case KEYBOARD.UP: {
            direction = DIRECTION.UP
            SPEED_MULT_Y = -1
            break
        }

        case KEYBOARD.DOWN: {
            SPEED_MULT_Y = 1
            direction = DIRECTION.DOWN
  
            break
        }

        case KEYBOARD.LEFT: {
            SPEED_MULT_X = -1
            direction = DIRECTION.LEFT
            break
        }
        case KEYBOARD.RIGHT: {
            SPEED_MULT_X = 1
            direction = DIRECTION.RIGHT
            break
        }
        
        default: {
            console.log('underfined keyboard event')
        }

    }
})
