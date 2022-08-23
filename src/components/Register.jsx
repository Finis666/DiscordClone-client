import React, { useState } from "react";
import "../css/register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth.redux";
import { userActions } from "../store/user.redux";
import axios from "axios";
import { CircularProgress } from "@mui/material";
function Register() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState("");
  const [usernameErrors, setUsernameErrors] = useState("");
  const [passwordErrors, setPasswordErrors] = useState("");
  const [requestOnProccess, setRequestOnProccess] = useState(false);
  let handleRegister = async (e) => {
    e.preventDefault();
    if (requestOnProccess) {
      return;
    }
    setEmailErrors("");
    setUsernameErrors("");
    setPasswordErrors("");
    //checking if fields are empty
    if (email.length == 0) {
      setEmailErrors(
        <span style={{ color: "#f38688" }}>EMAIL - This field is required</span>
      );
    }
    if (username.length == 0) {
      setUsernameErrors(
        <span style={{ color: "#f38688" }}>
          USERNAME - This field is required
        </span>
      );
    }
    if (password.length == 0) {
      setPasswordErrors(
        <span style={{ color: "#f38688" }}>
          PASSWORD - This field is required
        </span>
      );
    }
    if (email.length == 0 || username.length == 0 || password.length == 0) {
      return;
    }
    // validate password
    let passwordValidation = String(password).match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=(.*[\d]){4,})(?=.*?[#?!@$%^&*-]).{8,}$/
    );
    if (passwordValidation === null) {
      setPasswordErrors(
        <span style={{ color: "#f38688" }}>
          PASSWORD - Minimum eight charcters. one upper case letter at least,
          one lower case letter at least, four digit at least, one special
          character at least
        </span>
      );
      return;
    }
    try {
      setRequestOnProccess(true);
      let response = await axios.post("/api/users/register", {
        email: email,
        username: username,
        password: password,
      });
      // checking for errors
      if (!response.data[0].success) {
        setRequestOnProccess(false);
        response.data.forEach((item) => {
          if (item.field == "email") {
            setEmailErrors(
              <span style={{ color: "#f38688" }}>{item.msg}</span>
            );
          }
          if (item.field == "username") {
            setUsernameErrors(
              <span style={{ color: "#f38688" }}>{item.msg}</span>
            );
          }
          if (item.field == "password") {
            setPasswordErrors(
              <span style={{ color: "#f38688" }}>{item.msg}</span>
            );
          }
        });
      } else {
        localStorage.setItem("token", response.data[0].token);
        dispatch(authActions.login());
        dispatch(
          userActions.setUsername({
            type: "register",
            data: response.data[0].username,
          })
        );
        dispatch(
          userActions.setUserId({
            type: "register",
            data: response.data[0].userId,
          })
        );
        if (response.data[0].isAdmin) {
          console.log("yas");
          dispatch(
            userActions.setIsAdmim({
              type: "register",
              data: true,
            })
          );
        } else {
          dispatch(
            userActions.setIsAdmim({
              type: "register",
              data: false,
            })
          );
        }
        navigate("/app");
        return;
      }
    } catch (err) {
      setRequestOnProccess(false);
    }
  };
  return (
    <div className="register__container flex overflow-auto">
      <div className="m-auto mb-auto w-[480px] flex flex-col pb-[40px] bg-[#36393f] rounded-[5px]">
        <h1 className="text-center text-[#FFFFFF] font-poopins font-bold mt-[30px] text-[25px]">
          Create an account
        </h1>
        <div className="flex flex-col w-[90%] mx-auto mt-[20px]">
          <form className="flex flex-col" onSubmit={handleRegister}>
            <label
              className="font-poopins font-semibold text-[#b9bbbe] text-[13px]"
              htmlFor="email"
            >
              {emailErrors === "" ? "EMAIL" : emailErrors}
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#202225] h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
            />
            <label
              className="font-poopins font-semibold text-[#b9bbbe] text-[13px] mt-[20px]"
              htmlFor="username"
            >
              {usernameErrors === "" ? "USERNAME" : usernameErrors}
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#202225] h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
            />
            <label
              className="font-poopins font-semibold text-[#b9bbbe] text-[13px] mt-[20px]"
              htmlFor="password"
            >
              {passwordErrors === "" ? "PASSWORD" : passwordErrors}
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#202225] h-[40px] rounded-[5px] mt-[5px] outline-none text-[#FFFFFF] pl-2"
            />
            {requestOnProccess ? (
              <div className="register__continuebtn font-poopins font-bold flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : (
              <input
                type="submit"
                value="Continue"
                className="register__continuebtn font-poopins font-bold"
              />
            )}
          </form>
          <div className="flex flex-col mt-[10px]">
            <Link
              to="/login"
              className="text-[#00aff4] font-poopins font-normal text-[13px] hover:underline"
            >
              Already have an account?
            </Link>
            <p className="text-[#b9bbbe] text-[12px] mt-[20px] font-poopins">
              Please <span className="text-red-600">DO NOT</span> insert
              sensetive information this is just a discord clone project!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
