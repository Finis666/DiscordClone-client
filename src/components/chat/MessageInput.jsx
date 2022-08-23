import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
function MessageInput(props) {
  const [isEmojiOn, setIsEmojiOn] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);
  const userImage = useSelector((state) => state.user.image);

  const handleOpenEmojiTab = () => {
    setIsEmojiOn(true);
  };
  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };
  const handleCloseEmojiTab = () => {
    setIsEmojiOn(false);
  };
  const handleSendMsg = async (e) => {
    if (e.key === "Enter") {
      if (isLoading) {
        return;
      }
      if (text.length < 1) {
        return;
      }
      if (text.length > 120) {
        toast("Must be less then 120 letters!", {
          type: "error",
          autoClose: 5000,
          toastId: "textlongerr",
        });
        return;
      }
      setIsLoading(true);
      setText("");
      const response = await axios.post(
        `/api/conversations/${props.conversationId}`,
        { message: text },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data[0].success) {
        toast(response.data[0].msg, {
          type: "error",
          toastId: "errorChat",
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          autoClose: 10000,
        });
        setIsLoading(false);
        return;
      }
      if (props.messages === false) {
        props.setMessages([response.data[0].msg]);
        props.socket?.emit("new_message", {
          username: username,
          userId: userId,
          image: userImage,
          text: response.data[0].msg.text,
          friendId: props.userId,
        });
        setIsLoading(false);
        return;
      }
      props.setMessages([...props.messages, response.data[0].msg]);
      props.socket?.emit("new_message", {
        username: username,
        userId: userId,
        image: userImage,
        text: response.data[0].msg.text,
        friendId: props.userId,
      });
      setIsLoading(false);
    }
  };
  return (
    <div className="pl-5 w-[100%] flex items-center mb-[15px] bg-[#36393f]">
      <input
        type="text"
        placeholder={`Message ${props.username}`}
        className="w-[95%] shrink bg-[#40444b] text-white font-poopins pl-3 rounded-[5px] h-[45px] outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSendMsg}
      />
      {!isEmojiOn ? (
        <div
          onClick={handleOpenEmojiTab}
          className="cursor-pointer absolute p-[10px] right-0 pr-[6%]"
        >
          <HiOutlineEmojiHappy color="#ffffff" fontSize={"30px"} />
        </div>
      ) : (
        <>
          <div
            onClick={handleCloseEmojiTab}
            className="cursor-pointer absolute p-[10px] right-0 pr-[6%]"
          >
            <IoClose color="#ffffff" fontSize={"30px"} />
          </div>
          <div className="absolute right-0 pr-[4%] p-[10px] mb-[380px]">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        </>
      )}
    </div>
  );
}

export default MessageInput;
