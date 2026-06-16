import React, { useEffect, useRef, useState } from "react";
import { HOST } from "@/utils/ApiRoutes";

import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import CapturePhoto from "./CapturePhoto";

export default function Avatar({ type, image, setImage }) {
  const fileInputRef = useRef(null);

  const [hover, setHover] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });

  const canEdit = typeof setImage === "function";

  const compressImageFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const img = new Image();

        img.onload = () => {
          const maxSize = 512;
          const canvas = document.createElement("canvas");

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(compressedDataUrl);
        };

        img.onerror = reject;
        img.src = readerEvent.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const getImageSource = () => {
    if (!image) {
      return "/default_avatar.png";
    }

    if (
      image.startsWith("http") ||
      image.startsWith("/") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `${HOST}/${image}`;
  };

  const imageSource = getImageSource();

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Upload Photo",
      callBack: () => {
        fileInputRef.current?.click();
      },
    },
    {
      name: "Remove Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setImage("/default_avatar.png");
      },
    },
  ];

  useEffect(() => {
    const handleClick = () => {
      if (!isFirstRun) {
        setIsContextMenuVisible(false);
        setIsFirstRun(true);
      } else {
        setIsFirstRun(false);
      }
    };

    if (isContextMenuVisible) {
      window.addEventListener("click", handleClick);
    }

    return () => window.removeEventListener("click", handleClick);
  }, [isContextMenuVisible, isFirstRun]);

  const showContextMenu = (event) => {
    if (!canEdit) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setContextMenuCordinates({
      x: event.pageX,
      y: event.pageY,
    });

    setIsContextMenuVisible(true);
  };

  const photoPickerOnChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    try {
      const compressedImage = await compressImageFile(file);
      setImage(compressedImage);
      setIsContextMenuVisible(false);
    } catch (error) {
      alert("Could not process image. Please try another photo.");
    } finally {
      event.target.value = "";
    }
  };

  const sizeClass =
    type === "sm"
      ? "h-10 w-10"
      : type === "lg"
      ? "h-14 w-14"
      : "h-60 w-60";

  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className={`relative z-0 ${canEdit ? "cursor-pointer" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={showContextMenu}
          id="context-opener"
        >
          <img
            src={imageSource}
            alt="avatar"
            className={`${sizeClass} rounded-full object-cover`}
            id="context-opener"
          />

          {canEdit && type === "xl" && (
            <div
              className={`absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              id="context-opener"
            >
              <FaCamera className="text-2xl text-white" id="context-opener" />
              <span className="text-white text-sm" id="context-opener">
                Change
                <br />
                Profile
                <br />
                Photo
              </span>
            </div>
          )}
        </div>
      </div>

      {canEdit && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          className="hidden"
          onChange={photoPickerOnChange}
        />
      )}

      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}

      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />
      )}
    </>
  );
}