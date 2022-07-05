import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth.redux";
import { userActions } from "../store/user.redux";
import loadingGif from "../assets/brand/loading-discord.gif";
import axios from "axios";

const ProtectedRoute = () => {
  document.body.style.backgroundColor = "#36393f";
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const username = useSelector((state) => state.user.username);
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const checkIfLoggedIn = async () => {
    if (loggedIn && username !== "") {
      setSuccess(true);
      return;
    }
    if (!loggedIn && !localStorage.getItem("token")) {
      setSuccess(false);
      return;
    }
    const controller = new AbortController();
    try {
      axios
        .get("/api/users/validateToken", {
          signal: controller.signal,
          headers: { "x-auth-token": localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            dispatch(authActions.login());
            dispatch(
              userActions.setUsername({
                type: "validate",
                data: response.data.username,
              })
            );
            setSuccess(true);
            return;
          } else {
            localStorage.removeItem("token");
            setSuccess(false);
            return;
          }
        })
        .catch((err) => {
          controller.abort();
        });
    } catch (err) {
      controller.abort();
    }
  };
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      checkIfLoggedIn();
    }
  }, [isInitialRender]);
  {
    if (success !== "") {
      return success ? <Outlet /> : <Navigate to="/login" />;
    } else {
      return (
        <div className="w-full fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      );
    }
  }
};

export default ProtectedRoute;
