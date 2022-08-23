import React from "react";

export default function PageNotFound() {
  return (
    <div className="login__container flex overflow-auto">
      <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
        <div className="flex flex-col justify-center">
          <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
            404
          </h1>
          <p className="text-center text-[#a0a3a6] font-poopins font-normal mt-[10px] text-[14px]">
            Page not found.
          </p>
        </div>
      </div>
    </div>
  );
}
