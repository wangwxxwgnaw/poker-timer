// ControlDevice.js
import React, { useState, useEffect } from "react";
import Peer from "peerjs";

const ControlDevice = () => {
  const [newSending, setNewSending] = useState(false);
  const [signal, setSignal] = useState("start 10s");
  const [conn, setConn] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("Control id", id);
      const conn = peer.connect("slave-device-id"); // 使用从设备的ID进行连接
      conn.on("open", () => {
        console.log("Successfully connected to the slave device");
        setConn(conn);
      });
    });
    
    // 清理函数
    return () => {
      peer.disconnect(); // 断开连接
      peer.destroy(); // 销毁 Peer 实例
      console.log("Control peer destroyed");
    };
  }, []);

  // 发送信号到从设备
  function sendSignal(signal) {
    if (conn !== null) conn.send(signal);
  }

  // 当点击按钮时发送信号
  const handleStartStop = (action) => {
    console.log("Sending Start...");
    console.log(action);
    const signal = { action: action };
    if (action === "pause") {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
    sendSignal(signal);
  };

  return (
    <div>
      {conn ? <h1>设备已连接</h1> : <h1>设备未连接</h1>}
      <div className="button-container">
        <button
          className="green-button"
          onClick={() => handleStartStop("start 10s")}
        >
          开始10秒
        </button>
        <button
          className="green-button"
          onClick={() => handleStartStop("start 20s")}
        >
          开始20秒
        </button>
        <button
          className="red-button"
          onClick={() => handleStartStop("pause")}
          disabled={isPaused}
        >
          暂停
        </button>
        <button
          className="green-button"
          onClick={() => handleStartStop("resume")}
          disabled={!isPaused}
        >
          继续
        </button>
      </div>
    </div>
  );
};

export default ControlDevice;
