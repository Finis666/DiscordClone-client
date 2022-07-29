import React, { useEffect, useState } from "react";
import ChatSlider from "./subComponents/ChatSlider";
import { useSelector } from "react-redux";
import useFetchThree from "../hooks/useFetchThree";
import MainComponent from "./subComponents/main/MainComponent";
import loadingGif from "../assets/brand/loading-discord.gif";
import { useParams } from "react-router-dom";
import Chat from "./chat/Chat";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import Admin from "./admin/Admin";

function AppHome() {
  document.body.style.backgroundColor = "#36393f";
  let initialState = [
    { name: "Online", isOn: true },
    { name: "All", isOn: false },
    { name: "Pending", isOn: false },
    { name: "Add Friend", isOn: false },
  ];
  const location = useLocation();
  const { conversationId } = useParams();
  const [navigation, setNavigation] = useState(initialState);
  const [friendsList, setFriendsList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [chats, setChats] = useState([]);
  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);
  const { data, loading } = useFetchThree(
    "/api/friends/all",
    "/api/friends/pending",
    "/api/conversations/"
  );
  const [finalLoading, setFinalLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!loading && data !== null) {
      setFriendsList(data[0].data[0].msg);
      setPendingList(data[1].data[0].msg);
      setChats(data[2].data[0].msg);
      setFinalLoading(false);
      setSocket(io("http://localhost:3000"));
      return;
    }
  }, [loading]);
  useEffect(() => {
    socket?.emit("addUser", { userId: userId, username: username });
    return () => {
      socket?.off("addUser");
    };
  }, [socket]);
  useEffect(() => {
    socket?.on("getUsers", (users) => {
      if (typeof friendsList === "string" || friendsList.length === 0) {
        return;
      }
      if (typeof chats === "string" || chats.length === 0) {
        return;
      }
      for (let friend in friendsList) {
        let findUser = users.find((user) => {
          return user.userId === friendsList[friend].userId;
        });
        if (findUser) {
          setFriendsList((oldFriendsList) => {
            return oldFriendsList.map((friendItem) => {
              if (friendItem.userId === friendsList[friend].userId) {
                return { ...friendItem, active: true };
              }
              return friendItem;
            });
          });
        }
      }
      //adding to chats status of members
      for (let chat in chats) {
        let findUser = users.find((user) => {
          return user.userId === chats[chat].userId;
        });
        if (findUser) {
          setChats((oldChat) => {
            return oldChat.map((chatItem) => {
              if (chatItem.userId === chats[chat].userId) {
                return { ...chatItem, active: true };
              }
              return chatItem;
            });
          });
        }
      }
    });
    // removing active status
    socket?.on("removeFromActive", (userId) => {
      if (!userId) return;
      if (typeof friendsList === "string" || friendsList.length === 0) {
        return;
      }
      if (typeof chats === "string" || chats.length === 0) {
        return;
      }
      setFriendsList((oldFriendList) => {
        return oldFriendList.map((friend) => {
          if (friend.userId === userId.userId) {
            return { ...friend, active: false };
          }
          return friend;
        });
      });
      //adding to chats status of members
      setChats((oldChat) => {
        return oldChat.map((chat) => {
          if (chat.userId === userId.userId) {
            return { ...chat, active: false };
          }
          return chat;
        });
      });
    });

    //handling friend request accepted
    socket?.on("pending_accepted", (friendUser) => {
      if (typeof friendsList === "string") {
        setFriendsList((old) => {
          return [
            {
              username: friendUser.reqUsername,
              userId: friendUser.reqUserId,
              active: true,
            },
          ];
        });
      } else {
        setFriendsList((oldList) => [
          ...oldList,
          {
            username: friendUser.reqUsername,
            userId: friendUser.reqUserId,
            active: true,
          },
        ]);
      }
      if (typeof chats === "string") {
        setChats((old) => {
          return [
            {
              username: friendUser.reqUsername,
              userId: friendUser.reqUserId,
              active: true,
            },
          ];
        });
      } else {
        //adding to chats status of members
        setChats((oldList) => [
          ...oldList,
          {
            username: friendUser.reqUsername,
            userId: friendUser.reqUserId,
            active: true,
          },
        ]);
      }
    });
    // updating user status of the one who accepted the user
    socket?.on("userIsOnline", (data) => {
      // updating friendsList status
      setFriendsList((oldFriendsList) => {
        return oldFriendsList.map((friendItem) => {
          if (friendItem.userId === data) {
            return { ...friendItem, active: true };
          }
          return friendItem;
        });
      });

      // updating chats status
      setChats((oldChatList) => {
        return oldChatList.map((chat) => {
          if (chat.userId === data) {
            return { ...chat, active: true };
          }
          return chat;
        });
      });
    });

    // handling friend request sent
    socket?.on("friend_request_get", (data) => {
      if (typeof pendingList === "string") {
        setPendingList((old) => {
          return [
            {
              username: data.username,
              userId: data.userId,
            },
          ];
        });
      } else {
        setPendingList((oldList) => [
          ...oldList,
          {
            username: data.username,
            userId: data.userId,
          },
        ]);
      }
    });

    return () => {
      socket?.off("getUsers");
      socket?.off("removeFromActive");
      socket?.off("userIsOnline");
      socket?.off("pending_accepted");
      socket?.off("friend_request_get");
    };
  });
  return (
    <React.Fragment>
      {finalLoading && (
        <div className="w-full fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      )}

      {conversationId !== undefined || null ? (
        // showing conversation
        <>
          {!finalLoading && (
            <>
              <Chat
                conversationId={conversationId}
                chatList={chats}
                username={username}
                socket={socket}
                pendingList={pendingList}
                setNavigation={setNavigation}
              />
            </>
          )}
        </>
      ) : location.pathname === "/app/admin" ? (
        <>
          {!finalLoading && (
            <Admin
              chats={chats}
              username={username}
              pendingList={pendingList}
              setNavigation={setNavigation}
            />
          )}
        </>
      ) : (
        // showing friends list and pending list and chats
        <>
          {!finalLoading && (
            <>
              <div>
                {
                  <ChatSlider
                    chats={chats}
                    username={username}
                    pendingList={pendingList}
                    setNavigation={setNavigation}
                  />
                }
                {
                  <MainComponent
                    friendsList={friendsList}
                    setFriendsList={setFriendsList}
                    chats={chats}
                    setChats={setChats}
                    pendingList={pendingList}
                    setPendingList={setPendingList}
                    navigation={navigation}
                    setNavigation={setNavigation}
                    socket={socket}
                  />
                }
              </div>
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
}

export default AppHome;
