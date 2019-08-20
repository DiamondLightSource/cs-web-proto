import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { getStore, initialiseStore } from "./redux/store";

import { ConnectedReadback } from "./components/readback";
import { ConnectedInput } from "./components/input";
import { SimulatorPlugin } from "./connection/sim";

const App: React.FC = (): JSX.Element => {
  const plugin = new SimulatorPlugin();
  initialiseStore(plugin);
  let store = getStore();
  return (
    <Provider store={store}>
      <div className="App">
        <ConnectedReadback pvName={"TMC43-TS-IOC-01:AI"} />
        <ConnectedReadback pvName={"TMC43-TS-IOC-01:CURRENT"} />
        <ConnectedReadback pvName={"sim://sine"} />
        <ConnectedInput pvName={"loc://pv1"} />
        <ConnectedInput pvName={"sim://sine"} />
      </div>
    </Provider>
  );
};

export default App;
