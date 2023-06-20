let ENOUAY = new Audio();
ENOUAY.src = 'assets/music/ENOUAY.wav';

let hmmm = new Audio();
hmmm.src = 'assets/music/hmm.wav';


// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "assets/img/SOUND_ON.png" ? "assets/img/SOUND_OFF.png" : "assets/img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
  // MUTE AND UNMUTE SOUNDS
  ENOUAY.muted = ENOUAY.muted ? false : true;
  }
