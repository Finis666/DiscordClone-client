import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import loadingGif from "../../assets/brand/loading-discord.gif";
import { ToastContainer, toast } from "react-toastify";
import ConversationNotFound from "./ConversationNotFound";
import { useNavigate, useParams } from "react-router-dom";
import ChatSlider from "../subComponents/ChatSlider";
import defaultImage from "../../assets/images/default/default1.jpg";
import SimpleBar from "simplebar-react";
import MessageInput from "./MessageInput";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

function Chat(props) {
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reqError, setReqError] = useState(null);
  const isMount = useRef(false);
  const lastConversationId = useRef(null);
  const navigate = useNavigate();
  const [friendProfile, setFriendProfile] = useState({});
  const scrollableNodeRef = React.createRef();
  const { conversationId } = useParams();
  const userImage = useSelector((state) => state.user.image);
  useEffect(() => {
    if (lastConversationId.current !== props.conversationId) {
      isMount.current = false;
      setLoading(true);
      setReqError(null);
      setMessages([]);
      if (!isMount.current) {
        if (typeof props.chatList !== "string") {
          props.chatList.forEach((item) => {
            if (item.userId === props.conversationId) {
              setFriendProfile({
                username: item.username,
                userId: item.userId,
                profileImage: item.image,
              });
            }
          });
        }
        lastConversationId.current = props.conversationId;
        const controller = new AbortController();
        let fetchConversation = async () => {
          try {
            let response = await axios.get(
              `/api/conversations/${props.conversationId}`,
              {
                signal: controller.signal,
                headers: { "x-auth-token": localStorage.getItem("token") },
              }
            );
            if (!response.data[0].success) {
              setLoading(false);
              setReqError(true);
              toast(response.data[0].msg, {
                type: "error",
                toastId: "responseErr",
                pauseOnFocusLoss: false,
                autoClose: 10000,
              });
              setTimeout(() => {
                navigate("/app");
              }, 11000);
              return;
            } else {
              setReqError(false);
              setLoading(false);
              if (typeof response.data[0].msg === "string") {
                setMessages(false);
                toast("There is no messages yet, try sending hey!", {
                  type: "success",
                  toastId: "successMsgChat",
                  pauseOnHover: false,
                  pauseOnFocusLoss: false,
                  autoClose: 10000,
                });
              } else {
                setMessages(response.data[0].msg);
              }
            }
          } catch (err) {
            setLoading(false);
            setReqError(true);
            controller.abort();
          }
        };
        fetchConversation();
        return () => {
          isMount.current = true;
        };
      }
    }
  }, [props.conversationId]);

  useEffect(() => {
    props.socket?.on("new_message_get", (data) => {
      if (conversationId !== data.userId) {
        return;
      }
      if (messages === false) {
        setMessages([
          {
            username: data.username,
            sender: data.userId,
            image: data.image,
            text: data.text,
          },
        ]);
      } else {
        setMessages((oldMessages) => {
          return [
            ...oldMessages,
            {
              username: data.username,
              sender: data.userId,
              image: data.image,
              text: data.text,
            },
          ];
        });
      }
    });
    return () => {
      props.socket?.off("new_message_get");
    };
  });

  // handling scroll to bottom in text area
  useEffect(() => {
    if (messages !== false) {
      const contentHeight = scrollableNodeRef.current?.scrollHeight;
      scrollableNodeRef.current?.scrollTo({
        top: contentHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex flex-col">
      <ToastContainer />
      <ChatSlider
        chats={props.chatList}
        username={props.username}
        pendingList={props.pendingList}
        setNavigation={props.setNavigation}
      />
      {loading && (
        <div className="w-full lg:pl-[300px] fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      )}
      {!loading && reqError === true ? (
        <>
          <ConversationNotFound />
        </>
      ) : (
        reqError === false && (
          <div className="w-full relative h-[100vh] mx-auto flex flex-col justify-center lg:pl-[300px] overflow-hidden">
            {/* header */}
            <div className="w-full fixed top-0 h-[50px] items-center border-b-[2px black] flex z-10 bg-[#36393f]">
              <div className="flex items-center justify-between w-full">
                <div className="flex justify-start pl-5">
                  <h1 className="text-white font-poopins font-semibold">
                    @ {friendProfile.username}
                  </h1>
                </div>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    navigate("/app");
                  }}
                >
                  Go back
                </Button>
              </div>
              <div className="w-full h-[2px] fixed top-11 bg-black"></div>
            </div>
            {/* end of header */}
            {/*  messages */}
            <SimpleBar
              scrollableNodeProps={{ ref: scrollableNodeRef }}
              className="flex h-[88vh] pb-[2vh] flex-col items-start justify-center pl-5 mt-12 pt-10 overflow-x-hidden overflow-y-auto"
            >
              <img
                src={
                  !friendProfile.profileImage
                    ? defaultImage
                    : `${process.env.REACT_APP_SERVER}/cdn/images/${friendProfile.profileImage}`
                }
                width="70px"
                height="70px"
                className="rounded-full"
              />
              <h1 className="text-white font-poopins font-semibold text-[25px]">
                {friendProfile.username}
              </h1>
              <p className="font-poopins text-[#b0b4b9] font-normal">
                This is the beginning of your direct message history with{" "}
                <span className="font-semibold">@{friendProfile.username}</span>
              </p>
              <div className="w-full h-[1px] bg-[#545455] mt-5"></div>
              {/* end of system message */}
              {messages !== false && (
                <React.Fragment>
                  {messages.map((msg, index) => {
                    if (msg.sender === friendProfile.userId) {
                      return (
                        <div className="flex items-start pl-5 mt-4" key={index}>
                          <div className="shrink-0 select-none">
                            <img
                              src={
                                !friendProfile.profileImage
                                  ? defaultImage
                                  : `${process.env.REACT_APP_SERVER}/cdn/images/${friendProfile.profileImage}`
                              }
                              width="50px"
                              height="50px"
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex flex-col items-start pl-3">
                            <p className="text-white font-poopins font-semibold">
                              {friendProfile.username}
                            </p>
                            <p
                              className="text-[#e2e2e2] font-poopins font-normal"
                              style={{ wordBreak: "break-word" }}
                            >
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="flex items-center pl-5 mt-4"
                          key={index}
                        >
                          <div className="shrink-0 select-none">
                            <img
                              src={
                                !userImage
                                  ? defaultImage
                                  : `${process.env.REACT_APP_SERVER}/cdn/images/${userImage}`
                              }
                              width="50px"
                              className="rounded-full"
                              height="50px"
                            />
                          </div>
                          <div className="flex flex-col items-start pl-3">
                            <p className="text-white font-poopins font-semibold">
                              {props.username}
                            </p>
                            <p
                              className="text-[#e2e2e2] font-poopins font-normal break-all"
                              style={{ wordBreak: "break-word" }}
                            >
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </React.Fragment>
              )}
            </SimpleBar>
            {/* input to send messages */}
            <MessageInput
              username={friendProfile.username}
              userId={friendProfile.userId}
              conversationId={props.conversationId}
              setMessages={setMessages}
              messages={messages}
              socket={props.socket}
            />
          </div>
        )
      )}
    </div>
  );
}

export default Chat;
