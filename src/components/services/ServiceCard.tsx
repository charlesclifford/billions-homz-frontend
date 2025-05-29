import React from "react";
import { IServiceList } from "../pages/home/HeroSection";

const ServiceCard = ({
  item: { icon, content, title },
}: {
  item: IServiceList;
}) => {
  return (
    <div className="service-card backdrop-blur-[30px] flex rounded-[20px] bg-black/5">
      <div>
        <div className="p-[40px] pb-[50px]">
          <div className="mb-[23px] mx-auto relative pb-[23px] icon-box-wrapper">
            <span className="icon-box-icon">{icon}</span>
          </div>
          <div>
            <h5 className="mb-5 text-white text-[26px] leading-[1.23] font-bold">
              <span>{title}</span>
            </h5>
            <p className="text-gray-400 text-lg">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
