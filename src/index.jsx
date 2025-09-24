import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import GestureWrapper from "./GestureWrapper";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import SignRecognization from "./Components/SignRecognization";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<App />}
      />
      <Route
        path="/signin"
        element={<SignIn />}
      />
      <Route
        path="/signup"
        element={<SignUp />}
      />
      <Route
        path="/signlang"
        element={<SignRecognization />}
      />
      <Route
        path="/ges"
        element={<GestureWrapper />}
      />
      <Route
        path="/gesture"
        element={
          <PrivateRoute>
            <GestureWrapper />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);
