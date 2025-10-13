// About imports and exports in JavaScript modules
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound, playSound } from './soundutils.js';

// The AudioContext object is the main "entry point" into the Web Audio API
let ctx;

/*
const soundURL =
    'https://mainline.i3s.unice.fr/mooc/shoot2.mp3';
let decodedSound;
*/

const soundURLs = [
   'https://upload.wikimedia.org/wikipedia/commons/a/a3/Hardstyle_kick.wav',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c7/Redoblante_de_marcha.ogg/Redoblante_de_marcha.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c9/Hi-Hat_Cerrado.ogg/Hi-Hat_Cerrado.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/07/Hi-Hat_Abierto.ogg/Hi-Hat_Abierto.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3c/Tom_Agudo.ogg/Tom_Agudo.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a4/Tom_Medio.ogg/Tom_Medio.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8d/Tom_Grave.ogg/Tom_Grave.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Crash.ogg/Crash.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Ride.ogg/Ride.ogg.mp3'
]

/*
// The button for playing the sound
let playButton = document.querySelector("#playButton");
// disable the button until the sound is loaded and decoded
playButton.disabled = true;
*/

window.onload = async function init() {
    ctx = new AudioContext();

    const div = document.getElementById('playButtonDiv');

    // Start all loads at once
    const decodedSounds = await Promise.all(
        soundURLs.map(url => loadAndDecodeSound(url))
    );

    // Create buttons after all sounds are loaded
    decodedSounds.forEach((sound, i) => {
        const button = document.createElement('button');
        button.textContent = 'Play sound';

        button.onclick = function () {
            playSound(ctx, sound, 0, sound.duration);
        };

        div.appendChild(button);
    });
};
/*
window.onload = async function init() {
    ctx = new AudioContext();


    // load and decode the sound
    // this is asynchronous, we use await to wait for the end of the loading and decoding
    // before going to the next instruction
    // Note that we cannot use await outside an async function
    // so we had to declare the init function as async
    decodedSound = await loadAndDecodeSound(soundURL, ctx);
 
    // we enable the play sound button, now that the sound is loaded and decoded
    playButton.disabled = false;

    // Event listener for the button. When the button is pressed, we play the sound
    playButton.onclick = function (evt) {
         // from utils.js
        playSound(ctx, decodedSound, 0, decodedSound.duration);
    }
}
*/