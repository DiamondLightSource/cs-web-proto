import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import {
  ConnectedReadback,
  ConnectedCopyReadback
} from "./components/Readback/readback";
import { ConnectedInput } from "./components/Input/input";
import { ConnectedProgressBar } from "./components/ProgressBar/ProgressBar";
import { ConnectedSlideControl } from "./components/SlideControl/SlideControl";
import { ConnectedCopyWrapper } from "./components/CopyWrapper/CopyWrapper";
import { AlarmBorder } from "./components/AlarmBorder/AlarmBorder";
import { getStore, initialiseStore } from "./redux/store";
import { SimulatorPlugin } from "./connection/sim";

const App: React.FC = (): JSX.Element => {
  const plugin = new SimulatorPlugin();
  initialiseStore(plugin);
  let store = getStore();
  return (
    <Provider store={store}>
      <div className="App">
        <div id="Central Column" style={{ width: "80%", margin: "auto" }}>
          <h1>CS Web Proto</h1>
          <div style={{ display: "block" }}>
            <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
            <ConnectedReadback pvName={"loc://pv1"} />
            <ConnectedReadback pvName={"loc://pv2"} />
            <ConnectedReadback pvName={"sim://sine"} precision={3} />
            <ConnectedReadback pvName={"sim://disconnector"} precision={3} />
          </div>
          <div style={{ display: "block" }}>
            <ConnectedInput pvName={"loc://pv1"} />
            <ConnectedInput pvName={"loc://pv2"} />
            <ConnectedInput pvName={"sim://sine"} />
            <ConnectedInput pvName={"sim://sine"} />
          </div>
          <div>
            <h3>PV with Metadata</h3>
            <div
              style={{
                position: "relative",
                display: "block",
                height: "30px",
                margin: "15px"
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  position: "absolute",
                  top: "0%",
                  right: "50%",
                  height: "100%",
                  width: "50%",
                  margin: "auto"
                }}
              >
                <ConnectedInput pvName={"meta://metapv1"} />
              </div>
              <div
                style={{
                  display: "inline-block",
                  position: "absolute",
                  top: "0%",
                  left: "50%",
                  height: "100%",
                  width: "50%",
                  margin: "auto"
                }}
              >
                <ConnectedReadback pvName={"meta://metapv1"} />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              height: "200px",
              margin: "15px auto"
            }}
          >
            <ConnectedProgressBar pvName={"meta://metapv1"} min={0} max={100} />
          </div>
          <div
            style={{
              position: "relative",
              height: "200px",
              margin: "15px auto"
            }}
          >
            <ConnectedSlideControl
              pvName={"meta://metapv1"}
              min={0}
              max={100}
            />
          </div>
          <div
            style={{
              position: "relative",
              height: "200px",
              margin: "15px auto"
            }}
          >
            <AlarmBorder alarm={{ severity: 2, status: 0, message: "" }}>
              <ConnectedProgressBar
                pvName={"sim://sine"}
                min={-1}
                max={1}
                precision={2}
              />
            </AlarmBorder>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
