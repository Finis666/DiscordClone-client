import React, { useEffect, useState } from "react";
import Search from "./Search";
import { ImCancelCircle } from "react-icons/im";
import { GoVerified } from "react-icons/go";
import defaultImage from "../../../../assets/images/default/default1.jpg";
import Tooltip from "@mui/material/Tooltip";
import SimpleBar from "simplebar-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
function Pending(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currPendingLength, setCurrPendingLength] = useState(0);
  const currentUserId = useSelector((state) => state.user.userId);
  const currentUsername = useSelector((state) => state.user.username);
  const socket = props.socket;
  useEffect(() => {
    if (typeof props.pendingList === "string") {
      return;
    } else {
      let filterPendingCount = props.pendingList.filter((item) => {
        if (searchTerm == "") {
          return item;
        } else if (
          item.username.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return item;
        }
      });
      setCurrPendingLength(filterPendingCount.length);
    }
  }, [searchTerm]);

  const handleAccept = async (userId, username) => {
    try {
      let response = await axios.put(
        "/api/friends/acceptFriend",
        { userId: userId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data[0].success) {
        toast(response.data[0].msg, {
          type: "error",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
        return;
      } else {
        if (props.pendingList.length === 1) {
          props.setPendingList("You have no pending request.");
          if (typeof props.friendsList === "string") {
            props.setFriendsList([
              { username: username, userId: userId, active: false },
            ]);
          } else {
            props.setFriendsList([
              ...props.friendsList,
              { username: username, userId: userId, active: false },
            ]);
          }
          if (typeof props.chats === "string") {
            props.setChats([
              { userId: userId, username: username, active: false },
            ]);
          } else {
            props.setChats([
              ...props.chats,
              { userId: userId, username: username, active: false },
            ]);
          }
          // handling socket on accept
          socket?.emit("pending_accept", {
            currUserId: currentUserId,
            currUsername: currentUsername,
            reqId: userId,
          });
          toast(response.data[0].msg, {
            type: "success",
            toastId: "responseSuccess",
            pauseOnFocusLoss: false,
            autoClose: 4000,
          });
          return;
        } else {
          let newPendingList = props.pendingList.filter((item) => {
            return item.userId !== userId;
          });
          props.setPendingList(newPendingList);

          if (typeof props.friendsList === "string") {
            props.setFriendsList([
              { username: username, userId: userId, active: false },
            ]);
          } else {
            props.setFriendsList([
              ...props.friendsList,
              { username: username, userId: userId, active: false },
            ]);
          }
          if (typeof props.chats === "string") {
            props.setChats([
              { userId: userId, username: username, active: false },
            ]);
          } else {
            props.setChats([
              ...props.chats,
              { userId: userId, username: username, active: false },
            ]);
          }
          // handling socket on accept
          socket?.emit("pending_accept", {
            currUserId: currentUserId,
            currUsername: currentUsername,
            reqId: userId,
          });
          toast(response.data[0].msg, {
            type: "success",
            toastId: "responseSuccess",
            pauseOnFocusLoss: false,
            autoClose: 4000,
          });
          return;
        }
      }
    } catch (err) {
      toast("An error happend, please try later", {
        type: "error",
        toastId: "responseErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    }
  };

  const handleDecline = async (userId) => {
    try {
      let response = await axios.put(
        "/api/friends/declineRequest",
        { userId: userId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data[0].success) {
        toast(response.data[0].msg, {
          type: "error",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
        return;
      } else {
        if (props.pendingList.length === 1) {
          props.setPendingList("You have no pending request.");

          toast(response.data[0].msg, {
            type: "success",
            toastId: "responseSuccess",
            pauseOnFocusLoss: false,
            autoClose: 4000,
          });
          return;
        } else {
          let newPendingList = props.pendingList.filter((item) => {
            return item.userId !== userId;
          });
          props.setPendingList(newPendingList);
          toast(response.data[0].msg, {
            type: "success",
            toastId: "responseSuccess",
            pauseOnFocusLoss: false,
            autoClose: 4000,
          });
          return;
        }
      }
    } catch (err) {
      toast("An error happend, please try later", {
        type: "error",
        toastId: "responseErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    }
  };
  if (typeof props.pendingList === "string") {
    return (
      <div className="w-full fixed h-full mx-auto flex flex-col items-center justify-center rounded-[3px] select-none mt-7 pl-[300px]">
        <h1 className="font-poopins text-white ml-9">{props.pendingList}</h1>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full mx-auto flex flex-col justify-center rounded-[3px] select-none mt-7 pl-[300px]">
        <ToastContainer />
        <Search setSearchTerm={setSearchTerm} />
        <h1 className="font-poopins text-[#c5c5c5] ml-9 mt-6">
          PENDING - {currPendingLength}
        </h1>
        <SimpleBar className="overflow-y-auto overflow-x-hidden h-[750px]">
          {props.pendingList
            .filter((val) => {
              if (searchTerm == "") {
                return val;
              } else if (
                val.username.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            .map((item) => {
              return (
                <div
                  className="ml-9 flex flex-col relative mt-2 hover:bg-[#555861] rounded-[4px] cursor-pointer"
                  key={item.username}
                >
                  <div className="w-full bg-[#4a4e57] h-[1px]"></div>
                  <div className="flex flex-row items-center mt-2 mb-2">
                    <p className="friend__status__main__offline">
                      <img
                        src={defaultImage}
                        alt="default image"
                        className="w-[40px] h-[40px] rounded-[100px]"
                      />
                    </p>
                    <h1 className="text-white font-poopins pl-3">
                      {item.username}
                    </h1>
                    <div className="flex relative ml-auto mr-10">
                      <Tooltip
                        title="Accept"
                        placement="top"
                        disableInteractive
                      >
                        <div
                          className="bg-[#2f3136] rounded-[50px] p-2 cursor-pointer mr-2"
                          onClick={() =>
                            handleAccept(item.userId, item.username)
                          }
                        >
                          <GoVerified color="#5eff4f" size={"30px"} />
                        </div>
                      </Tooltip>
                      <Tooltip
                        title="Decline"
                        placement="top"
                        disableInteractive
                      >
                        <div
                          className="bg-[#2f3136] rounded-[50px] p-2 cursor-pointer"
                          onClick={() => handleDecline(item.userId)}
                        >
                          <ImCancelCircle color="#ff0a0a" size={"30px"} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
        </SimpleBar>
      </div>
    );
  }
}

export default Pending;
