import { createContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ThreejsWrapper from "./ThreejsWrapper";
import SignRecognization from "./Components/SignRecognization";
import Accordion from "./Accordian";

// eslint-disable-next-line
export const MyContext = createContext(null);

function GestureWrapper() {
  const [hpModelLoaded, sethpModelLoaded] = useState(true);

  return (
    <div>
      <MyContext.Provider value={{ hpModelLoaded, sethpModelLoaded }}>
        <div className="app_container">
          <header className="header">
            <Link to="/">home</Link>
          </header>

          <ToastContainer />
          <div className="instruction">
            <Accordion title={"Instructions"}>
              <div>
                <p>
                  This Character can be controlled using sign language. All the
                  below signs can be rocognized and few of them are mapped to
                  the actions.
                </p>
                <p>
                  * incase the animations are stuck please refresh the page for
                  smoother experience.
                </p>
              </div>
              <div className="flex">
                <div className="w-[600px] h-[50vh]">
                  <img
                    className="w-full! h-full object-contain"
                    src="sign_language_example.png"
                    alt=""
                  />
                </div>
                <div>
                  <h2 className="font-bold underline">Mapping</h2>
                  <p>Left - F : forward</p>
                  <p>Left - R : reverse</p>
                  <p>Right - L : Left</p>
                  <p>Right - R : Right</p>
                  <p>Right - B : Wave</p>
                  <p>Right - H : Attack</p>
                  <p>Right - C : Kick</p>
                  <p>Right - S : Jump</p>
                  <p>Right - D : Dance</p>
                </div>
              </div>
            </Accordion>
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
          {/* <VideoStream /> */}
          <div className="absolute z-10 bottom-0 w-[20vw]">
            <SignRecognization />
          </div>
        </div>
      </MyContext.Provider>
    </div>
  );
}

export default GestureWrapper;
