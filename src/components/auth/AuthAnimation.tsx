"use client";
import React from "react";
import Lottie from "lottie-react";
import realEstateAnim from "@/assets/animations/Lanyard drop.json"

const AuthAnimation = () => {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <Lottie animationData={realEstateAnim} loop autoplay />
    </div>
  );
};

export default AuthAnimation;
