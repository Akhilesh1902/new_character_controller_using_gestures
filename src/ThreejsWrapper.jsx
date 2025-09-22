import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import characterControls from "./CSM/CC"; // default export assumed
import playerInput from "./CSM/BCCI"; // renamed for clarity
import Grass from "./Grass";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import Butterflies from "./Buttterfly";
import MultiEffectPostProcessor from "./Postprocessing";
// import * as dat from "dat.gui";

const ThreejsWrapper = () => {
  const canvasRef = useRef(null); // single source of truth
  const rendererRef = useRef(null); // let us dispose on unmount
  const clock = useRef(new THREE.Clock());
  const frameId = useRef(null); // store rAF id for cleanup

  /* ─────────────────────────── EFFECT ─────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    /* --- Scene & Lights --- */
    const scene = new THREE.Scene();
    scene.name = "MainScene";
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    /* --- Camera & Controls --- */
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.001,
      100
    );
    // camera.position.set(0, 6, 6);
    camera.position.set(0, 2, 3);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    new RGBELoader().setPath("/").load("sky.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture; // Optional: also use for reflections on objects
    });

    /* --- Ground Plane --- */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: 0x062902,
        side: THREE.DoubleSide,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    // console.log({ scene });
    const { grassShaderMaterial } = new Grass(plane, scene);
    console.log({ grassShaderMaterial });
    // scene.add(grass);
    // console.log({ grassShaderMaterial, scene });
    scene.add(plane);

    // butterflies

    const butterflies = new Butterflies(scene);
    /* --- Renderer --- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    // renderer.outputEncoding = THREE.sRGBEncoding; // nicer colours
    rendererRef.current = renderer;

    const postProcessor = new MultiEffectPostProcessor(renderer, scene, camera);
    // postProcessor.enableEffect("sepia");

    // // Initialize dat.GUI
    // console.log(dat);
    // const gui = new dat.GUI();

    // const settings = {
    //   effect: "none", // options: none, grayscale, sepia, invert, bloom, filmGrain
    //   bloomStrength: 1.5,
    //   bloomRadius: 0.4,
    //   bloomThreshold: 0.85,
    // };

    // gui
    //   .add(settings, "effect", [
    //     "none",
    //     "grayscale",
    //     "sepia",
    //     "invert",
    //     "bloom",
    //     "filmGrain",
    //   ])
    //   .onChange((val) => {
    //     postProcessor.enableEffect(val === "none" ? null : val);
    //   });
    /* --- Resize Handling --- */
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    /* --- Model & Animations --- */
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      "cop.glb",
      (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);

        /* mixer + clip map */
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const animMap = new Map();
        gltf.animations.forEach((clip) =>
          animMap.set(clip.name, mixer.clipAction(clip))
        );
        console.log(
          gltf.scene,
          mixer,
          animMap,
          controls,
          camera,
          "Breathing Idle"
        );
        characterControls._init(
          gltf.scene,
          mixer,
          animMap,
          controls,
          camera,
          "Breathing Idle"
        );
      },
      undefined,
      (err) => console.error("GLB load error ▶", err)
    );

    /* --- Keyboard Events --- */
    const onKeyDown = (e) => {
      playerInput._onKeyDown(e);
      if (e.shiftKey && !characterControls.isRunning)
        characterControls._toggleRun = true;
    };
    const onKeyUp = (e) => {
      playerInput._onKeyUp(e);
      if (e.key === "Shift") characterControls._toggleRun = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    /* --- Animation Loop --- */
    const animate = () => {
      const delta = clock.current.getDelta();
      characterControls.update(delta, playerInput._keys);
      controls.update();
      // renderer.render(scene, camera);
      postProcessor.render();
      butterflies.update(clock.current);

      // grass.tick();
      grassShaderMaterial.uniforms.time.value += delta;
      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    /* ──────────────── CLEAN-UP ──────────────── */
    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      controls.dispose();
      renderer.dispose();
      plane.geometry.dispose();
      plane.material.dispose();
    };
  }, []);

  return (
    <div className="threejs_wrapper">
      <canvas
        ref={canvasRef}
        className="webgl"
      />
    </div>
  );
};

export default ThreejsWrapper;
