import { Rect, Transformer } from "react-konva";
import React, { useRef, forwardRef, useEffect } from "react";

const TransformerRectangel = forwardRef(function TransformerRectangel(
  { shapeProps, onSelect, onChange, selectedIds, isSelected },
  trRef
) {
  const shapeRef = useRef();
  const shapeId = shapeProps.id;

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
          // const node = shapeRef.current;
          // const scaleX = node.scaleX();
          // const scaleY = node.scaleY();

          // we will reset it back
          // node.scaleX(1);
          // node.scaleY(1);
          onChange({
            ...shapeProps,
            // x: node.x(),
            // y: node.y(),
            // // set minimal value
            // width: Math.max(25, node.width() * scaleX),
            // height: Math.max(node.height() * scaleY),
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
