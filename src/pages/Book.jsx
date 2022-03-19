import { calculateNewValue } from "@testing-library/user-event/dist/utils";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import styled from "styled-components";

import { GO } from "../components";

export const Page = ({ className }) => {
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [lastTransformPos, setLastTransformPos] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState({ current: "select", last: "select" });
  const [pointer, setPointer] = useState("pointer");
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0 });
  const [selection, setSelection] = useState(null);

  const [objects, setObjects] = useState([
    {
      path: "M-492.50 -257.50 L-492.50 -114.00 L-342.50 -114.00 L-342.50 -257.50 Z",
      stroke: "#30E162",
      strokeWidth: "5",
      strokeLineJoin: "round",
      fillOpacity: "1",
      fill: "#30E162",
    },
    {
      path: "M-418.50 -197.50 L-418.50 -46.75 L-268.50 -46.75 L-268.50 -197.50 Z",
      stroke: "#107FC9",
      strokeWidth: "5",
      strokeLineJoin: "round",
      fillOpacity: "1",
      fill: "#107FC9",
    },
  ]);

  const onMouseDown = (e) => {
    e.preventDefault();
    console.log(e);
    setMouseIsDown(true);
    setLastMousePos({ x: e.pageX, y: e.pageY });
    setLastTransformPos({ x: transform.x, y: transform.y });

    switch (e.button) {
      case 1: //wheel
        if (mode.current === "drag") return;
        setMode({ current: "drag", last: mode.current });

        break;
      default:
        break;
    }
  };
  useEffect(() => {
    switch (mode.current) {
      case "drag":
        mouseIsDown ? setPointer("grabbing") : setPointer("grab");
        break;
      default:
        setPointer("default");
        break;
    }
  }, [mode, mouseIsDown]);

  const mouseMove = (e) => {
    if (!mouseIsDown) return;
    setMousePos({ x: e.pageX, y: e.pageY });
    let newX = lastTransformPos.x + (e.pageX - lastMousePos.x);
    let newY = lastTransformPos.y + (e.pageY - lastMousePos.y);
    switch (mode.current) {
      case "select":
        setSelection({ x: e.pageX, y: e.pageY });
        break;
      case "drag":
        setTransform({ ...transform, x: newX, y: newY });
        break;
    }
  };

  const onMouseWheel = (e) => {
    let z;

    if (e.deltaY < 0) {
      z = Math.max(0.01, transform.zoom * 1.1);
    } else {
      z = Math.max(0.01, transform.zoom / 1.1);
    }

    z = Math.min(8, z);

    console.log(z);

    let mx = e.pageX - ((e.pageX - transform.x) * z) / transform.zoom;
    let my = e.pageY - ((e.pageY - transform.y) * z) / transform.zoom;

    setTransform({ x: mx, y: my, zoom: z });
  };

  const mouseUp = () => {
    setMouseIsDown(false);
    setMode({ current: mode.last, last: mode.last });
    setSelection(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [mode]);

  return (
    <div className={className}>
      <div
        style={{
          boxShadow: "0 3px 3px rgb(0 0 0 / 8%)",
          zIndex: 60000,
          height: 47,
          display: "flex",
        }}
      >
        <button onClick={() => setMode({ current: "drag", last: "drag" })}>
          Drag
        </button>
        <button onClick={() => setMode({ current: "select", last: "select" })}>
          Select
        </button>
      </div>
      <div className="debug">
        <div>MouseDown: {mouseIsDown ? "Down" : "Up"}</div>
        <div>
          LastMousePos: {lastMousePos.x} | {lastMousePos.y}
        </div>
        <div>
          TransformPos: {transform.x} | {transform.y} | {transform.zoom}
        </div>
        <div>
          Mode: {mode.current} | {mode.last}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          zIndex: 99,
        }}
        onClick={() => setTransform({ ...transform, zoom: 1 })}
      >
        <div>{`Zoom: ${Math.round(transform.zoom * 100)}%`}</div>
      </div>
      <div className="underlay">
        <div
          className={`underlay-background ${
            transform.zoom < 0.9 ? "zoom-under-90" : ""
          } ${transform.zoom > 2 ? "zoom-over-200" : ""} ${
            transform.zoom > 4 ? "zoom-over-400" : ""
          }`}
          style={{
            backgroundPosition: `${transform.x}px ${transform.y}px`,
            backgroundSize: `${transform.zoom * 100}px`,
          }}
        ></div>
      </div>
      <div
        style={{ position: "relative", height: "100%", cursor: pointer }}
        onMouseDown={onMouseDown}
        onMouseMove={mouseMove}
        onWheel={onMouseWheel}
      >
        <svg width="100%" height="100%">
          <g
            transform={`matrix(${transform.zoom},0,0,${transform.zoom},${transform.x},${transform.y})`}
          >
            {objects.map((o) => {
              return (
                <GO>
                  <path
                    d={o.path}
                    stroke={o.stroke}
                    strokeWidth={o.strokeWidth}
                    strokeOpacity={o.strokeOpacity}
                    strokeLinejoin={o.strokeLineJoin}
                    fillOpacity={o.fillOpacity}
                    fill={o.fill}
                  ></path>
                </GO>
              );
            })}
            <circle
              fill="hsla(120,50%,85%,.5)"
              r="15"
              id="svgClientX"
              stroke="hsla(120,50%,45%,.75)"
            />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `matrix(${transform.zoom},0,0,${transform.zoom},${transform.x},${transform.y})`,
            pointerEvents: "none",
            backgroundColor: "red",
            height: "1px",
            width: "1px",
          }}
        ></div>
        <div
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            height: 0,
            width: 0,
          }}
        >
          {selection && (
            <div
              style={{
                border: "1px solid #ababab",
                background: "transparent",
                position: "absolute",
                top:
                  mousePos.y - lastMousePos.y > 0
                    ? lastMousePos.y - 69
                    : mousePos.y - 69,
                left:
                  mousePos.x - lastMousePos.x > 0 ? lastMousePos.x : mousePos.x,
                height: Math.abs(mousePos.y - lastMousePos.y),
                width: Math.abs(mousePos.x - lastMousePos.x),
                zIndex: 99,
              }}
            ></div>
          )}

          <div
            style={{
              transform: `translate(0px, 0px) rotate(0deg)`,
              transformOrigin: `${
                transform.x +
                -492.5 * transform.zoom +
                (Math.abs(-492.5 - -342.5) * transform.zoom) / 2
              }px ${
                transform.y +
                -257.5 * transform.zoom +
                (Math.abs(-257.5 - -114) * transform.zoom) / 2
              }px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: transform.y + (-257.5 - 2.5) * transform.zoom,
                left: transform.x + (-492.5 - 2.5) * transform.zoom,
                height: Math.abs(-257.5 - -114 - 5) * transform.zoom,
                width: Math.abs(-492.5 - -342.5 - 5) * transform.zoom,
                boxShadow: "0 0 0 1px #fff, 0 0 0 2px #b4b4b4, 0 0 0 3px #fff",
                zIndex: 99,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StyledPage = styled(Page)`
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: #f2f2f3;

  .debug {
    position: absolute;
    top: 50px;
    left: 0px;
    z-index: 99;
  }

  .underlay {
    translate: translateZ(0px);
    overflow: hidden;
  }

  .underlay-background {
    position: absolute;
    height: 100%;
    width: 100%;
    background-image: url(https://app.conceptboard.com/_/images/templatebg/grid/background_grid_100_white.png);
  }

  .zoom-under-90 {
    background-image: url(https://app.conceptboard.com/_/images/templatebg/grid/background_grid_90_white.png);
  }
  .zoom-over-200 {
    background-image: url(https://app.conceptboard.com/_/images/templatebg/grid/background_grid_over_200_white.png);
  }
  .zoom-over-400 {
    background-image: url(https://app.conceptboard.com/_/images/templatebg/grid/background_grid_over_400_white.png);
  }
`;
