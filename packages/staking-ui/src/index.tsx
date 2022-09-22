import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./assets/css/button.css";
import "./assets/css/healper.css";
import "./assets/css/input.css";
import "./assets/css/pagination.css";
import Main from "./App";
import reportWebVitals from "./reportWebVitals";

const App = () => {
  return (
    <React.StrictMode>
      <Provider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
