import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { ConnectedReadback } from "./components/Readback/readback";
import { ConnectedInput } from "./components/Input/input";
import { ConnectedProgressBar } from "./components/ProgressBar/ProgressBar";
import { ConnectedSlideControl } from "./components/SlideControl/SlideControl";
import { CopyWrapper } from "./components/CopyWrapper/CopyWrapper";
import { getStore, initialiseStore } from "./redux/store";
import { SimulatorPlugin } from "./connection/sim";

const App: React.FC = (): JSX.Element => {
  const plugin = new SimulatorPlugin();
  initialiseStore(plugin);
  let store = getStore();
  return (
    <Provider store={store}>
      <div className="App">
        <h1>CS Web Proto</h1>
        <div style={{ display: "block" }}>
          <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
          <ConnectedReadback pvName={"loc://pv1"} />
          <ConnectedReadback pvName={"sim://sine"} precision={3} />
          <ConnectedReadback pvName={"sim://disconnector"} precision={3} />
        </div>
        <div style={{ display: "block" }}>
          <ConnectedInput pvName={"loc://pv1"} />
          <ConnectedInput pvName={"sim://sine"} />
          <ConnectedInput pvName={"sim://sine"} />
        </div>
        <div>
          <CopyWrapper
            pvName="PV-TS-TIM-01"
            value={9.0}
            timestamp={{ secondsPastEpoch: 0, nanoseconds: 0, userTag: 0 }}
          >
            Copy Wrapper Example
          </CopyWrapper>
        </div>
        <div
          style={{
            position: "absolute",
            top: "500px",
            left: "10%",
            height: "20%",
            width: "50%"
          }}
        >
          <ConnectedSlideControl
            pvName="loc://pv1"
            value={"50"}
            min={0}
            max={100}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "10%",
            height: "20%",
            width: "50%"
          }}
        >
          <ConnectedProgressBar
            pvName={"sim://sine"}
            min={-1}
            max={1}
            precision={2}
          />
        </div>
      </div>
    </Provider>
  );
};

export default App;
