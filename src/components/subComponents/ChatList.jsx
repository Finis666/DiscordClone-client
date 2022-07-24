import React from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/images/default/default1.jpg";
function ChatList(props) {
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    navigate(`/app/chat/${id}`);
  };

  return (
    <>
      {typeof props.chats == "string" ? (
        <div className="flex flex-col justify-center items-center absolute w-full h-full">
          <p className="text-white font-poopins font-normal">
            Looks like you have no chats
          </p>
          <button
            className="font-poopins font-normal text-white bg-[#3ba55d] active:bg-[#318d4e] transition-all hover:bg-[#287942] h-10 rounded-lg w-[95%] mt-4"
            onClick={() =>
              props.setNavigation([
                { name: "Online", isOn: false },
                { name: "All", isOn: false },
                { name: "Pending", isOn: false },
                { name: "Add Friend", isOn: true },
              ])
            }
          >
            Try adding some new friends {";)"}
          </button>
        </div>
      ) : (
        props.chats.map((item) => {
          return (
            <div
              key={item.userId}
              className="flex flex-row items-center h-[50px] rounded-[3px] text-[#b0b4b9] hover:text-[#d8dce2]  hover:bg-[#555861] cursor-pointer relative"
              onClick={() => {
                handleNavigate(item.userId);
              }}
            >
              <p
                className={
                  item.active === undefined
                    ? "friend__profile__status__offline__leftslider"
                    : item.active === true
                    ? "friend__profile__status__active__leftslider"
                    : "friend__profile__status__offline__leftslider"
                }
              >
                <img
                  src={defaultImage}
                  alt="Profile avatar"
                  className="w-[40px] h-[40px] rounded-[100px] ml-2"
                />
              </p>
              <h2 className="pl-3  font-poopins text-[20px]">
                {item.username}
              </h2>
            </div>
          );
        })
      )}
    </>
  );
}

export default ChatList;
