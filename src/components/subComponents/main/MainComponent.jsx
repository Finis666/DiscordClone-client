import React, { useState } from "react";
import AllFriends from "./components/AllFriends";
import Navbar from "./components/Navbar";
import "../../../css/MainComponent.css";
import Pending from "./components/Pending";
import AddFriend from "./components/AddFriend";
import Online from "./components/Online";
function MainComponent(props) {
  return (
    <div className="flex flex-col">
      <Navbar
        navigation={props.navigation}
        setNavigation={props.setNavigation}
      />
      {props.navigation.map((item) => {
        if (item.isOn && item.name === "All") {
          return (
            <React.Fragment key={item.name}>
              <AllFriends friendsList={props.friendsList} />
            </React.Fragment>
          );
        } else if (item.isOn && item.name === "Pending") {
          return (
            <React.Fragment key={item.name}>
              <Pending
                pendingList={props.pendingList}
                setPendingList={props.setPendingList}
                friendsList={props.friendsList}
                setFriendsList={props.setFriendsList}
                chats={props.chats}
                setChats={props.setChats}
                socket={props.socket}
              />
              ;
            </React.Fragment>
          );
        } else if (item.isOn && item.name === "Add Friend") {
          return (
            <div
              className="w-full h-full mx-auto flex flex-col justify-center rounded-[3px] select-none mt-[70px] lg:mt-7 lg:pl-[300px]"
              key={item.name}
            >
              <AddFriend socket={props.socket} />
            </div>
          );
        } else if (item.isOn && item.name === "Online") {
          return (
            <React.Fragment key={item.name}>
              <Online friendsList={props.friendsList} />
            </React.Fragment>
          );
        }
      })}
    </div>
  );
}

export default MainComponent;
