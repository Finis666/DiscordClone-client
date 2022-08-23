import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import ChatSlider from "../subComponents/ChatSlider";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loadingGif from "../../assets/brand/loading-discord.gif";
import { userActions } from "../../store/user.redux";
import useFetch from "../../hooks/useFetch";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Navbar from "../subComponents/main/components/Navbar";

const style = {
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Admin(props) {
  const userId = useSelector((state) => state.user.userId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchIsAdmin = useFetch("/api/users/me");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [secondLoading, setSecondLoading] = useState(true);
  const [currentUserEditing, setCurrentUserEditing] = useState([]);
  const [userEditingRole, setUserEditingRole] = useState("");

  const fetchUsers = async (page) => {
    try {
      let response = await axios.get(`/api/admin?page=${page}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      const usersList = response.data[0].msg.users.map((user) => {
        return { ...user, isOpen: false };
      });
      setUsers(() => {
        return [...usersList];
      });
      setPagination(response.data[0].msg.pagination);
    } catch (err) {
      throw err;
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const response = await axios.put(
        "/api/admin/ban",
        { userId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (response.data[0]?.success) {
        if (users.length > 0) {
          await fetchUsers(currentPage);
        } else if (currentPage > 1) {
          await fetchUsers(currentPage - 1);
        } else {
          await fetchUsers(1);
        }
        toast(response.data[0].msg, {
          type: "success",
          toastId: "responseSuccess",
          pauseOnFocusLoss: false,
          autoClose: 5000,
        });
      } else {
        toast(response.data[0].msg, {
          type: "error",
          toastId: "responseErr",
          pauseOnFocusLoss: false,
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast("Somthing went wrong, try again later.", {
        type: "error",
        toastId: "responseErr",
        pauseOnFocusLoss: false,
        autoClose: 5000,
      });
    }
  };

  const handleOpenModal = (id) => {
    const newUsersList = users.map((user) => {
      if (user._id === id) {
        setCurrentUserEditing({ ...user });
        setUserEditingRole({ isAdmin: user.isAdmin });
        return { ...user, isOpen: true };
      }
      return { ...user, isOpen: false };
    });
    setUsers([...newUsersList]);
  };

  const handleClose = (id) => {
    const newUsersList = users.map((user) => {
      if (user._id === id) {
        setCurrentUserEditing([]);
        return { ...user, isOpen: false };
      }
      return { ...user, isOpen: false };
    });
    setUserEditingRole("");
    setUsers([...newUsersList]);
  };

  const handleUsername = (value) => {
    setCurrentUserEditing({ ...currentUserEditing, username: value });
  };

  const handleSetPage = (page) => {
    let pageNumber = Number(page);
    if (pageNumber === 0) {
      setCurrentPage(1);
      return;
    }
    if (currentPage === pageNumber) {
      return;
    }
    fetchUsers(pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleSubmitUserChange = async (e) => {
    e.preventDefault();
    const checkForChanges = users.some((user) => {
      if (
        user.username === currentUserEditing.username &&
        user.isAdmin === userEditingRole.isAdmin &&
        user._id === currentUserEditing._id
      ) {
        return true;
      }
      return false;
    });
    if (checkForChanges) {
      return toast("You have not changed any thing.", {
        type: "error",
        toastId: "err",
        pauseOnFocusLoss: false,
        autoClose: 5000,
      });
    }
    try {
      const response = await axios.put(
        "/api/admin/edituser",
        {
          username: currentUserEditing.username,
          isAdmin: userEditingRole.isAdmin,
          _id: currentUserEditing._id,
        },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      if (!response.data[0].success) {
        return toast(response.data[0].msg, {
          type: "error",
          toastId: "responseErr",
          pauseOnFocusLoss: false,
          autoClose: 4000,
        });
      }
      handleClose(currentUserEditing._id);
      await fetchUsers(currentPage);
      return toast(response.data[0].msg, {
        type: "success",
        toastId: "successResponse",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    } catch (err) {
      return toast("Somthing went wrong try again later.", {
        type: "error",
        toastId: "responseErr",
        pauseOnFocusLoss: false,
        autoClose: 4000,
      });
    }
  };

  useEffect(() => {
    if (!fetchIsAdmin.loading) {
      if (!fetchIsAdmin.data.msg.isAdmin) {
        dispatch(
          userActions.setIsAdmim({
            type: "validateAdminPannel",
            data: false,
          })
        );
        navigate("/app");
        return;
      }
      setLoading(false);
    }
  }, [fetchIsAdmin]);

  useEffect(() => {
    if (!loading) {
      fetchUsers(1);
      setSecondLoading(false);
    }
  }, [loading]);

  return (
    <div>
      <ToastContainer />

      <ChatSlider
        chats={props.chats}
        username={props.username}
        pendingList={props.pendingList}
        setNavigation={props.setNavigation}
      />
      {loading && secondLoading && (
        <div className="w-full pl-[300px] fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      )}
      {!loading && !secondLoading && (
        <>
          <div className="lg:hidden block">
            <Navbar
              navigation={props.navigation}
              setNavigation={props.setNavigation}
            />
          </div>

          <div className="w-full relative mx-auto flex flex-col justify-center mt-[70px] lg:mt-0 lg:pl-[300px] overflow-hidden">
            <h1 className="text-white text-[25px] font-poopins font-semibold ml-5 mt-5">
              Admin Dashboard
            </h1>
            <div className="bg-white flex flex-col items-center w-[90%] mx-auto mt-[25px]">
              <div className="overflow-x-auto relative w-full">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-white">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Id
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Email
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Username
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Role
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Created At
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      return (
                        <tr
                          key={user._id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium whitespace-nowrap text-white"
                          >
                            {user._id}
                          </th>
                          <td className="py-4 px-6">{user.email}</td>
                          <td className="py-4 px-6">{user.username}</td>
                          <td className="py-4 px-6">
                            {user.isAdmin ? "Admin" : "Member"}
                          </td>
                          <td className="py-4 px-6">{user.date}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-row">
                              {userId == user._id ? (
                                <>
                                  <Button
                                    color="warning"
                                    onClick={() => {
                                      handleOpenModal(user._id);
                                    }}
                                  >
                                    Edit User
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <div className="mr-4">
                                    <Button
                                      onClick={() => {
                                        handleBanUser(user._id);
                                      }}
                                      color="error"
                                    >
                                      Ban user
                                    </Button>
                                  </div>

                                  <Button
                                    color="warning"
                                    onClick={() => {
                                      handleOpenModal(user._id);
                                    }}
                                  >
                                    Edit User
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {users.map((user) => {
                if (user.isOpen) {
                  if (user._id === userId) {
                    return (
                      <Modal
                        open={true}
                        key={user._id}
                        onClose={() => {
                          handleClose(user._id);
                        }}
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
                            onSubmit={handleSubmitUserChange}
                          >
                            <TextField
                              id="filled-basic"
                              label="Username"
                              variant="filled"
                              value={currentUserEditing.username}
                              onChange={(e) => {
                                handleUsername(e.target.value);
                              }}
                            />
                            <div className="ml-5">
                              <InputLabel id="demo-simple-select-label">
                                Role
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={userEditingRole.isAdmin}
                                label="Role"
                                onChange={(e) => {
                                  setUserEditingRole({
                                    isAdmin: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value={true}>Admin</MenuItem>
                              </Select>
                            </div>
                            <Button
                              variant="contained"
                              color="success"
                              type="submit"
                            >
                              Submit changes
                            </Button>
                          </form>
                        </Box>
                      </Modal>
                    );
                  } else {
                    return (
                      <Modal
                        open={true}
                        key={user._id}
                        onClose={() => {
                          handleClose(user._id);
                        }}
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
                            onSubmit={handleSubmitUserChange}
                          >
                            <TextField
                              id="filled-basic"
                              label="Username"
                              variant="filled"
                              value={currentUserEditing.username}
                              onChange={(e) => {
                                handleUsername(e.target.value);
                              }}
                            />
                            <div className="ml-5">
                              <InputLabel id="demo-simple-select-label">
                                Role
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={userEditingRole.isAdmin}
                                label="Role"
                                onChange={(e) => {
                                  setUserEditingRole({
                                    isAdmin: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value={true}>Admin</MenuItem>
                                <MenuItem value={false}>Member</MenuItem>
                              </Select>
                            </div>
                            <Button
                              variant="contained"
                              color="success"
                              type="submit"
                            >
                              Submit changes
                            </Button>
                          </form>
                        </Box>
                      </Modal>
                    );
                  }
                }
              })}
              <Pagination
                count={pagination.pageCount}
                page={currentPage}
                onChange={(e) => handleSetPage(e.target.textContent)}
                shape="rounded"
                color={"primary"}
                hidePrevButton
                hideNextButton
                className="text-white"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
