import React from "react";
import logo from "./img/logo.png";
import "./App.css";

import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="container-fluid page-container">
        <div className="content">
          <div className="img">
            <img
              src={logo}
              alt=""
            />
            <span>By Aries</span>
            <div>
              <button className="btn btn-primary">Sign in</button>
              <button className="btn btn-secondary">Sign up</button>
            </div>
          </div>
          <div className="heading">
            <h3>3D Character Controller using Gesture Recognition</h3>
          </div>
          <div className="text">
            <p>
              Technique that allows you to determine hand gestures from a hand
              pose model. This could be used to control 3d Character in a 3d
              environment and for active gameplay.
            </p>
          </div>
          <div className="buttons">
            <Link
              style={{ padding: "10px 34px" }}
              to="/gesture"
              className="btn btn-primary">
              Try Out!
            </Link>
          </div>
        </div>
        <div className="image"></div>
      </div>
    </>
  );
}

export default App;
