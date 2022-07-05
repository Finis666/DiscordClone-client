import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth.redux";
import { userActions } from "../store/user.redux";
function Login() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let [errors, setErrors] = useState("");
  let [emailOrNameErr, setEmailOrNameErr] = useState("");
  let [passwordErr, setPasswordErr] = useState("");
  let [emailOrName, setEmailOrName] = useState("");
  let [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors("");
    setEmailOrNameErr("");
    setPasswordErr("");
    //checking if fields are empty
    if (emailOrName.length === 0) {
      setEmailOrNameErr(
        <span style={{ color: "#f38688" }}>
          EMAIL OR USERNAME - This field is required
        </span>
      );
    }
    if (password.length === 0) {
      setPasswordErr(
        <span style={{ color: "#f38688" }}>
          PASSWORD - This field is required
        </span>
      );
    }
    if (emailOrName.length === 0 || password.length === 0) {
      return;
    }
    // sending request to server
    try {
      let response = await axios.post("/api/users/login", {
        emailOrUsername: emailOrName,
        password: password,
      });
      if (!response.data[0].success) {
        response.data.forEach((item) => {
          setErrors(
            <span style={{ color: "#f38688", textAlign: "center" }}>
              {item.msg}
            </span>
          );
        });
      } else {
        localStorage.setItem("token", response.data[0].token);
        dispatch(authActions.login());
        dispatch(
          userActions.setUsername({
            type: "login",
            data: response.data[0].username,
          })
        );
        navigate("/app");
        return;
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };
  return (
    <div className="login__container flex">
      <div className="m-auto mb-auto w-[480px] flex flex-col pb-[30px] bg-[#36393f] rounded-[5px]">
        <div className="flex flex-col justify-center">
          <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
            Welcome back!
          </h1>
          <p className="text-center text-[#a0a3a6] font-poopins font-normal mt-[10px] text-[14px]">
            We're so excited to see you again!
          </p>
        </div>
        <div className="flex flex-col w-[90%] mx-auto mt-[20px]">
          <form className="flex flex-col" onSubmit={handleLogin}>
            {errors}
            <label
              className="font-poopins font-semibold text-[#b9bbbe] text-[13px]"
              htmlFor="emailorname"
            >
              {emailOrNameErr === "" ? "EMAIL OR USERNAME" : emailOrNameErr}
            </label>
            <input
              type="text"
              name="emailorname"
              className="bg-[#202225] h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
              value={emailOrName}
              onChange={(e) => {
                setEmailOrName(e.target.value);
              }}
            />
            <label
              className="font-poopins font-semibold text-[#b9bbbe] text-[13px] mt-[20px]"
              htmlFor="password"
            >
              {passwordErr === "" ? "PASSWORD" : passwordErr}
            </label>
            <input
              type="password"
              name="password"
              className="bg-[#202225] h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Link
              to="/"
              className="text-[#00aff4] font-poopins font-normal text-[13px] hover:underline mt-2"
            >
              Forgot your password?
            </Link>
            <input
              type="submit"
              value="Login"
              className="login__continuebtn font-poopins font-bold"
            />
          </form>
          <p className="text-[#a0a3a6] text-[12px] font-poopins font-normal mt-3">
            Need an account?{" "}
            <Link to="/register" className="text-[#00aff4] hover:underline">
              Register
            </Link>
          </p>
          <p className="text-[#b9bbbe] text-[12px] mt-[20px] font-poopins">
            Please <span className="text-red-600">DO NOT</span> insert sensetive
            information this is just a discord clone project!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
