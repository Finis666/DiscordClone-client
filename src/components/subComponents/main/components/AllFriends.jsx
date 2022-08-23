import React, { useState, useEffect } from "react";
import Search from "./Search";
import { AiFillMessage } from "react-icons/ai";
import defaultImage from "../../../../assets/images/default/default1.jpg";
import Tooltip from "@mui/material/Tooltip";
import SimpleBar from "simplebar-react";
import { useNavigate } from "react-router-dom";
function AllFriends(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currFriendsLength, setCurrFriendsLength] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof props.friendsList === "string") {
      return;
    }
    let filterFriendsCount = props.friendsList.filter((item) => {
      if (searchTerm == "") {
        return item;
      } else if (
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return item;
      }
    });
    setCurrFriendsLength(filterFriendsCount.length);
  }, [searchTerm]);

  const handleNavigate = (id) => {
    navigate(`/app/chat/${id}`);
  };
  return (
    <>
      {typeof props.friendsList === "string" ? (
        <div className="w-full fixed h-full mx-auto flex flex-col items-center justify-center rounded-[3px] select-none mt-7 lg:pl-[300px]">
          <h1 className="font-poopins text-white">{props.friendsList}</h1>
        </div>
      ) : (
        <div className="w-full h-full mx-auto flex flex-col justify-center rounded-[3px] select-none mt-[70px] lg:mt-7 lg:pl-[300px]">
          <Search setSearchTerm={setSearchTerm} />
          <h1 className="font-poopins text-[#c5c5c5] ml-9 mt-6">
            ALL FRIENDS - {currFriendsLength}
          </h1>
          <SimpleBar className="overflow-y-auto overflow-x-hidden h-[750px]">
            {props.friendsList
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
                      <p
                        className={
                          item.active === undefined
                            ? "friend__status__main__offline"
                            : item.active === true
                            ? "friend__status__main__online"
                            : "friend__status__main__offline"
                        }
                      >
                        <img
                          src={
                            !item.image
                              ? defaultImage
                              : `${process.env.REACT_APP_SERVER}/cdn/images/${item.image}`
                          }
                          alt="default image"
                          className="w-[40px] h-[40px] rounded-[100px]"
                        />
                      </p>
                      <h1 className="text-white font-poopins pl-3">
                        {item.username}
                      </h1>
                      <div className="flex relative ml-auto mr-10">
                        <Tooltip
                          title="Message"
                          placement="top"
                          disableInteractive
                        >
                          <div
                            className="bg-[#2f3136] rounded-[50px] p-2 cursor-pointer"
                            onClick={() => {
                              handleNavigate(item.userId);
                            }}
                          >
                            <AiFillMessage color="#b9bbbe" size={"30px"} />
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
          </SimpleBar>
        </div>
      )}
    </>
  );
}

export default AllFriends;
