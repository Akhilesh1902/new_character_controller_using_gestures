import * as fp from "fingerpose";
/**
 *
 *
 * All these are not being and can be safely removed
 *
 */

/* ------------------------------
   🤙 Yoo Gesture
------------------------------ */
const yooGesture = new fp.GestureDescription("yoo");

// Thumb → must be diagonal (not vertical up)
yooGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
yooGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpRight,
  1.0
);
yooGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpLeft,
  1.0
);
yooGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.HorizontalRight,
  0.75
);
yooGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.HorizontalLeft,
  0.75
);

// Pinky → strongly required
yooGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
yooGesture.addDirection(
  fp.Finger.Pinky,
  fp.FingerDirection.DiagonalUpRight,
  1.0
);
yooGesture.addDirection(
  fp.Finger.Pinky,
  fp.FingerDirection.DiagonalUpLeft,
  1.0
);
yooGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 0.75);

// Index, Middle, Ring → must be curled
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]) {
  yooGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
  yooGesture.addDirection(finger, fp.FingerDirection.VerticalDown, 1.0);
}

/* ------------------------------
   👉 Point Gesture
------------------------------ */
const pointGesture = new fp.GestureDescription("point");

// Thumb
pointGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
pointGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
pointGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpRight,
  0.5
);
pointGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpLeft,
  0.5
);

// Index
pointGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.HorizontalLeft,
  1.0
);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.HorizontalRight,
  1.0
);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalUpLeft,
  0.5
);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalUpRight,
  0.5
);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalDownLeft,
  0.5
);
pointGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalDownRight,
  0.5
);

// Middle + Ring + Pinky
for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
  pointGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
  pointGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
  pointGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
  pointGesture.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.5);
  pointGesture.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.5);
  pointGesture.addDirection(finger, fp.FingerDirection.DiagonalDownRight, 0.5);
  pointGesture.addDirection(finger, fp.FingerDirection.DiagonalDownLeft, 0.5);
}

/* ------------------------------
   ✋ Palm Gesture
------------------------------ */
const palmGesture = new fp.GestureDescription("palm");

// All fingers: No curl
for (let finger of fp.Finger.all) {
  palmGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
}

// Thumb diagonal
palmGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpLeft,
  1.0
);
palmGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalUpRight,
  1.0
);

// Index + Middle + Ring vertical
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]) {
  palmGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
  palmGesture.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.75);
  palmGesture.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.75);
}

// Pinky diagonal
palmGesture.addDirection(
  fp.Finger.Pinky,
  fp.FingerDirection.DiagonalUpLeft,
  1.0
);
palmGesture.addDirection(
  fp.Finger.Pinky,
  fp.FingerDirection.DiagonalUpRight,
  1.0
);

const fingersApartGesture = new fp.GestureDescription("fingersApart");

// All fingers: No curl (straight)
for (let finger of fp.Finger.all) {
  fingersApartGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
}

// Fingers spread apart: add horizontal directions to fingers
for (let finger of fp.Finger.all) {
  fingersApartGesture.addDirection(
    finger,
    fp.FingerDirection.HorizontalLeft,
    1.0
  );
  fingersApartGesture.addDirection(
    finger,
    fp.FingerDirection.HorizontalRight,
    1.0
  );
}

/* ------------------------------
   ✌️ Victory
------------------------------ */
const victoryGesture = new fp.GestureDescription("victory");

victoryGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
victoryGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.VerticalUp,
  1.0
);

victoryGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
victoryGesture.addDirection(
  fp.Finger.Middle,
  fp.FingerDirection.VerticalUp,
  1.0
);

for (let finger of [fp.Finger.Ring, fp.Finger.Pinky]) {
  victoryGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
}

victoryGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.75);
victoryGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.HorizontalLeft,
  0.75
);
victoryGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.HorizontalRight,
  0.75
);

/* ------------------------------
   👍 Thumbs Up
------------------------------ */
const thumbsUpGesture = new fp.GestureDescription("thumbs_up");

// Thumb must be straight and vertical up (no diagonals this time)
thumbsUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsUpGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.VerticalUp,
  1.0
);

// Other fingers must be fully curled
for (let finger of [
  fp.Finger.Index,
  fp.Finger.Middle,
  fp.Finger.Ring,
  fp.Finger.Pinky,
]) {
  thumbsUpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
}

/* ------------------------------
   ✊ Fist
------------------------------ */
const fistGesture = new fp.GestureDescription("fist");

// All fingers must be fully curled
for (let finger of fp.Finger.all) {
  fistGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
}

/* ------------------------------
   👎 Thumbs Down
------------------------------ */
const thumbsDownGesture = new fp.GestureDescription("thumbs_down");

thumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.VerticalDown,
  1.0
);
thumbsDownGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalDownLeft,
  0.75
);
thumbsDownGesture.addDirection(
  fp.Finger.Thumb,
  fp.FingerDirection.DiagonalDownRight,
  0.75
);

for (let finger of [
  fp.Finger.Index,
  fp.Finger.Middle,
  fp.Finger.Ring,
  fp.Finger.Pinky,
]) {
  thumbsDownGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
}

/* ------------------------------
   👌 OK
------------------------------ */
const okGesture = new fp.GestureDescription("ok");

okGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
okGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
okGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalUpRight,
  0.75
);
okGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.DiagonalUpLeft,
  0.75
);

for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
  okGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
  okGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
}

/* ------------------------------
  Crossed Fingers
------------------------------ */

const crossedFingersGesture = new fp.GestureDescription("crossed_fingers");

// Index → straight up
crossedFingersGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
crossedFingersGesture.addDirection(
  fp.Finger.Index,
  fp.FingerDirection.VerticalUp,
  1.0
);

// Middle → straight up (close to index)
crossedFingersGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
crossedFingersGesture.addDirection(
  fp.Finger.Middle,
  fp.FingerDirection.VerticalUp,
  1.0
);

// Ring → curled
crossedFingersGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);

// Pinky → curled
crossedFingersGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

// Thumb → curled in
crossedFingersGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.9);
crossedFingersGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.9);

/* ------------------------------
   Export all gestures
------------------------------ */
export {
  yooGesture,
  pointGesture,
  palmGesture,
  thumbsUpGesture,
  victoryGesture,
  fistGesture,
  thumbsDownGesture,
  okGesture,
  crossedFingersGesture,
  fingersApartGesture,
};
