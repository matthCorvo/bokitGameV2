
//seletion des bokits
let moles=document.querySelectorAll(".bokits");
let Scorecontainer=document.querySelector(".score");
let timercontainer=document.querySelector(".timer");
let counter=timercontainer.textContent;
let no_bokit=document.querySelector(".no_bokit");


let molesArr=Array.prototype.slice.call(moles);
let random;

let hitPosition;

let score=0;
let count=0;


function renderGame(){
 molesArr.forEach(curr =>{
curr.classList.remove("bokits-active");
 });
 random=Math.floor(Math.random()*molesArr.length);
 molesArr[random].classList.add("bokits-active");
 hitPosition=molesArr[random].id;
count++;
no_bokit.textContent=count;
}

function renderScore(){
 molesArr.forEach(curr =>{
curr.addEventListener("click",function(){
if(hitPosition==curr.id){
score++;
Scorecontainer.textContent=score;
}
})
})

}
renderScore();

let interval;
function renderTimer(){

 if(counter>0){
counter--;
timercontainer.textContent=counter;
}
else{
clearInterval(interval);
moleArr[random].classList.remove("bokits-active")

}

}
function update(){
 renderGame();
 renderTimer();
}
document.querySelector(".play").addEventListener("click",function(){
 if(!interval){
   interval=setInterval(update,950);
 }
});

document.querySelector(".reset").addEventListener("click",function(){
 location.reload();
 
});


function setDifficulty(){
    let diff = document.getElementById("difficulty").value;
    switch(diff) {
        case "easy":
            interval=setInterval(update,1250);
        break;
        case "medium":
            interval=setInterval(update,950);
        break;
        case "hard":
            interval=setInterval(update,750);
        break;
        case "insane":
            interval=setInterval(update,550);
        break;
    }
}