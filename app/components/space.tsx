"use client";

import { useEffect, useState, useRef } from "react";

import { useCursors } from "../context/cursor-context";
import OtherCursor from "./other-cursor";
import SelfCursor from "./self-cursor";

const Space = () => {
  const { others, self } = useCursors();
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const onResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    // Add the class 'overflow-hidden' on body to prevent scrolling
    document.body.classList.add("overflow-hidden");
    // Scroll to top
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const count = Object.keys(others).length + (self ? 1 : 0);

  return (
    <div>
        <div className="flex items-center justify-center min-h-screen">
        <li className="mb-4 pulse-li text-2xl"><i className="pulse green"></i><span className="text-white">{count} LIVE on the website right now</span></li>
        </div>
      {Object.keys(others).map((id) => (
        <div key={id}>
          <OtherCursor
            id={id}
            windowDimensions={windowDimensions}
            fill="#06f"
          />
        </div>
      ))}
      {self?.pointer === "touch" && (
        <SelfCursor windowDimensions={windowDimensions} />
      )}
    </div>
  );
};

export default Space;
