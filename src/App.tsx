import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ConnectedReadback } from "./components/Readback/readback";
import { ConnectedInput } from "./components/Input/input";
import { ConnectedProgressBar } from "./components/ProgressBar/ProgressBar";
const App: React.FC = (): JSX.Element => {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>CS Web Proto</h1>
        <div style={{ display: "block" }}>
          <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
          <ConnectedReadback pvName={"TMC43-TS-IOC-01:CURRENT"} />
          <ConnectedReadback pvName={"sim://sine"} />
        </div>
        <div style={{ display: "block" }}>
          <ConnectedInput pvName={"loc://pv1"} />
          <ConnectedInput pvName={"sim://sine"} />
          <ConnectedInput pvName={"sim://sine"} />
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
            pvName={"TMC43-TS-IOC-01:AI"}
            min={0}
            max={100}
            precision={2}
          />
        </div>
      </div>
    </Provider>
  );
};

export default App;
