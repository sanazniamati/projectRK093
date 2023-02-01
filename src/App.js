import { Stage, Layer } from "react-konva";
import React, { useRef, useCallback, useState } from "react";

import TransformerRectangel from "./TransformerRectangel";
import Konva from "konva";

const App = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const trRef = useRef();
  const handelCreateRect = () => {
    setRectangles((prev) => [
      ...prev,
      {
        id: rectangles.toString(),
        x: rectangles.length * 150,
        color: Konva.Util.getRandomColor(),
      },
    ]);
    // console.log(blobs);
  };
  const onSelect = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const onMouseDown = (e) => {
    // check deselect nodes when clicked on empty area
    if (e.target === e.target.getStage()) {
      console.log("clicked on empty");
      setSelectedIds([]);
    }
  };

  return (
    <>
      <button onClick={handelCreateRect}> CreateRect</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
      >
        <Layer>
          {rectangles.map((rect, i) => {
            return (
              <TransformerRectangel
                ref={trRef}
                key={i}
                shapeProps={rect}
                color={rect.color}
                onSelect={onSelect}
                selectedIds={selectedIds}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};
export default App;
