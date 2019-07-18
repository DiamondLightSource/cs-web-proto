import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ConnectedReadback } from "./components/readback";
import { ConnectedInput } from "./components/input";

const pv = "loc://pv";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <ConnectedReadback pvName={pv + "1"} />
        <ConnectedReadback pvName={pv + "2"} />
        <ConnectedReadback pvName={"sim://sine"} />
        <ConnectedInput pvName={"loc://pv1"} />
      </div>
    </Provider>
  );
};

export default App;
