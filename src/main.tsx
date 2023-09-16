import React, { useState } from "react";
import * as ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";

import { App } from "./App";
import "./styles.css";

import { getClientConfig } from "./client.config";
import { Sanguosha } from "./core/game/engine";
import { createLogger } from "./core/shares/libs/logger/create";
import { Flavor } from "./core/shares/types/host_config";
import { Languages } from "./core/translations/translation_json_tool";
import { ClientTranslationModule } from "./core/translations/translation_module.client";
import { ElectronData } from "./electron_loader/electron_data";
import { ElectronLoader } from "./electron_loader/electron_loader";
import { getElectronLoader } from "./electron_loader/electron_loader_util";
import { English, SimplifiedChinese, TraditionalChinese } from "./languages";
import { ClientFlavor } from "./props/config_props";
import "./index.css";
import { Command } from "@tauri-apps/api/shell";
import io from "socket.io-client";

const Server = () => {
  const [start, setStart] = useState(false);
  const [useServer, setUseServer] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:2020/");

  async function startServer(url) {
    setUseServer(false);
    if (!start) {
      const command = new Command("node", ["../src/server/main.js"]);
      command.stdout.on("data", (data) => {
        console.log(`stdout:${data}`);
      });
      command.stderr.on("data", (data) => {
        console.log(`stderr:${data}`);
      });
      command.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });
      await command.spawn();
    }
    const socket = io("http://localhost:2020/");
    socket.on("connect", () => {
      setStart(true);
      console.log(socket);
    });
    socket.on("hello", (arg) => {
      console.log("hello", arg.name);
    });
    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }
  return (
    <div>
      <form style={{ width: "500px", margin: " auto" }} action="">
        <h3>请选择：</h3>

        <br />
        <br />
        <div className="form-group">
          <input type="checkbox" name="" id="service" />
          <label htmlFor="service" onClick={() => setUseServer(!useServer)}>
            启动服务器
          </label>
        </div>
        {useServer && (
          <div className="form-group">
            <label htmlFor="">请输入服务器地址： </label>
            <input
              type="text"
              value={serverUrl}
              onChange={(value) => setServerUrl(value)}
            />
            <button
              style={{ marginLeft: "20px" }}
              type="button"
              onClick={() => startServer(serverUrl)}
            >
              确定
            </button>
          </div>
        )}
        {start && (
          <h2 style={{ color: "green" }}>已连接服务器，可以开始游戏了！</h2>
        )}
        <br />
        <br />
        <button onClick={() => onDeviceReady()}>进入大厅</button>
      </form>
    </div>
  );
};

const mode = ClientFlavor.Dev;

const config = getClientConfig(mode);
const logger = createLogger(
  mode === ClientFlavor.Dev ? Flavor.Dev : Flavor.Prod
);

let translator: ClientTranslationModule;
let electronLoader: ElectronLoader;

if (config.flavor !== ClientFlavor.Web) {
  import("./index.module.css");
}
async function onDeviceReady() {
  const loader = await getElectronLoader(config.flavor);
  electronLoader = loader;
  translator = ClientTranslationModule.setup(
    electronLoader.getData(ElectronData.Language),
    [Languages.EN_US, English],
    [Languages.ZH_CN, SimplifiedChinese],
    [Languages.ZH_HK, TraditionalChinese],
    [Languages.ZH_TW, TraditionalChinese]
  );

  Sanguosha.initialize();

  ReactDOM.render(
    <MemoryRouter>
      <App
        config={config}
        electronLoader={electronLoader}
        translator={translator}
        logger={logger}
      />
    </MemoryRouter>,
    document.getElementById("root")
  );
}

ReactDOM.render(
  <MemoryRouter>
    <Server />
  </MemoryRouter>,
  document.getElementById("root")
);
// if (mode === ClientFlavor.Mobile) {
//   document.addEventListener("deviceready", onDeviceReady, false);
// } else {
//   onDeviceReady();
// }
