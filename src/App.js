import { Stage, Layer } from "react-konva";
import React, { useState, useRef, useCallback } from "react";

import TransformerRectangel from "./TransformerRectangel";

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 50,
    height: 50,
    fill: "red",
    id: "rect1",
  },
  {
    x: 10,
    y: 100,
    width: 50,
    height: 50,
    fill: "green",
    id: "rect2",
  },
  // {
  //   x: 10,
  //   y: 190,
  //   width: 50,
  //   height: 50,
  //   fill: "orange",
  //   id: "rect3",
  // },
];

const App = () => {
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedIds, setSelectedIds] = useState([]);

  const trRef = useRef();

  // const onSelect = useCallback((ids) => {
  //   setSelectedIds(ids);
  // }, []);

  const onMouseDown = (e) => {
    // check deselect nodes when clicked on empty area
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
    }
  };
  // const handelCreateRect = () => {
  //   setRectangles((prevBlobs) => [
  //     ...prevBlobs,
  //     {
  //       id: rectangles.toString(),
  //       x: rectangles.length * 150,
  //       color: Konva.Util.getRandomColor(),
  //     },
  //   ]);
  //   console.log(rectangles.id);
  // };
  return (
    <>
      {/*<button onClick={handelCreateRect}> CreateRect</button>*/}
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
                color={rect.color}
                isSelected={selectedIds.findIndex((id) => id === rect.id) >= 0}
                shapeProps={rect}
                onSelect={useCallback((id) => {
                  setSelectedIds(id);
                }, [])}
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
