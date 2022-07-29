import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import defaultImage from "../../assets/images/default/default1.jpg";
import "../../css/LeftFriendsSlider.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ChatList from "./ChatList";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function ChatSlider(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.user.isAdmin);
  return (
    <div className="w-[300px] bg-[#2f3136] h-full fixed mt-[-8px] z-10">
      <div className="flex flex-col w-[100%] items-center">
        <div className="relative translate-y-[10px] top-0 bg-[#202225] w-[95%] h-7 mx-auto flex items-center rounded-[3px] cursor-pointer select-none mt-2">
          <h1 className="text-[#a3a6aa] font-poopins font-normal text-[15px] pl-1">
            Find or start a converstaion
          </h1>
        </div>
        {/* friends btn */}
        <div
          onClick={() => {
            navigate("/app");
          }}
          className={
            location.pathname === "/app"
              ? "w-[95%] h-10 flex flex-row items-center mx-auto bg-[#42464d] active:bg-[#5a5e64] mt-6 cursor-pointer select-none rounded-[3px]"
              : "w-[95%] h-10 flex flex-row items-center mx-auto  active:bg-[#5a5e64] mt-6 cursor-pointer select-none rounded-[3px]"
          }
        >
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
        {isAdmin && (
          <Link
            // onClick={() => {
            //   navigate("/app/admin");
            // }}
            to="/app/admin"
            className={
              location.pathname === "/app/admin"
                ? "w-[95%] h-10 flex flex-row items-center mx-auto bg-[#42464d] active:bg-[#5a5e64] mt-6 cursor-pointer select-none rounded-[3px]"
                : "w-[95%] h-10 flex flex-row items-center mx-auto  active:bg-[#5a5e64] mt-6 cursor-pointer select-none rounded-[3px]"
            }
          >
            <MdOutlineAdminPanelSettings
              color="#ffffff"
              fontSize={"30px"}
              className="ml-5"
            />
            <h2 className="font-poopins font-semibold text-[#ffffff] ml-4">
              Admin Dashboard
            </h2>
          </Link>
        )}
        {/* friend list wrappper */}
        <SimpleBar className="w-[95%] h-[82vh] pb-[50vh] flex flex-col mx-auto mt-6 select-none rounded-[3px] overflow-y-auto overflow-x-hidden custom__scrollbar">
          <ChatList chats={props.chats} setNavigation={props.setNavigation} />
        </SimpleBar>
        {/* profile and settings */}
        <div className="w-[300px] h-[52px] bg-[#292b2f] z-10 flex flex-row mx-auto select-none absolute mb-[-9px] bottom-0 items-center">
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
              <div className="hover:rotate-[40deg]">
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

export default ChatSlider;
