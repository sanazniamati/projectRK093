import React, { forwardRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";

const TransformerRectangel = forwardRef(function Rectangle(
  { shapeProps, onSelect, onChange, selectShape },
  trRef
) {
  const shapeRef = React.useRef();
  const shapeId = shapeProps.id;

  const isSelected = selectShape.findIndex((id) => id === shapeId) > -1;

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
      newIds = selectShape.filter((i) => i !== shapeId);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      newIds = selectShape.concat(shapeId);
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
            y: e.target.y(),
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
            height: Math.max(node.height() * scaleY),
          });
        }}
        {...shapeProps}
      />
      {shapeId && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
});

export default TransformerRectangel;
