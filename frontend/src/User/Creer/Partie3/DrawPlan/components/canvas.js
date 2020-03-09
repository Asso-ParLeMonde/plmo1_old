import React, {useEffect, useRef, useState, forwardRef, useImperativeHandle} from "react";

import {
  IconButton, withStyles, Tooltip,
} from "@material-ui/core";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ClearIcon from '@material-ui/icons/Clear';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AdjustIcon from '@material-ui/icons/Adjust';

import "./canvas.css";
import ColorModal from "./ColorModal";
import SizeModal from "./SizeModal";
import ClearModal from "./ClearModal";

const ActionButton = withStyles( {
  root: {
    border: "1px solid",
    borderBottom: "none",
    borderRadius: 0,
  },
})(IconButton);

const sizes = [2, 4, 8];

function Canvas(_, ref) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [redoPaths, setRedoPaths] = useState([]);
  const [clear, setClear] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [color, setColor] = useState("#444");
  const [size, setSize] = useState(0);
  const [showModalColor, setShowModalColor] = useState(false);
  const [showModalSize, setShowModalSize] = useState(false);
  const [showModalClear, setShowModalClear] = useState(false);
  const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

  // Listen for resize events
  useEffect(() => {
    const resize = () => {
      setClear(true);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, []);

  // Resize canvas
  useEffect(() => {
    setClear(false);
    if (canvasRef.current && ctx !== null) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      drawAllPaths();
    } // eslint-disable-next-line
  }, [canvasRef, ctx, clear]);

  const getXY = (event) => {
    if (ctx === null) return;
    return {
      x: event.clientX - canvasRef.current.getBoundingClientRect().left,
      y: event.clientY - canvasRef.current.getBoundingClientRect().top,
    };
  };

  const drawPath = (x1, y1, x2, y2, isNew, save, specificColor, specificSize) => {
    if (ctx === null) return;
    const delta = (specificSize !== undefined ? sizes[specificSize] : sizes[size]) / 4;
    ctx.beginPath();
    ctx.strokeStyle = specificColor || color;
    ctx.lineWidth = specificSize !== undefined ? sizes[specificSize] : sizes[size];
    ctx.lineCap = "round";
    ctx.moveTo(x1 - delta, y1 - delta);
    ctx.lineTo(x2 - delta, y2 - delta);
    ctx.stroke();
    ctx.closePath();

    if (!save) return;
    const allPaths = [ ...paths ];
    if (isNew) {
      allPaths.push({ color, size, lines: [[x1, y1, x2, y2]]});
    } else {
      (allPaths[paths.length - 1] || { lines: [] }).lines.push([x1, y1, x2, y2]);
    }
    setPaths(allPaths);
  };

  const onMouseDown = (event) => {
    if (ctx === null) return;
    const { x, y } = getXY(event);
    drawPath(x, y, x, y, true, true);
    setIsDrawing(true);
    setPosition({ x, y });
    setRedoPaths([]);
  };

  const onMouseMove = (event) => {
    if (ctx === null || !isDrawing) return;
    const { x, y } = getXY(event);
    const { x: prevX, y: prevY } = position;
    drawPath(prevX, prevY, x, y, false, true);
    setPosition({ x, y });
  };

  const onMouseUpOrOut = () => {
    if (ctx === null || !isDrawing) return;
    setIsDrawing(false);
    setPosition({ x: 0, y: 0 });
  };

  const drawAllPaths = () => {
    for (const path of paths) {
      for (const line of path.lines) {
        const [x1, y1, x2, y2] = line;
        drawPath(x1, y1, x2, y2, false, false, path.color, path.size);
      }
    }
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    setRedoPaths([...redoPaths, ...paths.splice(paths.length - 1, 1)]);
    setPaths(paths);
    setClear(true);
  };

  const handleRedo = () => {
    if (redoPaths.length === 0) return;
    setPaths([...paths, ...redoPaths.splice(redoPaths.length - 1, 1)]);
    setRedoPaths(redoPaths);
    setClear(true);
  };

  const handleOpenModalColor = () => {
    setShowModalColor(true);
  };

  const handleOpenModalSize = () => {
    setShowModalSize(true);
  };

  const handleOpenModalClear = () => {
    setShowModalClear(true);
  };
  const handleCloseModalClear = confirm => () => {
    setShowModalClear(false);
    if (confirm) {
      setPaths([]);
      setRedoPaths([]);
      setClear(true);
    }
  };

  useImperativeHandle(ref, () => ({
    getBlob() {
      if (ctx === null) return new Promise((_, reject) => { reject() });
      return new Promise(resolve => {
        canvasRef.current.toBlob(function(blob) {
          resolve(blob);
        });
      });
    },
  }));

  return (
    <div>
      <div className="draw-canvas-container-max-width">
        <div>
          <div role="group"
               className="actions-buttons-container"
               aria-label="outlined primary button group">
            <Tooltip title="Couleur">
              <ActionButton aria-label="select color" onClick={handleOpenModalColor}>
                <BorderColorIcon style={{ color, stroke: `${color === 'white' ? '#444' : 'none'}` }}/>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Éppaiseur">
              <ActionButton aria-label="select size" onClick={handleOpenModalSize}>
                <AdjustIcon />
              </ActionButton>
            </Tooltip>
            <Tooltip title="Revenir en arrière">
              <ActionButton aria-label="undo" onClick={handleUndo}>
                <UndoIcon color="secondary"/>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Revenir en avant">
              <ActionButton aria-label="redo" style={{ borderRight: "1px solid" }} onClick={handleRedo}>
                <RedoIcon color="secondary"/>
              </ActionButton>
            </Tooltip>
            <div style={{ flex: 1 }} />
            <Tooltip title="Tout effacer">
              <ActionButton aria-label="clear canvas" onClick={handleOpenModalClear}>
                <ClearIcon color="error"/>
              </ActionButton>
            </Tooltip>
          </div>
        </div>
        <div className="draw-canvas-container">
          <canvas
            ref={canvasRef}
            className="draw-canvas"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrOut}
            onMouseOut={onMouseUpOrOut}
          />
        </div>
      </div>

      <ColorModal open={showModalColor} setOpen={setShowModalColor} setColor={setColor} />
      <SizeModal open={showModalSize} setOpen={setShowModalSize} setSize={setSize} />
      <ClearModal open={showModalClear} onClear={handleCloseModalClear} />

    </div>
  );
}

export default forwardRef(Canvas);
