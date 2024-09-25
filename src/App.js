import React, { useState } from "react";
import ControlDevice from "./ControlDevice"; // 控制设备的组件
import SlaveDevice from "./SlaveDevice"; // 从设备的组件
import {preloadAudio, playAudio} from "./AudioManager";

const App = () => {
  const [deviceRole, setDeviceRole] = useState(null); // 初始状态为空

  const loadControlDevice = () => {
    preloadAudio();
    playAudio("pause");
    setDeviceRole("control"); // 点击按钮加载控制设备
  };

  const loadSlaveDevice = () => {
    preloadAudio();
    playAudio("pause");
    setDeviceRole("slave"); // 点击按钮加载从设备
  };

  return (
    <div>
      {!deviceRole && ( // 如果未选择设备，显示选择按钮
        <div className="button-container">
          <button className="green-button" onClick={loadControlDevice}>
            加载主设备代码
          </button>
          <button className="green-button" onClick={loadSlaveDevice}>
            加载从设备代码
          </button>
        </div>
      )}
      {deviceRole === "control" && <ControlDevice />}{" "}
      {/* 如果选择了主设备，加载控制设备代码 */}
      {deviceRole === "slave" && <SlaveDevice />}{" "}
      {/* 如果选择了从设备，加载从设备代码 */}
    </div>
  );
};

export default App;
