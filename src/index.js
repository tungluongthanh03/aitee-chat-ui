import React from "react";
import ReactDOM from "react-dom/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import "./tailwind.css";
import { SocketProvider } from "./layout/SocketContext";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SocketProvider>
  // {/* </React.StrictMode> */}
);

// reportWebVitals();
