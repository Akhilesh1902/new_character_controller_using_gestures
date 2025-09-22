import React, { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import WebCam from "react-webcam";
import { drawHand } from "./utils";

import * as fp from "fingerpose";
import victory from "./img/victory.png";
import thumbs_up from "./img/thumb.png";
import {
  yooGesture,
  pointGesture,
  palmGesture,
} from "./more_gestures/gestures";
import yoo from "./img/yoo.png";
import point from "./img/point.png";
import palm from "./img/palm.png";
import { toast } from "react-toastify";
// import useCharacter from './useCharacter';
import playerInput from "./CSM/BCCI";
import { MyContext } from "./GestureWrapper";

export default function VideoStream() {
  const { hpModelLoaded, sethpModelLoaded } = useContext(MyContext);
  console.log({ hpModelLoaded, sethpModelLoaded });
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // const { character, controls, walk, run, jump } = useCharacter('cop.glb');
  const [emoji, setEmoji] = useState(null);
  const images = {
    thumbs_up: thumbs_up,
    victory: victory,
    yoo: yoo,
    point: point,
    palm: palm,
  };

  const Handpose = async () => {
    // console.log("loading ml model");
    // loadin the media pipe model
    const model = await handpose.load();
    console.log("Handpose model loaded...");
    toast("Handpose model loaded");
    sethpModelLoaded(true);
    // loop and detect hands
    setInterval(() => {
      detectHand(model);
    }, 100);
  };

  const detectHand = async (model) => {
    // check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      if (!playerInput._enabled) return;
      // get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const hand = await model.estimateHands(video);
      // console.log(hand);

      /// gesture detection
      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          yooGesture,
          pointGesture,
          palmGesture,
        ]);

        const gesture = GE ? await GE.estimate(hand[0].landmarks, 8) : "";
        // console.log(gesture);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.score
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          setEmoji(gesture.gestures[maxConfidence].name);
          const left = hand[0].landmarks[0][0] < 200;
          const right = hand[0].landmarks[0][0] > 400;
          // console.log({ left, right, ld: hand[0].landmarks[0][0] });
          // console.log(
          //   gesture.gestures[maxConfidence].name,
          //   hand[0].landmarks[0][0] < 300
          // );
          const gestureName = gesture.gestures[maxConfidence].name;
          // console.log(gestureName);

          let keyCode;
          if (gestureName === "palm") {
            keyCode = 87;
          } else if (gestureName === "victory") {
            keyCode = 83;
          } else {
            keyCode = 0;
          }

          // console.log({ keyCode, gestureName });

          playerInput._onKeyDown({ keyCode });
          playerInput._onSetDirection({
            forward: gestureName === "palm" ? true : false,
            left: left,
            right: right,
            backward: gestureName === "victory" ? true : false,
          });

          // console.log(playerInput._keys);
        }
      } else {
        playerInput._onKeyDown({ keyCode: 0 });
        playerInput._onSetDirection({
          forward: false,
          left: false,
          right: false,
          backwad: false,
        });
      }

      // draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    Handpose();
  }, []);

  return (
    <div className="videoContainer">
      <label
        htmlFor=""
        style={{
          marginBottom: "50px",
          position: "absolute",
          zIndex: 10,
          backgroundColor: "white",
          padding: "10px",
        }}>
        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          onChange={(e) => (playerInput._enabled = e.target.checked)}
        />
        Enable Controls
      </label>
      <header className="App-header">
        {emoji !== null ? (
          <img
            className="emojiHolder"
            src={images[emoji]}
            alt="emoji"
            style={{
              // marginLeft: 'auto',
              // marginRight: 'auto',
              // left : 400,
              // bottom : 500,
              zIndex: 150,
              // padding: '8rem',
              // right: 0,
              // textAlign: 'center',
              // height: 100,
            }}
          />
        ) : (
          ""
        )}

        <WebCam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            transform: "rotateY(180deg)",
            // width: 640,
            // height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          id="video_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            transform: "rotateY(180deg)",

            // width: 640,
            // height: 480,
          }}
        />
      </header>
    </div>
  );
}
