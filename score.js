var highscore = localStorage.getItem("highscore");

if(!highscore){
    highscore = [];
} else {
    highscore = JSON.parse(highscore);
}

console.log(highscore)

const scoreDiv = document.getElementById("highscores")
var num = 1;
highscore.forEach(score => {
    scoreDiv.innerHTML += `<div class="row scorelist__row"> <div class=col-4> ${num} </div>  <div class="col-4"> <div class="scorelist__middle">${score[0]}  </div> </div> <div class="col-4 scorelist__right"> ${score[1]} </div> </div>`;
    num ++;
});
