import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";

function Navbar(props) {
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSetNavOn = (data) => {
    let newNav = props.navigation.filter((item) => {
      if (item.name === data) {
        item.isOn = true;
      } else {
        item.isOn = false;
      }
      return item;
    });
    navigate("/app");
    setIsNavOpen(false);
    props.setNavigation(newNav);
  };
  return (
    <>
      {!isNavOpen && (
        <div
          className="2sm:hidden flex flex-col justify-center ml-[10px] mt-[10px] cursor-pointer"
          onClick={() => {
            setIsNavOpen(true);
          }}
        >
          <div className="h-[4px] w-[35px] bg-white"></div>
          <div className="h-[4px] w-[35px] bg-white mt-[5px]"></div>
          <div className="h-[4px] w-[35px] bg-white mt-[5px]"></div>
        </div>
      )}
      {isNavOpen && (
        <div className="z-20 flex flex-col justify-center items-center absolute h-full bg-[#36393f] w-full">
          {props.navigation.map((item) => {
            return (
              <React.Fragment key={item.name}>
                {item.name !== "Add Friend" ? (
                  <div
                    key={item.name}
                    className={
                      item.isOn
                        ? "bg-[#454950] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
                        : "p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
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
                        ? "bg-transparent text-[#3ba55d] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
                        : "bg-[#3ba55d] text-[#ffffff] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
                    }
                    onClick={() => handleSetNavOn(item.name)}
                  >
                    <h2 className=" font-poopins font-normal">{item.name}</h2>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {isAdmin && (
            <Link
              to="/app/admin"
              className="p-1 rounded-[4px] lg:hidden cursor-pointer mt-5 flex items-center justify-center z-10 mx-auto"
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
          <Link
            to="/app/settings"
            className="p-1 rounded-[4px] cursor-pointer flex items-center justify-center z-10 mx-auto"
          >
            <IoMdSettings color="#ffffff" fontSize={"25px"} className="ml-5" />
            <h2 className="font-poopins font-semibold text-[#ffffff] ml-4">
              Settings
            </h2>
          </Link>
        </div>
      )}
      <div className="w-full h-7 mx-auto hidden justify-center rounded-[3px] select-none mt-2 2sm:flex lg:justify-start lg:pl-[300px]">
        <div className="flex items-center">
          <FaUserFriends color="#b0b4b9" fontSize={"30px"} className="ml-5" />
          <h2 className="font-poopins font-semibold text-white pl-3">
            Friends
          </h2>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center ml-5">
            {props.navigation.map((item) => {
              return (
                <React.Fragment key={item.name}>
                  {item.name !== "Add Friend" ? (
                    <div
                      key={item.name}
                      className={
                        item.isOn
                          ? "bg-[#454950] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
                          : "p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
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
                          ? "bg-transparent text-[#3ba55d] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
                          : "bg-[#3ba55d] text-[#ffffff] p-1 rounded-[4px] cursor-pointer 2sm:ml-4 sm:ml-6"
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
          <div className="flex justify-center items-center lg:hidden">
            {isAdmin && (
              <Link
                to="/app/admin"
                className="p-1 rounded-[4px] cursor-pointer flex items-center justify-center z-10 mx-auto"
              >
                <MdOutlineAdminPanelSettings
                  color="#ffffff"
                  fontSize={"25px"}
                  className="ml-5"
                />
                <h2 className="font-poopins font-semibold text-[#ffffff] ml-4">
                  Admin Dashboard
                </h2>
              </Link>
            )}
            <Link
              to="/app/settings"
              className="p-1 rounded-[4px] cursor-pointer flex items-center justify-center z-10 mx-auto"
            >
              <IoMdSettings
                color="#ffffff"
                fontSize={"25px"}
                className="ml-5"
              />
              <h2 className="font-poopins font-semibold text-[#ffffff] ml-4">
                Settings
              </h2>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
