import React, { forwardRef, useRef, useCallback, useEffect } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Transformer, Text } from "react-konva";

const Rectangle = forwardRef(function Rectangle(
  { shapeProps, onSelect, onChange, selectedIds },
  trRef
) {
  const shapeRef = React.useRef();

  const shapeId = shapeProps.id;

  const isSelected = selectedIds.findIndex((id) => id === shapeId) > -1;

  useEffect(() => {
    const oldNodes = trRef.current.nodes();
    let newNodes = [];
    if (isSelected) {
      // add current node to Transformer's nodes
      newNodes = oldNodes.concat(shapeRef.current);
    } else {
      // remove current node from Transformer's nodes
      newNodes = oldNodes.filter((node) => node.id() !== shapeId);
    }

    trRef.current.nodes(newNodes);
    trRef.current.getLayer().batchDraw();
  }, [isSelected, shapeId]);

  const onClick = (e) => {
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;

    let newIds = [];

    if (!metaPressed && isSelected) {
      // do nothing if node is selected and no key pressed
      return;
    }

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      newIds = [shapeId];
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection
      newIds = selectedIds.filter((i) => i !== shapeId);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      newIds = selectedIds.concat(shapeId);
    }

    onSelect(newIds);
  };

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        draggable
        onClick={onClick}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(25, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          });
        }}
        {...shapeProps}
      />
    </React.Fragment>
  );
});

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1"
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2"
  },
  {
    x: 350,
    y: 190,
    width: 100,
    height: 100,
    fill: "orange",
    id: "rect3"
  }
];

const App = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedIds, selectNodes] = React.useState([]);

  const trRef = useRef();

  const onSelect = useCallback((ids) => {
    selectNodes(ids);
  }, []);

  const onMouseDown = (e) => {
    // check deselect nodes when clicked on empty area
    if (e.target === e.target.getStage()) {
      console.log("clicked on empty");
      selectNodes([]);
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
            <Rectangle
              ref={trRef}
              key={i}
              shapeProps={rect}
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
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

render(<App />, document.getElementById("root"));
