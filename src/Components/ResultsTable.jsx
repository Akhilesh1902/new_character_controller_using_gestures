import playerInput from "../CSM/BCCI";

// result table Components
export default function ResultsTable({ results }) {
  // console.log(results);

  //   console.log(results);
  if (results.handedness) {
    const flattened = results.handedness.flat();

    const right = flattened.find((item) => item.categoryName === "Right");
    const left = flattened.find((item) => item.categoryName === "Left");

    const rightEnabled = right && right.score > 0.9;
    const leftEnabled = left && left.score > 0.9;
    const rightGesture = right && right.handGesture[0].categoryName;
    const leftGesture = left && left.handGesture[0].categoryName;
    // console.log(results.gestures);
    const gestures = results.gestures;

    // console.log({ right, left, rightEnabled, leftEnabled, flattened, results });
    console.log({
      rightEnabled,
      leftEnabled,
      rightGesture,
      leftGesture,
      gestures,
      flattened,
    });

    if (!rightEnabled || !leftEnabled) {
      playerInput._reset();
    }

    // handle right and left controls
    if (rightGesture === "L") {
      playerInput._onKeyDown({ keyCode: 68 });
    } else if (rightGesture === "R") {
      playerInput._onKeyDown({ keyCode: 65 });
    }

    // handle front and back contrls
    if (leftGesture === "F") {
      playerInput._onKeyDown({ keyCode: 87 });
    } else if (leftGesture === "R") {
      playerInput._onKeyDown({ keyCode: 83 });
    }

    // handle static animations
    if (rightGesture === "B") {
      // say hi
      playerInput._onKeyDown({ keyCode: 82 });
    }
    if (rightGesture === "H") {
      // punch
      playerInput._onKeyDown({ keyCode: 81 });
    }
    if (rightGesture === "C") {
      // kick
      playerInput._onKeyDown({ keyCode: 69 });
    }
    if (rightGesture === "D") {
      // dance
      playerInput._onKeyDown({ keyCode: 16 });
    }
    if (rightGesture === "S") {
      // jump
      playerInput._onKeyDown({ keyCode: 32 });
    }
    // console.log(playerInput);

    // console.log({ keyCode, gestureName });

    // playerInput._onKeyDown({ keyCode });
    // playerInput._onSetDirection({
    //   forward: gestureName === "palm" ? true : false,
    //   left: left,
    //   right: right,
    //   backward: gestureName === "victory" ? true : false,
    // });
  }
  if (!results || !results.handedness) {
    return (
      <details className="text-gray-200 group px-2">
        <summary className="my-2 hover:text-gray-400 cursor-pointer transition-colors duration-300">
          Detection Results
        </summary>
        <div className="transition-all duration-300 ease-in-out transform origin-top group-open:animate-details-show">
          <p className="text-center text-gray-400 py-2">
            No hand gestures detected
          </p>
        </div>
      </details>
    );
  }

  return (
    <details
      className="text-gray-200  group px-2"
      open>
      <summary className="my-2 hover:text-gray-400 cursor-pointer transition-colors duration-300">
        Detection Results ({results.handedness.length})
      </summary>
      <div
        className="transition-all duration-300 ease-in-out transform origin-top
                group-open:animate-details-show">
        <table
          className="text-left mx-auto border-collapse table-auto text-sm 
              bg-gray-800 rounded-md overflow-hidden max-w-[320px]">
          <thead className="bg-gray-700">
            <tr>
              <th className="border-b border-gray-600 p-1 md:p-2 text-gray-100">
                #
              </th>
              <th className="border-b border-gray-600 p-1 md:p-2 text-gray-100">
                hand
              </th>
              <th className="border-b border-gray-600 p-1 md:p-2 text-gray-100">
                Gesture
              </th>
              <th className="border-b border-gray-600 p-1 md:p-2 text-gray-100">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody>
            {results.handedness.map((hand, idx) => {
              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-700 transition-colors text-gray-300">
                  <td className="border-b border-gray-600 px-2 py-1 text-center">
                    {idx + 1}
                  </td>
                  <td className="border-b border-gray-600 px-2 py-1">
                    {hand[0]?.categoryName === "Left" ? "Left" : "Right"}
                    <span className="text-xs text-gray-400 ml-1">
                      ({(hand[0]?.score * 100 || 0).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="border-b border-gray-600 px-2 py-1">
                    {results.gestures?.[idx]?.[0]?.categoryName === "None"
                      ? "None"
                      : results.gestures?.[idx]?.[0]?.categoryName || "Unknown"}
                  </td>
                  <td className="border-b border-gray-600 px-2 py-1 text-right">
                    {(results.gestures?.[idx]?.[0]?.score * 100 || 0).toFixed(
                      0
                    )}
                    %
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
