import React, { useEffect, useRef } from "react";

const audioDict = {};
let audioContext = null;

function loadAudioBuffer(url, name) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      audioContext.decodeAudioData(data, (buffer) => {
        audioDict[name] = buffer;
      });
    });
}

export function preloadAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  loadAudioBuffer("./timeReminder_01.wav", "tick1");
  loadAudioBuffer("./timeReminder_02.wav", "tick2");
  loadAudioBuffer("./pause.mp3", "pause");
  loadAudioBuffer("./outOfTimeOther.mp3", "outOfTime");
  loadAudioBuffer("./bell.wav", "nextRound");
}



export function playAudio(name) {
  const audioBuffer = audioDict[name];
  // 创建新的音频源并播放
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}
