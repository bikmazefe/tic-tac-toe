const modal = document.querySelector('.modal-wrapper');

const openModal = () => {
    modal.style.display = "flex"
}

const closeModal = () => {
    modal.style.display = "none"
}

openModal();


const p2pButton = document.getElementById('p2p-button');
const aiButton = document.getElementById('ai-button');

p2pButton.onclick = () => {
    game.startGame('pvp');
    closeModal();
    playMusic();
}

aiButton.onclick = () => {
    game.startGame('ai');
    closeModal();
    playMusic();
}


const playAgain = document.getElementById('play-again');
playAgain.onclick = () => {     
    game.restartGame();
    openModal();
}

const volumeBar  = document.getElementById('volume')
volumeBar.onchange = () => {
    music.volume = volumeBar.value;
}

const music = document.querySelector('audio');
const playMusic = () => {
    music.play();
    music.volume = volumeBar.value;
}




const stopMusic = document.getElementById('stop-music')
stopMusic.onclick = () => music.pause();

