import React, { useCallback, useRef } from "react";
import { Layer, Stage } from "react-konva";
import TransformerRectangel from "./TransformerRectangel";
const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 10,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "orange",
    id: "rect3",
  },
];
const App = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectShape, setSelectShape] = React.useState([]);
  const trRef = useRef();
  const onSelect = useCallback((ids) => {
    setSelectShape(ids);
  }, []);
  const onMouseDown = (e) => {
    // check deselect nodes when clicked on empty area
    if (e.target === e.target.getStage()) {
      console.log("clicked on empty");
      setSelectShape([]);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
    >
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <TransformerRectangel
              trRef={trRef}
              key={i}
              shapeProps={rect}
              onSelect={onSelect}
              selectShape={selectShape}
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
  );
};

export default App;
