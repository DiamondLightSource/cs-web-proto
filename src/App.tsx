import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import {
  ConnectedReadback,
  ConnectedStandaloneReadback
} from "./components/Readback/readback";
import { ConnectedInput } from "./components/Input/input";
import {
  ConnectedProgressBar,
  ConnectedStandaloneProgressBar
} from "./components/ProgressBar/ProgressBar";
import { ConnectedSlideControl } from "./components/SlideControl/SlideControl";
import { AlarmBorder } from "./components/AlarmBorder/AlarmBorder";
import { getStore, initialiseStore } from "./redux/store";
import { SimulatorPlugin } from "./connection/sim";

import { Mapping } from "./components/Positioning/positioningExample";

const App: React.FC = (): JSX.Element => {
  const plugin = new SimulatorPlugin();
  initialiseStore(plugin);
  let store = getStore();
  return <Mapping />;
};

export default App;
