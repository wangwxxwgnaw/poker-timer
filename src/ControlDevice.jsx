// ControlDevice.js
import React, { useState, useEffect } from "react";
import Peer from "peerjs";

const ControlDevice = () => {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [title, setTitle] = useState(<h1 style={{color: '#FF9900'}}>设备未连接</h1>);
  const [isPaused, setIsPaused] = useState(false);

  function tryConn(normalTitle, peer, signal=null) {
    const conn = peer.connect("slave-device-id"); // 使用从设备的ID进行连接
    conn.on("open", () => {
      let heartbeatInterval;
      let heartbeatCount = 0;
      let replyHeartbeatCount = 0;
      console.log("Successfully connected to the slave device");
      setConn(conn);
      // 如果sigmal不为空，那么发送信息
      if (signal !== null) conn.send(signal);
      setTitle(<h1>{normalTitle}</h1>);
      // 设置心跳机制
      heartbeatInterval = setInterval(() => {
        if (conn.open && replyHeartbeatCount + 1 >= heartbeatCount) {
            conn.send({heartbeat: heartbeatCount}); // 定期发送 "heartbeat" 消息
            heartbeatCount += 1;
        } else {
            console.log("Connection appears closed, clearing interval.");
            setConn(null);
            setTitle(<h1 style={{color: 'red'}}>设备连接中断</h1>);
            clearInterval(heartbeatInterval);
        }
      }, 1300); // 每3秒发送一次心跳消息

      conn.on("error", () => {
        console.log("Connection failure");
        setConn(null);
        setTitle(<h1 style={{color: 'red'}}>设备连接错误</h1>);
      });

      conn.on("close", () => {
        console.log('Connection closed.');
        setConn(null);
        setTitle(<h1 style={{color: 'red'}}>设备连接关闭</h1>);
      });

      conn.on("data", (data) => {
        if ("replyHeartbeat" in data) {
          console.log(data);
          replyHeartbeatCount = data.replyHeartbeat;
        }
      });
    });
  }

  useEffect(() => {
    let peer = new Peer();
    setPeer(peer);
    peer.on("open", (id) => {
      console.log("Control id", id);
      tryConn("设备已连接", peer);
    });

    // 清理函数
    return () => {
      peer.disconnect(); // 断开连接
      peer.destroy(); // 销毁 Peer 实例
      setPeer(null);
      console.log("Control peer destroyed");
    };
  }, []);

  // 发送信号到从设备
  function sendSignal(signal) {
    if (conn !== null) {
      conn.send(signal);
    } else {
      tryConn("设备已重新连接", peer, signal);
    }
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
      {title}
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
