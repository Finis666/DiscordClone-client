import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth.redux";
import { userActions } from "../store/user.redux";
import loadingGif from "../assets/brand/loading-discord.gif";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const ProtectedRoute = () => {
  document.body.style.backgroundColor = "#36393f";
  const dispatch = useDispatch();
  const [isRequestDone, setIsRequestDone] = useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const isToken = useRef(false);
  const isMount = useRef(false);
  useEffect(() => {
    if (!isToken.current) {
      if (!localStorage.getItem("token")) {
        return () => {
          setIsRequestDone(false);
          setInitialRender(true);
          isToken.current = false;
        };
      }
      return () => {
        setIsRequestDone(false);
        isToken.current = true;
        setInitialRender(false);
      };
    }
  }, []);
  useEffect(() => {
    if (!isMount.current && isToken.current) {
      const fetchToken = async () => {
        const controller = new AbortController();
        try {
          const response = await axios.get("/api/users/validateToken", {
            signal: controller.signal,
            headers: { "x-auth-token": localStorage.getItem("token") },
          });
          if (response.data.success) {
            if (!response.data.isAdmin) {
              setIsRequestDone(false);
              isMount.current = true;
              setInitialRender(true);
              return;
            }
            dispatch(authActions.login());
            dispatch(
              userActions.setUsername({
                type: "validate",
                data: response.data.username,
              })
            );
            dispatch(
              userActions.setUserId({
                type: "validate",
                data: response.data.userId,
              })
            );
            dispatch(
              userActions.setIsAdmim({
                type: "validate",
                data: response.data.isAdmin,
              })
            );
            setIsRequestDone(true);
            return;
          } else {
            localStorage.removeItem("token");
            setIsRequestDone(false);
            return;
          }
        } catch {
          controller.abort();
        }
      };
      fetchToken();
      return () => {
        isMount.current = true;
        setInitialRender(true);
      };
    }
  }, [isToken.current]);

  if (initialRender === true) {
    return isRequestDone ? <Outlet /> : <Navigate to="/app" />;
  } else {
    return (
      <div className="w-full fixed h-full flex justify-center items-center">
        <img src={loadingGif} className="w-[300px] h-[300px]" />
      </div>
    );
  }
};

export default ProtectedRoute;