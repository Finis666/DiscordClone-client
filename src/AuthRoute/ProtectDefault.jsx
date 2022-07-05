import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth.redux";
import loadingGif from "../assets/brand/loading-discord.gif";

import axios from "axios";

const ProtectedRoute = () => {
  document.body.style.backgroundColor = "#36393f";

  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const checkIfLoggedIn = () => {
    if (loggedIn) {
      setSuccess(true);
      return;
    }
    if (!loggedIn) {
      if (!localStorage.getItem("token")) {
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
              setSuccess(true);
              dispatch(authActions.login());
              return;
            } else {
              setSuccess(false);
              localStorage.removeItem("token");
              return;
            }
          })
          .catch((err) => {
            controller.abort();
          });
      } catch (err) {
        controller.abort();
      }
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
      return success ? <Navigate to="/app" /> : <Outlet />;
    } else {
      return (
        <>
          <div className="w-full fixed h-full flex justify-center items-center">
            <img src={loadingGif} className="w-[300px] h-[300px]" />
          </div>
        </>
      );
    }
  }
};

export default ProtectedRoute;
