import React, { useState, useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import defaultImage from "../../assets/images/default/default1.jpg";
import "../../css/LeftFriendsSlider.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import FriendsList from "./FriendsList";
import Tooltip from "@mui/material/Tooltip";
function LeftFriendsSlider(props) {
  return (
    <div className="w-[300px] bg-[#2f3136] h-full fixed mt-[-8px] z-10">
      <div className="flex flex-col w-[100%] items-center">
        <div className="sticky top-0 bg-[#202225] w-[95%] h-7 mx-auto flex items-center rounded-[3px] cursor-pointer select-none mt-2">
          <h1 className="text-[#a3a6aa] font-poopins font-normal text-[15px] pl-1">
            Find or start a converstaion
          </h1>
        </div>
        {/* friends btn */}
        <div className="w-[95%] h-10 flex flex-row items-center mx-auto bg-[#42464d] active:bg-[#5a5e64] mt-6 cursor-pointer select-none rounded-[3px]">
          <FaUserFriends color="#ffffff" fontSize={"30px"} className="ml-5" />
          <h2 className="font-poopins font-semibold text-[#ffffff] ml-4">
            Friends
          </h2>
          {typeof props.pendingList !== "string" && (
            <div className="w-[22px] ml-2 flex items-center justify-center h-[22px] rounded-[8px] bg-[#ff0a0a] text-white">
              <span className="font-poopins">{props.pendingList.length}</span>
            </div>
          )}
        </div>
        {/* friend list wrappper */}

        <SimpleBar className="w-[95%] h-[750px] flex flex-col mx-auto mt-6 select-none rounded-[3px] overflow-y-auto overflow-x-hidden custom__scrollbar">
          <FriendsList
            friends={props.friendsList}
            setNavigation={props.setNavigation}
          />
        </SimpleBar>
        {/* profile and settings */}
        <div className="w-[300px] h-[52px] bg-[#292b2f] z-10 flex flex-row mx-auto select-none fixed bottom-0 items-center">
          <p className="profile__status">
            <img
              src={defaultImage}
              alt="Profile image"
              className="w-[40px] h-[40px] rounded-[100px] ml-3"
            />
          </p>
          <p className="text-[#FFFFFF] font-poopins font-semibold text-[15px] ml-3">
            {props.username}
          </p>
          {/* btns */}
          <div className="flex ml-auto mr-2">
            <Tooltip title="User Settings" disableInteractive>
              <div>
                <IoMdSettings
                  color="#b9bbbe"
                  fontSize={"20px"}
                  cursor="pointer"
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftFriendsSlider;
