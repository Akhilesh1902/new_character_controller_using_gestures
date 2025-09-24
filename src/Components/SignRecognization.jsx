import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import ResultsTable from "./ResultsTable";

// model status Components
function ModelStatus({ warnUpTime, inferenceTime, statusMsg, statusColor }) {
  return (
    <div
      id="model-status-container"
      className="text-xl md:text-2xl px-2">
      <div
        id="inferenct-time-container"
        className="flex flex-col md:flex-row md:justify-evenly text-lg md:text-xl my-4 md:my-6">
        <p className="mb-2 md:mb-0">
          Warm up time: <span className="text-lime-500">{warnUpTime}ms</span>
        </p>
        <p>
          Inference time:{" "}
          <span className="text-lime-500">{inferenceTime}ms</span>
        </p>
      </div>
      <p
        className={statusColor !== "green" ? "animate-text-loading" : ""}
        style={{ color: statusColor }}>
        {statusMsg}
      </p>
    </div>
  );
}

// Display Components
function ImageDisplay({
  inputCanvasRef,
  cameraRef,
  overlayRef,
  camera_stream,
  onCameraLoad,
}) {
  return (
    <div className="container m-0! border-none relative min-h-[20px] flex justify-center items-center">
      <canvas
        ref={inputCanvasRef}
        hidden></canvas>
      <video
        className="block w-full max-w-full md:max-w-[720px] max-h-[640px] rounded-lg inset-0 mx-auto"
        ref={cameraRef}
        onLoadedData={onCameraLoad}
        hidden={!camera_stream}
        autoPlay
      />

      <canvas
        ref={overlayRef}
        className="absolute pointer-events-none"></canvas>
    </div>
  );
}

const SignRecognization = () => {
  const [modelState, setModelState] = useState({
    isLoaded: false,
    warnUpTime: 0,
    inferenceTime: 0,
    statusMsg: "Model not loaded",
    statusColor: "inherit",
    runningMode: "IMAGE",
    currentModel: "sing_language.task",
    delegate: "GPU",
  });
  const {
    isLoaded: isModelLoaded,
    warnUpTime,
    inferenceTime,
    statusMsg,
    statusColor,
    runningMode,
  } = modelState;

  // resource reference
  const gestureRecognizerRef = useRef(null);
  const drawingUtilsRef = useRef(null);

  // content reference
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
  const cameraRef = useRef(null);
  const inputCanvasRef = useRef(null);

  // state
  const [cameras, setCameras] = useState([]);
  const [camera_stream, setCameraStream] = useState(null);
  const [handResults, setHandResults] = useState([]);

  // init
  useEffect(() => {
    loadMediaPipeModel();
    getCameras();

    return () => {
      // cleanup
      if (camera_stream) {
        camera_stream.getTracks().forEach((track) => track.stop());
      }

      // Close MediaPipe model
      if (gestureRecognizerRef.current) {
        gestureRecognizerRef.current.close();
      }
    };
  }, []);

  const loadMediaPipeModel = async () => {
    // update model state
    setModelState((prev) => ({
      ...prev,
      statusMsg: "Loading MediaPipe model...",
      statusColor: "red",
      isLoaded: false,
      runningMode: "IMAGE",
    }));

    try {
      const start = performance.now();

      // Load the GestureRecognizer model
      const vision = await FilesetResolver.forVisionTasks("./wasm");

      gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: `./models/${modelState.currentModel}`,
            delegate: modelState.delegate,
          },
          runningMode: "IMAGE",
          numHands: 2,
        }
      );

      const end = performance.now();

      // Create drawing utilities
      drawingUtilsRef.current = new DrawingUtils(
        overlayRef.current.getContext("2d")
      );

      setModelState((prev) => ({
        ...prev,
        statusMsg: "MediaPipe model loaded",
        statusColor: "green",
        warnUpTime: (end - start).toFixed(2),
        isLoaded: true,
      }));
    } catch (error) {
      setModelState((prev) => ({
        ...prev,
        statusMsg: "MediaPipe model loading failed",
        statusColor: "red",
        isLoaded: false,
      }));
      console.error(error);
    }
  };

  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);
    } catch (err) {
      console.error("Error getting cameras:", err);
    }
  }, []);

  const handle_ToggleCamera = useCallback(async () => {
    console.log("camer");
    if (camera_stream) {
      // stop camera
      camera_stream.getTracks().forEach((track) => track.stop());
      cameraRef.current.srcObject = null;
      setCameraStream(null);
      overlayRef.current.width = 0;
      overlayRef.current.height = 0;
      overlayRef.current.style.width = `0px`;
      overlayRef.current.style.height = `0px`;

      setHandResults([]);
    } else {
      try {
        // Set running mode to VIDEO before starting camera
        if (runningMode !== "VIDEO") {
          gestureRecognizerRef.current.setOptions({
            runningMode: "VIDEO",
            numHands: 2,
          });
          setModelState((prev) => ({
            ...prev,
            runningMode: "VIDEO",
          }));
        }

        // open camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: "123",
          },
          audio: false,
        });
        setCameraStream(stream);
        cameraRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  }, [camera_stream, runningMode]);

  const handle_frame_continuous = useCallback(async () => {
    if (!cameraRef.current?.srcObject || !gestureRecognizerRef.current) return;

    // 30fps
    const now = performance.now();
    if (!window.lastFrameTime || now - window.lastFrameTime > 33) {
      window.lastFrameTime = now;

      try {
        const start = performance.now();

        // Process the current frame
        const results = gestureRecognizerRef.current.recognizeForVideo(
          cameraRef.current,
          now
        );

        const end = performance.now();
        const processingTime = (end - start).toFixed(2);

        // Clear canvas
        const ctx = overlayRef.current.getContext("2d");
        ctx.clearRect(
          0,
          0,
          overlayRef.current.width,
          overlayRef.current.height
        );

        // Draw landmarks
        // console.log({ land: results.landmarks });
        // if (!results.landmarks.length) {
        //   results.handedness = [];
        // }
        if (results.handedness && results.gestures) {
          // Flatten handedness if nested
          const handednessFlat = results.handedness.flat();

          // Merge gesture info by index
          handednessFlat.forEach((hand, index) => {
            hand.handGesture = results.gestures[index] || null;
          });

          // Optionally reassign the flattened array back if needed
          results.handedness = handednessFlat;
        }

        if (results.landmarks) {
          for (const landmarks of results.landmarks) {
            drawingUtilsRef.current.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 5 }
            );
            drawingUtilsRef.current.drawLandmarks(landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }

        // Update results state without causing re-renders on every frame
        const hasResults = results.gestures && results.gestures.length > 0;
        if (results.landmarks.length === 0) {
          setHandResults([]);
        } else if (
          hasResults &&
          JSON.stringify(results) !== JSON.stringify(handResults)
        ) {
          setHandResults(results);
        } else if (!hasResults) {
          setHandResults([]);
        }

        // Update inference time
        if (processingTime !== inferenceTime) {
          setModelState((prev) => ({
            ...prev,
            inferenceTime: processingTime,
          }));
        }
      } catch (error) {
        console.error("Frame processing error:", error);
      }
    }

    // next frame
    requestAnimationFrame(handle_frame_continuous);
  }, [handResults, inferenceTime]);

  const handle_cameraLoad = useCallback(() => {
    if (
      !cameraRef.current ||
      !overlayRef.current ||
      !gestureRecognizerRef.current
    )
      return;

    // set overlay size same as camera size
    overlayRef.current.width = cameraRef.current.videoWidth;
    overlayRef.current.height = cameraRef.current.videoHeight;

    // set css overlay size same as camera size
    const videoRect = cameraRef.current.getBoundingClientRect();
    overlayRef.current.style.width = `${videoRect.width}px`;
    overlayRef.current.style.height = `${videoRect.height}px`;

    // start video frames
    handle_frame_continuous();
  }, []);

  return (
    <div className="bg-gray-200 flex flex-col items-center w-full">
      {/* <h1 className="my-4 md:my-8 text-3xl md:text-4xl px-2">
        Hand Gesture Recognition with MediaPipe
      </h1> */}

      <ImageDisplay
        inputCanvasRef={inputCanvasRef}
        cameraRef={cameraRef}
        imgRef={imgRef}
        overlayRef={overlayRef}
        camera_stream={camera_stream}
        onCameraLoad={handle_cameraLoad}
      />

      <button
        className="btn"
        onClick={handle_ToggleCamera}
        disabled={cameras.length === 0 || !isModelLoaded}>
        {camera_stream ? "Close Camera" : "Open Camera"}
      </button>
      <div className="h-[100px]">
        <ResultsTable results={handResults} />
      </div>
      {/* <ModelStatus
        warnUpTime={warnUpTime}
        inferenceTime={inferenceTime}
        statusMsg={statusMsg}
        statusColor={statusColor}
      /> */}
    </div>
  );
};

export default SignRecognization;
