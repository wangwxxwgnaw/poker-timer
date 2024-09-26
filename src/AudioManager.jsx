import React, { useEffect, useRef } from "react";


const audioDict = {};


function loadAudioBuffer(url, name) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      context.decodeAudioData(data, (buffer) => {
        audioDict[name] = buffer;
      });
    });
}


export function preloadAudio() {
  audioDict["tick1"] = loadAudioBuffer("./timeReminder_01.wav");
  audioDict["tick2"] = loadAudioBuffer("./timeReminder_02.wav");
  audioDict["pause"] = loadAudioBuffer("./pause.mp3");
  audioDict["outOfTime"] = loadAudioBuffer("./outOfTimeOther.mp3");
  audioDict["nextRound"] = loadAudioBuffer("./bell.wav");
  Object.values(audioDict).forEach((audio) => {
    audio.load();  // 确保音频文件被预加载
  });
}


export function playAudio(soundKey) {
  // 创建一个音频文件字典
  const audio = audioDict[soundKey];
    if (audio) {
      audio.currentTime = 0;  // 每次从头开始播放
      audio.play();
    }
}
