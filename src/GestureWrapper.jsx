import React, { createContext, useState } from "react";
import VideoStream from "./VideoStream";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ThreejsWrapper from "./ThreejsWrapper";
import palm from "./img/palm.png";
import victory from "./img/victory.png";
// import yoo from './img/yoo.png';
import thumbs_up from "./img/thumb.png";

export const MyContext = createContext(null);

function GestureWrapper() {
  const [hpModelLoaded, sethpModelLoaded] = useState(false);

  return (
    <div>
      <MyContext.Provider value={{ hpModelLoaded, sethpModelLoaded }}>
        <div className="app_container">
          <header className="header">
            <Link to="/">home</Link>
          </header>

          <ToastContainer />
          <div className="instruction">
            <h1>Instructions :</h1>
            <ul>
              <li>
                <img
                  src={palm}
                  alt=""
                />
                <p>Palm : Front</p>
              </li>
              <li>
                <img
                  src={victory}
                  alt=""
                />
                <p>Victory : Back</p>
              </li>
              <li>
                <img
                  src={thumbs_up}
                  alt=""
                />
                <p>Thumbs Up : left or right</p>
              </li>
            </ul>
          </div>
          <div className="CanvasContainer">
            {hpModelLoaded ? (
              <ThreejsWrapper />
            ) : (
              <div className="background_wrapper">
                <h1>Loading Handpose Model</h1>
              </div>
            )}
          </div>
          <VideoStream />
        </div>
      </MyContext.Provider>
    </div>
  );
}

export default GestureWrapper;
