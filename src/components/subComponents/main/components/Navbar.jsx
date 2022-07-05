import React from "react";
import { FaUserFriends } from "react-icons/fa";

function Navbar(props) {
  const handleSetNavOn = (data) => {
    let newNav = props.navigation.filter((item) => {
      if (item.name === data) {
        item.isOn = true;
      } else {
        item.isOn = false;
      }
      return item;
    });
    props.setNavigation(newNav);
  };
  return (
    <div className="w-full h-7 mx-auto flex items-center rounded-[3px] select-none mt-2 pl-[300px]">
      <div className="flex items-center">
        <FaUserFriends color="#b0b4b9" fontSize={"30px"} className="ml-5" />
        <h2 className="font-poopins font-semibold text-white pl-3">Friends</h2>
      </div>
      <div className="flex items-center ml-5">
        {props.navigation.map((item) => {
          return (
            <React.Fragment key={item.name}>
              {item.name !== "Add Friend" ? (
                <div
                  key={item.name}
                  className={
                    item.isOn
                      ? "bg-[#454950] p-1 rounded-[4px] cursor-pointer ml-6"
                      : "p-1 rounded-[4px] cursor-pointer ml-6"
                  }
                  onClick={() => handleSetNavOn(item.name)}
                >
                  <h2
                    className={
                      item.isOn
                        ? "text-[#ffffff] font-poopins font-normal"
                        : "text-[#c5c5c5] font-poopins font-normal"
                    }
                  >
                    {item.name}
                  </h2>
                </div>
              ) : (
                <div
                  className={
                    item.isOn
                      ? "bg-transparent text-[#3ba55d] p-1 rounded-[4px] cursor-pointer ml-6"
                      : "bg-[#3ba55d] text-[#ffffff] p-1 rounded-[4px] cursor-pointer ml-6"
                  }
                  onClick={() => handleSetNavOn(item.name)}
                >
                  <h2 className=" font-poopins font-normal">{item.name}</h2>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Navbar;
