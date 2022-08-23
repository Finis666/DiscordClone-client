import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isRequestDone, setIsRequestDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      setError("Email field is required");
    }
    setProgress(true);
    try {
      const res = await axios.post("/api/users/forgot-password", {
        email: email,
      });
      if (!res.data[0].success) {
        setProgress(false);
        setError(res.data[0].msg);
        return;
      }
      setIsRequestDone(true);
    } catch (err) {
      setProgress(false);
      setError("somthing went wrong");
    }
  };

  return (
    <>
      {!isRequestDone ? (
        <div className="login__container flex overflow-auto">
          <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
                Forgot password
              </h1>
              <p className="text-center text-[#a0a3a6] font-poopins font-normal mt-[10px] text-[14px]">
                Oh looks like you need password recovery {":("}
              </p>
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#202225] font-poopins h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
                />
                <Link
                  to="/login"
                  className="text-[#00aff4] font-poopins font-normal text-[13px] hover:underline mt-2"
                >
                  Login
                </Link>
                {progress ? (
                  <div className="register__continuebtn font-poopins font-bold flex items-center justify-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <input
                    type="submit"
                    value="Continue"
                    className="login__continuebtn font-poopins font-bold"
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
      ) : (
        <div className="login__container flex overflow-auto">
          <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
                Email sent!
              </h1>
              <p className="text-center text-[#a0a3a6] font-poopins font-normal mt-[10px] text-[14px]">
                An email with the link to reset your password has been sent to{" "}
                {email}
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
    </>
  );
}
