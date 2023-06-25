let ENOUAY = new Audio();
ENOUAY.src = 'assets/audio/ENOUAY.wav';

let hmmm = new Audio();
hmmm.src = 'assets/audio/hmm.wav';

document.addEventListener("DOMContentLoaded", function() {
  // SELECT SOUND ELEMENT
  const soundElement = document.getElementById("sound");

  soundElement.addEventListener("click", toggleSoundImage);

  function toggleSoundImage() {
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_ON_IMG = "./assets/img/SOUND_ON.png";
    let SOUND_OFF_IMG = "./assets/img/SOUND_OFF.png";

    if (imgSrc === SOUND_ON_IMG ) {
      soundElement.setAttribute("src", SOUND_OFF_IMG);
      disableSound();
    } else {
      soundElement.setAttribute("src", SOUND_ON_IMG);
      enableSound();
    }}
    

  function enableSound() {
    ENOUAY.muted = false;
    hmmm.muted = false;
  }

  function disableSound() {
    ENOUAY.muted = true;
    hmmm.muted = true;
  }
});
