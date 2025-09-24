import * as THREE from "three";

import BCCI from "./BCCI";

const CC = {
  // state
  _toggleRun: false,

  _animMap: new Map(),

  _model: null,
  _mixer: null,
  // _animMap: null,

  // temporary data
  walkDirection: new THREE.Vector3(),
  rotateAngle: new THREE.Vector3(0, 1, 0),
  rotateQuarternion: new THREE.Quaternion(),
  cameraTarget: new THREE.Vector3(),
  isJumping: false,
  // consotants
  fadeDuration: 0.2,
  runVelocity: 5,
  walkVelocity: 2,

  _init(model, mixer, animationMap, orbCont, camera, curAction) {
    this._model = model;
    this._mixer = mixer;
    this._animMap = animationMap;

    this._animMap.forEach((value, key) => {
      // console.log({ value, curAction });
      if (key === curAction) {
        value.play();
      }
    });
    this._OC = orbCont;
    this.camera = camera;
    this.curAction = curAction;
    this.updateCameraTarget(0, 0);
  },
  switchRunToggle() {
    this._toggleRun = !this._toggleRun;
  },
  update(delta, keyPressed) {
    const directionPressed = Object.values(BCCI._keys).some((v) => v === true);
    const pressedKeys = Object.entries(BCCI._keys)
      .filter(([key, isPressed]) => isPressed)
      .map(([key]) => key);
    // console.log(pressedKeys);
    // console.log(directionPressed);
    var play = "";

    if (pressedKeys[0] === "wave") {
      play = "wave_girl";
    } else if (pressedKeys[0] === "kick") {
      play = "back_kick_girl";
    } else if (pressedKeys[0] === "punch") {
      play = "hook_punch";
    } else if (pressedKeys[0] === "shift") {
      play = "dance";
    } else if (pressedKeys[0] === "space") {
      play = "jump_girl";
    } else if (directionPressed && this._toggleRun) {
      play = "running";
    } else if (directionPressed) {
      play = "running";
    } else {
      play = "idle_girl";
    }

    if (!this.curAction) {
      // console.log('here');
      return;
    }
    if (this.curAction !== play) {
      if (
        this.isJumping &&
        (this.curAction === "jump_girl" ||
          this.curAction === "dance" ||
          this.curAction === "hook_punch" ||
          this.curAction === "wave_girl" ||
          this.curAction === "back_kick_girl") &&
        play !== this.curAction
      ) {
        return; // lock active, do nothing
      }

      const toPlay = this._animMap.get(play);
      const current = this._animMap.get(this.curAction);

      if (
        play === "jump_girl" ||
        play === "dance" ||
        play === "hook_punch" ||
        play === "wave_girl" ||
        play === "back_kick_girl"
      ) {
        if (!this.isJumping) {
          // <-- Add guard to avoid restarting animation repeatedly
          this.isJumping = true;
          toPlay.reset().setLoop(THREE.LoopOnce, 1).play();

          const onFinish = (e) => {
            if (e.action === toPlay) {
              this.isJumping = false;
              this.curAction = play;
              this._mixer.removeEventListener("finished", onFinish);
            }
          };
          this._mixer.addEventListener("finished", onFinish);
        }
      } else {
        current.fadeOut(this.fadeDuration);
        toPlay.reset().fadeIn(this.fadeDuration).play();
        this.curAction = play;
      }
    }

    this._mixer?.update(delta);

    if (this.curAction === "running" || this.curAction === "walking") {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        this.camera.position.x - this._model.position.x,
        this.camera.position.z - this._model.position.z
      );
      // diagonal movement angle offset
      var directionOffset = -this.directionOffset(keyPressed);

      // rotate _model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      // this._model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);
      this._model.quaternion.rotateTowards(this.rotateQuarternion, 0.5);

      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk velocity
      const velocity =
        this.curAction === "running" ? this.runVelocity : this.walkVelocity;
      // move _model & camera
      const moveX = -this.walkDirection.x * velocity * delta;
      const moveZ = -this.walkDirection.z * velocity * delta;
      this._model.position.x += moveX;
      this._model.position.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
  },
  updateCameraTarget(moveX, moveZ) {
    // move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // update camera target
    this.cameraTarget.x = this._model.position.x;
    this.cameraTarget.y = this._model.position.y + 0;
    this.cameraTarget.z = this._model.position.z;
    this._OC.target = this.cameraTarget;
  },
  directionOffset(keysPressed) {
    var directionOffset = 0; // w

    if (keysPressed.backward) {
      if (keysPressed.right) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed.left) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed.forward) {
      if (keysPressed.right) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed.left) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed.right) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed.left) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  },
};

export default CC;
