import React, { useEffect, useState } from "react";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import axios from "axios";
import {
  onBoardUserRoute,
  UPLOAD_PROFILE_IMAGE_ROUTE,
} from "../utils/ApiRoutes";

import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

export default function OnBoarding() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const [image, setImage] = useState("/default_avatar.png");
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const dataUrlToFile = async (dataUrl) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return new File([blob], "profile-picture.png", {
      type: blob.type || "image/png",
    });
  };

  const uploadProfileImage = async () => {
    if (!image || image === "/default_avatar.png") {
      return "/default_avatar.png";
    }

    if (!image.startsWith("data:")) {
      return image;
    }

    const file = await dataUrlToFile(image);

    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post(UPLOAD_PROFILE_IMAGE_ROUTE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.image;
  };

  const onBoardUser = async () => {
    if (!validateDetails() || isSaving) {
      return;
    }

    const email = userInfo?.email;

    try {
      setIsSaving(true);

      const uploadedImage = await uploadProfileImage();

      const { data } = await axios.post(onBoardUserRoute, {
        email,
        name,
        about,
        image: uploadedImage,
      });

      if (data.status) {
        dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id: data?.data?.id,
            name,
            email,
            profileImage: uploadedImage,
            status: about,
          },
        });

        router.push("/");
      } else {
        alert(data.msg || "Could not create profile.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Could not create profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const validateDetails = () => {
    if (!name || name.trim().length < 3) {
      alert("Display name must be at least 3 characters.");
      return false;
    }

    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={300}
          width={300}
        />
        <span className="text-7xl">WhatsApp</span>
      </div>

      <h2 className="text-2xl">Create your profile</h2>

      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />

          <div className="flex items-center justify-center">
            <button
              className="bg-search-input-container-background p-5 rounded-lg disabled:opacity-60"
              onClick={onBoardUser}
              disabled={isSaving}
            >
              {isSaving ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </div>

        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}