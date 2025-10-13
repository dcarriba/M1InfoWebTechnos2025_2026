// About imports and exports in JavaScript modules
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// default imports of classes from waveformdrawer.js and trimbarsdrawer.js
import WaveformDrawer from './waveformdrawer.js';
import TrimbarsDrawer from './trimbarsdrawer.js';
// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound, playSound } from './soundutils.js';
import { pixelToSeconds } from './utils.js';

let ctx = new AudioContext();

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
];

let canvas, canvasOverlay;
// waveform drawer is for drawing the waveform in the canvas
// trimbars drawer is for drawing the trim bars in the overlay canvas

let waveformDrawer, trimbarsDrawer;
let mousePos = { x: 0, y: 0 };
let currentSound = null;
let currentSoundDuration = 0;

window.onload = async function () {
  canvas = document.querySelector("#myCanvas");
  canvasOverlay = document.querySelector("#myCanvasOverlay");
  const div = document.getElementById("playButtonDiv");

  waveformDrawer = new WaveformDrawer();
  
  // Initialize trim bars at extreme positions (left = 0, right = canvas width)
  trimbarsDrawer = new TrimbarsDrawer(canvasOverlay, 0, canvas.width);

  // Load and decode all sounds
  const decodedSounds = await Promise.all(
    soundURLs.map(url => loadAndDecodeSound(url, ctx))
  );

  // Create a button per sound
  decodedSounds.forEach((buffer, index) => {
    const button = document.createElement('button');
    button.textContent = `Sound ${index + 1}`;

    button.onclick = async () => {
      if (ctx.state === "suspended") await ctx.resume();

      // Set current sound
      currentSound = buffer;
      currentSoundDuration = buffer.duration;

      // Clear canvas before drawing
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      waveformDrawer.init(buffer, canvas, '#83E83E');
      waveformDrawer.drawWave(0, canvas.height);

      // Get trim start/end and play sound
      const start = pixelToSeconds(trimbarsDrawer.leftTrimBar.x, currentSoundDuration, canvas.width);
      const end = pixelToSeconds(trimbarsDrawer.rightTrimBar.x, currentSoundDuration, canvas.width);
      playSound(ctx, currentSound, start, end);
    };

    div.appendChild(button);
  });

  // Trim bar mouse handling
  canvasOverlay.onmousemove = (evt) => {
    const rect = canvasOverlay.getBoundingClientRect();
    mousePos.x = evt.clientX - rect.left;
    mousePos.y = evt.clientY - rect.top;
    trimbarsDrawer.moveTrimBars(mousePos);
  };

  canvasOverlay.onmousedown = () => trimbarsDrawer.startDrag();
  canvasOverlay.onmouseup = () => trimbarsDrawer.stopDrag();

  requestAnimationFrame(animate);
};

// Animation loop for drawing the trim bars
// We use requestAnimationFrame() to call the animate function
// at a rate of 60 frames per second (if possible)
// see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
function animate() {
    // clear overlay canvas;
    trimbarsDrawer.clear();

    // draw the trim bars
    trimbarsDrawer.draw();

    // redraw in 1/60th of a second
    requestAnimationFrame(animate);
}



