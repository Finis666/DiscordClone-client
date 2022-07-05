import React, { useState } from "react";
import { useEffect } from "react";
import wampusWaiting from "../../../../assets/images/default/wampusiswaiting.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
function AddFriend() {
  const [username, setUsername] = useState("");
  const [isEmpty, setIsEmpty] = useState(true); // check for submit btn
  const [requestOnProccess, setRequestOnProccess] = useState(false);
  useEffect(() => {
    if (username.length > 0) {
      setIsEmpty(false);
      return;
    } else {
      setIsEmpty(true);
      return;
    }
  }, [username]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requestOnProccess) {
      return;
    }
    if (isEmpty) return;
    if (username.length < 2) {
      toast("Username must be more then 2 charcters!", {
        type: "error",
        toastId: "usernameErr",
        pauseOnFocusLoss: false,
        autoClose: 3000,
      });
      return;
    }
    if (username.length > 32) {
      toast("Username must be less then 32 charcters!", {
        type: "error",
        toastId: "usernameErr2",
        pauseOnFocusLoss: false,
        autoClose: 3000,
      });
      return;
    }
    try {
      setRequestOnProccess(true);
      let response = await axios.post(
        "/api/friends/addFriend",
        { username: username },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data[0].success) {
        setRequestOnProccess(false);
        toast(response.data[0].msg, {
          type: "error",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
        return;
      } else {
        setRequestOnProccess(false);
        toast(response.data[0].msg, {
          type: "success",
          toastId: "responseSuccess",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
        return;
      }
    } catch (err) {
      setRequestOnProccess(false);
      toast("An error happend, please try later", {
        type: "error",
        toastId: "responseErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    }
  };
  return (
    <div className="ml-9 flex flex-col justify-center">
      <ToastContainer />
      <h1 className="text-white font-poopins font-semibold">ADD FRIEND</h1>
      <p className="font-poopins font-normal text-[#c5c5c5] text-[13px] mt-2">
        You can add friend with their Discord name. It's cAsE sEnSitIvE!
      </p>
      <form className="w-[100%] flex items-center mt-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a Username"
          maxLength={32}
          className="w-[100%] h-[45px] font-poopins bg-[#202225] text-[#555759] pl-3 rounded-[8px] relative empty:text-white"
          onChange={(e) => setUsername(e.target.value)}
        />
        {requestOnProccess ? (
          <div className="w-[140px] flex items-center justify-center h-[35px] font-poopins text-white bg-[#3d48c7] text-[12px] rounded-[5px] cursor-pointer relative right-[135px]">
            <CircularProgress />
          </div>
        ) : (
          <input
            type="submit"
            value="Send Friend Request"
            className={
              isEmpty
                ? "h-[35px] font-poopins text-[#a4a4a4] bg-[#3c438c] text-[12px] rounded-[5px] cursor-not-allowed relative right-[135px]"
                : "h-[35px] font-poopins text-white bg-[#5865f2] text-[12px] rounded-[5px] cursor-pointer relative right-[135px]"
            }
          />
        )}
      </form>
      <div className="w-full bg-[#4a4e57] h-[1px] mt-5"></div>
      <div className="mx-auto flex justify-center mt-44">
        <img src={wampusWaiting} />
      </div>
    </div>
  );
}

export default AddFriend;
