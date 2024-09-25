import React, { useEffect, useRef } from "react";


const audioDict = {};


export function preloadAudio() {
  audioDict["tick1"] = new Audio("https://cdn.glitch.global/3f262591-c5d8-46e4-81c0-7e0310fcd01c/timeReminder_01.wav?v=1727189723572");
  audioDict["tick2"] = new Audio("https://cdn.glitch.global/3f262591-c5d8-46e4-81c0-7e0310fcd01c/timeReminder_02.wav?v=1727189724840");
  audioDict["pause"] = new Audio("https://cdn.glitch.global/3f262591-c5d8-46e4-81c0-7e0310fcd01c/nextOther.mp3?v=1727188107582");
  audioDict["outOfTime"] = new Audio("https://cdn.glitch.global/3f262591-c5d8-46e4-81c0-7e0310fcd01c/outOfTimeOther.mp3?v=1727188102954");
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
