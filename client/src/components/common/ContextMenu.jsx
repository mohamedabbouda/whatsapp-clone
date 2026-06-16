import React, { useEffect, useRef } from "react";

export default function ContextMenu({
  options,
  cordinates,
  contextMenu,
  setContextMenu,
}) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target)
        ) {
          setContextMenu(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setContextMenu]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        if (contextMenu) {
          setContextMenu(false);
        }
      }
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => window.removeEventListener("keyup", handleKeyPress);
  }, [contextMenu, setContextMenu]);

  const handleClick = (event, callBack) => {
    event.preventDefault();
    event.stopPropagation();
    callBack();
  };

  return (
    <div
      className="bg-dropdown-background fixed py-2 z-[100]"
      ref={contextMenuRef}
      style={{
        boxShadow:
          "0 2px 5px 0 rgba(11,20,26,.26), 0 2px 10px 0 rgba(11,20,26,.16)",
        top: cordinates.y,
        left: cordinates.x,
      }}
    >
      <ul>
        {options.map(({ name, callBack }) => (
          <li
            key={name}
            className="hover:bg-background-default-hover px-5 py-2 cursor-pointer"
            onMouseDown={(event) => handleClick(event, callBack)}
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}