import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../subComponents/main/components/Navbar";
import ChatSlider from "../subComponents/ChatSlider";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user.redux";
import defaultImage from "../../assets/images/default/default1.jpg";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth.redux";

const style = {
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Settings(props) {
  const currentUsername = useSelector((state) => state.user.username);
  const currentUserId = useSelector((state) => state.user.userId);
  const currentImage = useSelector((state) => state.user.image);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleCloseUsernameModal = () => setIsUsernameModalOpen(false);

  const handleUsername = (value) => {
    setUsername(value);
  };

  const handleSubmitUsernameChange = async (e) => {
    e.preventDefault();
    if (username === currentUsername) {
      toast("You haven't change anything!", {
        type: "error",
        toastId: "clientNotChangedErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
      return;
    }
    if (username.length < 2 || username.length > 15) {
      toast("Username must be between 2 and 15 in length!", {
        type: "error",
        toastId: "clientUsernameErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
      return;
    }
    try {
      const response = await axios.put(
        "/api/users/settings/changeUsername",
        { username: username },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data[0].success) {
        toast(response.data[0].msg, {
          type: "error",
          toastId: "responseErr",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
      } else {
        dispatch(
          userActions.setUsername({
            type: "validate",
            data: username,
          })
        );
        toast(response.data[0].msg, {
          type: "success",
          toastId: "responseSuccess",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
      }
    } catch (err) {
      toast("Somthing went wrong", {
        type: "error",
        toastId: "requestErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    }
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmitNewImage = async (e) => {
    e.preventDefault();
    if (fileName.length === "0") {
      toast("Please choose an image before submit.", {
        type: "error",
        toastId: "clientErrImage",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.patch(
        "api/users/settings/upload/image",
        formData,
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (!response.data.success) {
        toast(response.data.msg, {
          type: "error",
          toastId: "requestErrImage",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
      } else {
        dispatch(
          userActions.setImage({
            type: "image",
            data: response.data.image,
          })
        );
        toast(response.data.msg, {
          type: "success",
          toastId: "successImage",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <ToastContainer />

      <ChatSlider
        chats={props.chats}
        username={props.username}
        pendingList={props.pendingList}
        setNavigation={props.setNavigation}
      />

      <div className="lg:hidden block">
        <Navbar
          navigation={props.navigation}
          setNavigation={props.setNavigation}
        />
      </div>

      <div className="w-full relative mx-auto flex flex-col justify-center mt-[70px] lg:mt-0 lg:pl-[300px] overflow-hidden">
        <h1 className="text-white text-[25px] font-poopins font-semibold ml-5 mt-5">
          User Settings
        </h1>
        <div className="flex flex-col mx-auto mt-14 w-[90%] h-[500px]">
          <div className="flex flex-col justify-center">
            <h2 className="font-poopins font-semibold text-[#cccccc]">
              USERNAME
            </h2>
            <div className="flex justify-between">
              <span className="font-poopins text-white">{currentUsername}</span>
              <button
                onClick={() => {
                  setIsUsernameModalOpen(true);
                }}
                className="w-[80px] rounded-[3px] h-[30px] bg-[#7a7a7a] text-white font-poopins"
              >
                Edit
              </button>
            </div>
            <Modal
              open={isUsernameModalOpen}
              onClose={handleCloseUsernameModal}
            >
              <Box
                className="absolute top-[50%] left-[50%] w-[800px]"
                sx={style}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  component="h2"
                  className="font-poopins font-semibold"
                >
                  Edit User
                </Typography>
                <form
                  className="flex items-center"
                  onSubmit={handleSubmitUsernameChange}
                  enctype="multipart/form-data"
                >
                  <TextField
                    id="filled-basic"
                    label="Username"
                    variant="filled"
                    value={username}
                    onChange={(e) => {
                      handleUsername(e.target.value);
                    }}
                  />
                  <Button variant="contained" color="success" type="submit">
                    Submit changes
                  </Button>
                </form>
              </Box>
            </Modal>
            <hr />
          </div>
          <div className="flex flex-col justify-center mt-10">
            <h2 className="font-poopins font-semibold text-[#cccccc]">
              AVATAR
            </h2>
            <div className="flex justify-between">
              <img
                src={
                  !currentImage
                    ? defaultImage
                    : `${process.env.REACT_APP_SERVER}/cdn/images/${currentImage}`
                }
                width="100px"
                className="rounded-full"
                alt="Profile Image"
              />
              <form onSubmit={handleSubmitNewImage} className="flex">
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={saveFile}
                  name="image"
                  id="image"
                  className="w-[80px] rounded-[3px] h-[30px] text-white font-poopins"
                />
                <button
                  type="submit"
                  className="w-[80px] rounded-[3px] h-[30px] bg-[#7a7a7a] text-white font-poopins"
                >
                  Submit
                </button>
              </form>
            </div>
            <hr />
          </div>
          <div className="flex justify-between mt-10">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                dispatch(authActions.logout());
                props.socket?.emit("disconnect-user", {
                  userId: currentUserId,
                });
                navigate("/login");
              }}
              className="font-poopins transition-all hover:bg-[#d61935] bg-[#ff0026] rounded-[4px] p-4 font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
