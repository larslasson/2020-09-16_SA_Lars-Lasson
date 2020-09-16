var username = localStorage.getItem('username');
var theme = localStorage.getItem('theme');
var difficulty = localStorage.getItem('difficulty');
var highscore = localStorage.getItem("highscore");

if(!username || !theme || !difficulty){
    window.location.replace("./index.html");
}

if(!highscore){
    highscore = [];
} else {
    highscore = JSON.parse(highscore);
}

document.getElementById("username").innerHTML = username;

// Constants

const frameRate = 30;

// Initialize variables: These will update dynamically during the game
var playerScore = 0;
var playerHP = 3;

var playerSpeed = 0;
var ballSpeed = 0;

//How fast can the enemy move related to the player
var enemySpeedFactor = 0;

if(difficulty=="easy"){
    ballSpeed = 8;
    enemySpeedFactor = 0.4
} else {
    ballSpeed = 12;
    enemySpeedFactor = 0.6
}

var ballDirX = -1;
var ballDirY = 1;

var gameStarted = false;
var gameEnded = false;

var foregroundColor = "";
var backgroundColor = "";

if(theme=="football"){
    foregroundColor = "white";
    backgroundColor = "green";
} else {
    foregroundColor = "white";
    backgroundColor = "#000";
}

var gameWidth = 0;
var gameHeight = 0;
var playerY = 0;
var computerY = 0;
var ballX = 0;
var ballY = 0;
var paddleWidth = 0;
var paddleHeight = 0;
var ballRadius = 0;
var paddleSpeed = 0;
var margin = 0;
var hitmargin = 0;

var textSize = 0;

var gameCanvas = document.getElementById("gameCanvas");

var context = gameCanvas.getContext("2d");


// Bind keys
document.body.addEventListener('keydown', function (event) {
    event.preventDefault();
    const key = event.key;
    switch (key) {
        case "ArrowUp":
            playerSpeed = -paddleSpeed
            break;
        case "ArrowDown":
            playerSpeed = +paddleSpeed
            break;
        case " ":
            startGame();
            break;
        case "r":
            if(gameEnded){
                location.reload();
            }
            break;
        case "h":
            if(gameEnded){
                window.location.replace("./highscore.html");
            }
            break;
    }
});
document.body.addEventListener('keyup', function (event) {
    event.preventDefault();
    playerSpeed = 0;
});

// Draw initial position
resizeCanvas();


function startGame(){
    if(!gameStarted){
        gameStarted = true;

        // Start game loop
        const interval = setInterval(function () {
            gameLoop();
        }, (1 / frameRate) * 1000);
    }
}



function gameLoop() {
    if(!gameEnded){
        movePlayer();
        moveComputer();
        moveBall();

        if(playerHP==0){
            endGame();
        }
    }
    drawGame();
}

function endGame(){
    gameEnded = true;
    highscore.push([username, playerScore]);

    //Sort table
    highscore = highscore.sort(function(a,b){return b[1] - a[1] ;});

    console.log(highscore);
    localStorage.setItem("highscore", JSON.stringify(highscore));
}

function moveBall() {

    hitmargin = 5;

    ballX += ballSpeed * ballDirX;
    ballY += ballSpeed * ballDirY;



    if (ballY > gameHeight - ballRadius) {
        ballDirY = -1;
    } else if (ballY < ballRadius) {
        ballDirY = 1;
    }

    if (ballX > gameWidth - margin - paddleWidth - ballRadius
        && ballY > computerY - hitmargin && ballY < computerY + paddleHeight + hitmargin) {
        ballDirX = -1;
    } else if (ballX < margin + paddleWidth + ballRadius
        && ballY > playerY - hitmargin && ballY < playerY + paddleHeight + hitmargin) {
        ballDirX = 1;
    }

    if (ballX > gameWidth - margin) {
        playerScore += 1;
        ballX = gameWidth / 2;
        ballY = gameHeight / 2;
    } else if (ballX < margin) {
        playerHP -= 1;
        ballX = gameWidth / 2;
        ballY = gameHeight / 2;
    }

}

function moveComputer() {
    if (ballY > computerY) {
        computerY += paddleSpeed * enemySpeedFactor;
    } else {
        computerY -= paddleSpeed * enemySpeedFactor;
    }

}

function movePlayer() {
    if ((playerSpeed > 0 && playerY >= gameHeight - paddleHeight) || (playerSpeed < 0 && playerY <= 0)) {
        return;
    }
    playerY += playerSpeed;

}

// Draws all elements in the game
function drawGame() {
    // Clear all elements
    context.clearRect(0, 0, gameWidth, gameHeight);

    // Draw player
    drawPaddle(margin, playerY);

    // Draw computer
    drawPaddle(gameWidth - paddleWidth - margin, computerY);

    // Draw middle line
    drawMiddleLine()

    //Draw player score
    drawScore();

    //Draw computer score
    drawHP();

    //Draw the ball
    drawBall(ballX, ballY)

    if(!gameStarted){
        drawText("Press 'Space' to play..");
    }

    if(gameEnded){
        drawText("You lost! Press 'r' to restart, or 'h' for highscore");
    }


    if (theme=="football") {
        drawFotballTheme();
    }
    else{
        drawSpace();
        
    }

}

function drawText(text){
    context.beginPath();
    context.textAlign = "center";
    context.font = textSize + "px Arial";
    context.fillText(text, gameWidth/2, (gameHeight*0.3));
    context.closePath();
}

function drawPaddle(x, y) {
    context.beginPath();
    context.rect(x, y, paddleWidth, paddleHeight);
    context.fillStyle = foregroundColor
    context.fill();
    context.closePath();

}

function drawMiddleLine() {
    context.beginPath();
    context.lineWidth = "3";
    context.strokeStyle = foregroundColor;
    context.moveTo((gameWidth / 2), 0);
    context.lineTo((gameWidth / 2), gameHeight);
    context.stroke();
    context.closePath();

}

function drawScore() {
    context.beginPath();
    context.textAlign = "left";
    context.font = textSize + "px Arial";
    context.fillText("Score: "+ playerScore, (gameWidth/2) + gameWidth*0.05, (gameHeight*0.1));
    context.closePath();
}

function drawHP() {
    context.beginPath();
    context.textAlign = "right";
    context.font = textSize + "px Arial";
    context.fillText("Health: "+ playerHP, (gameWidth/2) - gameWidth*0.05, (gameHeight*0.1));
    context.closePath();
}

function drawBall(x, y) {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, 2 * Math.PI);
    context.fillStyle = foregroundColor;
    context.fill();
    context.closePath();

}

function drawFotballTheme() {


    //TODO: Lag variabler for regnestykkene

    //Mid circle
    context.beginPath()
    context.arc(gameWidth / 2, gameHeight / 2, gameHeight*0.15, 0, 2 * (Math.PI), false);

    context.stroke();
    context.closePath();

    //Mid point
    context.beginPath()
    context.arc(gameWidth / 2, gameHeight / 2, gameWidth*0.005, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();

    //Home penalty box
    context.beginPath();
    context.rect(0, (gameHeight - gameHeight*0.5) / 2, gameWidth*0.1, gameHeight*0.5);
    context.stroke();
    context.closePath();

    //Home goal box
    context.beginPath();
    context.rect(0, (gameHeight - gameHeight*0.2) / 2, gameWidth*0.05, gameHeight*0.2);
    context.stroke();
    context.closePath();


    //Away penalty box
    context.beginPath();
    context.rect(gameWidth - gameWidth*0.1, (gameHeight -  gameHeight*0.5) / 2, gameWidth*0.1,  gameHeight*0.5);
    context.stroke();
    context.closePath();
    //Away goal box
    context.beginPath();
    context.rect(gameWidth - gameWidth*0.05, (gameHeight - gameHeight*0.2) / 2, gameWidth*0.05, gameHeight*0.2);
    context.stroke();
    context.closePath();


}

function drawSpace(){
      

    context.beginPath();
    context.arc(350, 100, 3, 0, Math.PI * 2);
    context.closePath();
    context.arc(100, 350, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(50, 75, 2, 0, Math.PI * 2);
    context.closePath();
    context.arc(200, 35, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(200, 180, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(200, 310, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(200, 500, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(300, 450, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(850, 475, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(-200, 45, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(800, 85, 2, 0, Math.PI * 2);
    context.closePath();
    context.arc(600, 300, 3, 0, Math.PI * 2);
    context.closePath();
    context.arc(700, 420, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(900, 175, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(450, 355, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(650, 255, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(810, 275, 4, 0, Math.PI * 2);
    context.closePath();
    context.arc(760, 505, 3, 0, Math.PI * 2);
    context.closePath();
    context.arc(610, 515, 3, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}
    
    
    


function resizeCanvas(){
    gameWidth = Math.min(1000, window.innerWidth-50)
    gameHeight = Math.min(gameWidth*0.6,window.innerHeight-60);

    if(gameWidth < 600){
        textSize = 5;
    } else {
        textSize = 30;
    }

    gameCanvas.height = gameHeight;
    gameCanvas.width = gameWidth;
    gameCanvas.style.backgroundColor = backgroundColor;


    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    
    paddleWidth = gameWidth*0.012;
    paddleHeight = gameHeight*0.12;
    ballRadius = gameWidth*0.01;

    paddleSpeed = gameWidth*0.02;
    margin = gameWidth*0.02;
    hitmargin = gameWidth*0.05;

    playerY = (gameHeight / 2) - (paddleHeight / 2);
    computerY = (gameHeight / 2) - (paddleHeight / 2);
    

    drawGame();
}

function logout(){
    
    localStorage.removeItem('username');
    localStorage.removeItem('theme');
    localStorage.removeItem('difficulty');

    window.location.href = "./index.html";
}