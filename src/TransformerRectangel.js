import { Rect, Transformer } from "react-konva";
import React, { forwardRef, useEffect, useRef } from "react";

const TransformerRectangel = forwardRef(function TransformerRectangel(
  { shapeProps, onSelect, onChange, selectedIds, color },
  trRef
) {
  const shapeRef = useRef();
  const shapeId = shapeProps.id;
  const isSelected = selectedIds.findIndex((id) => id === shapeId) > 1;

  useEffect(() => {
    const oldNodes = trRef.current.nodes();
    let selectedNodes;
    if (isSelected) {
      // add current node to Transformer's nodes
      const newNodes = oldNodes.concat(shapeRef.current);
      selectedNodes = trRef.current.nodes(newNodes);
    } else {
      // remove current node from Transformer's nodes
      const newNodes = oldNodes.filter((node) => node.id() !== shapeId);
      selectedNodes = trRef.current.nodes(newNodes);
    }
    selectedNodes.getLayer().batchDraw();
  }, [isSelected]);

  const onClick = (e) => {
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey;
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
        width={50}
        height={50}
        fill={color}
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
        onTransformEnd={() => {
          onChange({
            ...shapeProps,
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
