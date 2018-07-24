import React from "react";
import ReactDOM from "react-dom";
import "./css/main.css";
import App from "./js/App";
import registerServiceWorker from "./js/registerServiceWorker";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./js/services/reducers/root_reducer";
import thunk from "redux-thunk";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
