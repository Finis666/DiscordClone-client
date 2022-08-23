import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import loadingGif from "../assets/brand/loading-discord.gif";
import { toast, ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";

export default function ResetPassword() {
  const navigate = useNavigate();
  const isMount = useRef(false);
  const [isLinkValid, setIsLinkValid] = useState(null);
  const { id, token } = useParams();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [progress, isProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length === 0) {
      setError("Field is required");
      return;
    }
    isProgress(true);
    try {
      const res = await axios.post(`/api/users/reset-password/${id}/${token}`, {
        password: password,
      });
      if (!res.data[0].success) {
        setError(res.data[0].msg);
        isProgress(false);

        return;
      }
      toast("Password reset successfully!", {
        type: "success",
        toastId: "success",
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      isProgress(false);

      setError("somthing went wrong");
    }
  };

  useEffect(() => {
    if (!isMount.current) {
      const validateLink = async () => {
        try {
          const response = await axios.get(
            `/api/users/reset-password/${id}/${token}`
          );
          if (!response.data[0].success) {
            isMount.current = true;
            setIsLinkValid(false);
            return;
          }
          setIsLinkValid(true);
        } catch (err) {
          isMount.current = true;
          return;
        }
      };
      validateLink();
    }
  }, []);
  return (
    <>
      <ToastContainer />
      {isLinkValid === null && (
        <div className="w-full fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      )}

      {isLinkValid === false && (
        <div className="login__container flex overflow-auto">
          <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
                Invalid
              </h1>
              <p className="text-center text-[#a0a3a6] font-poopins font-normal mt-[10px] text-[14px]">
                Link is expired or invalid
              </p>
            </div>
            <div className="flex flex-col w-[90%] mx-auto mt-[20px]">
              <p className="text-[#a0a3a6] text-[12px] font-poopins font-normal mt-3">
                Need an account?{" "}
                <Link to="/register" className="text-[#00aff4] hover:underline">
                  Register
                </Link>
              </p>
              <p className="text-[#b9bbbe] text-[12px] mt-[20px] font-poopins">
                Please <span className="text-red-600">DO NOT</span> insert
                sensetive information this is just a discord clone project!
              </p>
            </div>
          </div>
        </div>
      )}

      {isLinkValid && (
        <div className="login__container flex overflow-auto">
          <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
                Reset Password
              </h1>
              {error !== null && (
                <span className="text-[#f38688] text-center">{error}</span>
              )}
            </div>
            <div className="flex flex-col w-[90%] mx-auto mt-[20px]">
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <label
                  className="font-poopins font-semibold text-[#b9bbbe] text-[13px]"
                  htmlFor="email"
                >
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className="bg-[#202225] font-poopins h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
                />
                {progress ? (
                  <div className="register__continuebtn font-poopins font-bold flex items-center justify-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <input
                    type="submit"
                    value="Reset"
                    className={"login__continuebtn font-poopins font-bold"}
                  />
                )}
              </form>
              <p className="text-[#a0a3a6] text-[12px] font-poopins font-normal mt-3">
                Need an account?{" "}
                <Link to="/register" className="text-[#00aff4] hover:underline">
                  Register
                </Link>
              </p>
              <p className="text-[#b9bbbe] text-[12px] mt-[20px] font-poopins">
                Please <span className="text-red-600">DO NOT</span> insert
                sensetive information this is just a discord clone project!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
