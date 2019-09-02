import React from "react";
import "./App.css";
import { getStore, initialiseStore } from "./redux/store";
import { SimulatorPlugin } from "./connection/sim";

import { Mapping } from "./components/Positioning/ionpExample";

const App: React.FC = (): JSX.Element => {
  const plugin = new SimulatorPlugin();
  initialiseStore(plugin);
  let store = getStore();
  return <Mapping />;
};

export default App;
