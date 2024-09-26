import Peer from "peerjs";
import React, { useState, useEffect, useRef } from "react";
import { Display } from "debug-react-7-segment-display";
import { playAudio } from "./AudioManager";

let clearFunction = () => {};
let countdownTime = 10 * 1000;

const FullscreenButton = (number, isPaused) => {
  const enterFullscreen = () => {
    const element = document.documentElement; // 使用整个文档进入全屏

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      // Safari
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const [filterType, setFilterType] = useState(0);
  useEffect(() => {
    setFilterType(1 - filterType);
  },[number, isPaused]);

  return (
    <div style={{
      filter: filterType == 1 ? "drop-shadow(0px 0px 1px white)" : "drop-shadow(0px 0px 2px white)",
      trasform: "translateZ(0)",
    }}>
      <button
        onClick={enterFullscreen}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px 15px",
          cursor: "pointer",
          opacity: 0.7, // 透明度
          transition: "opacity 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)} // 鼠标悬停时变为不透明
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)} // 离开时恢复透明
      >
        进入全屏
      </button>
    </div>
  );
};

const MyTimer = React.memo(({ number, isPaused, isAdded }) => {
  const lastNumberRef = useRef(number);
  const lastIsPausedRef = useRef(isPaused);
  // 偶尔情况，需要渲染两次
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    // 播放声音逻辑
    // 播放声音逻辑
    if (number <= 5 && number !== lastNumberRef.current) {
      if (number % 2 === 0) {
        console.log("tick2");
        playAudio("tick2");
      } else {
        console.log("tick1");
        playAudio("tick1");
      }
    }
    lastIsPausedRef.current = isPaused;
    lastNumberRef.current = number;
  }, [number, isPaused]);

  let color = isPaused
    ? "#ffe000"
    : number <= 5
    ? "#ee0000"
    : isAdded
    ? "#00a7ff"
    : "#01df00";
  const lastColor = useRef(color);
  // 手动渲染第二次
  useEffect(() => {
    if (lastColor.current != color) {
      setDummy(1 - dummy);
      lastColor.current = color;
    }
  });
  console.log("Rendering");
  let gray = isPaused ? 0.1 : number <= 5 ? 0.25 : isAdded ? 0.15 : 0.15;
  number = number.toString();
  const height = window.innerHeight;
  const displayHeight = (height * 0.8).toFixed(0);
  return (
    <Display
      value={number}
      color={color}
      backgroundColor="#000000"
      gray={gray}
      height={displayHeight}
      leadingZeroes={false}
      diffRendering={dummy}
    />
  );
});

const SlaveDevice = () => {
  const [newControl, setNewControl] = useState(false);
  const [timerTime, setTimerTime] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const peer = new Peer("slave-device-id");
    peer.on("open", (id) => {
      console.log("Slave id", id);
      peer.on("connection", (conn) => {
        console.log("Found connection on slave!");
        conn.on("data", (data) => handleMessage(data));
      });
    });
    // 清理函数
    return () => {
      peer.disconnect(); // 断开连接
      peer.destroy(); // 销毁 Peer 实例
      console.log("Slave peer destroyed");
    };
  }, []);

  const handleMessage = (data) => {
    setNewControl(true);
    setMessage(data.action);
    if (data.action === "start 10s") {
      countdownTime = 10 * 1000;
    } else if (data.action === "start 20s") {
      countdownTime = 20 * 1000;
    }
  };

  useEffect(() => {
    if (newControl) {
      setNewControl(false);
      if (message === "pause") {
        clearFunction();
        if (!isPaused) {
          setIsPaused(true);
          playAudio("pause");
        }
      } else {
        clearFunction();
        setIsPaused(false);
        const startTime = performance.now();
        let endTime;
        if (message === "resume") {
          console.log("resume");
          endTime = startTime + timerTime * 1000;
          playAudio("pause");
        } else {
          endTime = startTime + countdownTime;
          // 清除超时状态
          setIsAdded(false);
          // 播放下一个人的提示音
          playAudio("nextRound");
        }
        const timer = setInterval(() => {
          const now = performance.now();
          const timeLeft = (endTime - now) / 1000;
          if (timeLeft >= 0) {
            const intSeconds = Math.ceil(timeLeft);
            setTimerTime(intSeconds);
          } else {
            // 自动加上20秒
            endTime = endTime + 20 * 1000;
            const now = performance.now();
            const timeLeft = (endTime - now) / 1000;
            const intSeconds = Math.ceil(timeLeft);
            setTimerTime(intSeconds);
            setIsAdded(true); // 正在超时中
            playAudio("outOfTime");
          }
        }, 10);
        clearFunction = () => clearInterval(timer);
      }
    }
  }, [newControl, message]);

  return (
    <div
      style={{
        backgroundColor: "black",
       height: "100vh",
       width: "100vw",
       color: "white",
       display: "flex",
       alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <FullscreenButton number={timerTime} isPaused={isPaused} />
      </div>
      <MyTimer number={timerTime} isPaused={isPaused} isAdded={isAdded} />
    </div>
  );
};

export default SlaveDevice;
