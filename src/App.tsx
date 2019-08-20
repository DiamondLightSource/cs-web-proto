import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ConnectedReadback } from "./components/readback";
import { ConnectedInput } from "./components/input";
import { ConnectedProgressBar } from "./components/ProgressBar/ProgressBar";

const App: React.FC = (): JSX.Element => {
  return (
    <Provider store={store}>
      <div className="App">
        <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
        <ConnectedReadback pvName={"TMC43-TS-IOC-01:CURRENT"} />
        <ConnectedReadback pvName={"sim://sine"} />
        <ConnectedInput pvName={"loc://pv1"} />
        <ConnectedInput pvName={"sim://sine"} />
        <ConnectedInput pvName={"sim://sine"} />
        <div
          style={{
            position: "absolute",
            left: "300px",
            height: "100px",
            width: "500px"
          }}
        >
          <ConnectedProgressBar pvName={"TMC43-TS-IOC-01:AI"} />
        </div>
      </div>
    </Provider>
  );
};

export default App;
