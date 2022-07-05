import React, { useEffect, useState } from "react";
import LeftFriendsSlider from "./subComponents/LeftFriendsSilder";
import { useSelector } from "react-redux";
import useFetchTwo from "../hooks/useFetchTwo";
import MainComponent from "./subComponents/main/MainComponent";
import loadingGif from "../assets/brand/loading-discord.gif";

function AppHome() {
  document.body.style.backgroundColor = "#36393f";
  let initialState = [
    { name: "Online", isOn: true },
    { name: "All", isOn: false },
    { name: "Pending", isOn: false },
    { name: "Add Friend", isOn: false },
  ];
  const [navigation, setNavigation] = useState(initialState);
  const [friendsList, setFriendsList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const username = useSelector((state) => state.user.username);
  const { data, loading } = useFetchTwo(
    "/api/friends/all",
    "/api/friends/pending"
  );
  useEffect(() => {
    if (!loading) {
      setFriendsList(data[0].data[0].msg);
      setPendingList(data[1].data[0].msg);
      return;
    }
  }, [loading]);
  return (
    <div>
      {loading === false ? (
        <div>
          {
            <LeftFriendsSlider
              friendsList={friendsList}
              username={username}
              pendingList={pendingList}
              setNavigation={setNavigation}
            />
          }
          {
            <MainComponent
              friendsList={friendsList}
              setFriendsList={setFriendsList}
              pendingList={pendingList}
              setPendingList={setPendingList}
              navigation={navigation}
              setNavigation={setNavigation}
            />
          }
        </div>
      ) : (
        <div className="w-full fixed h-full flex justify-center items-center">
          <img src={loadingGif} className="w-[300px] h-[300px]" />
        </div>
      )}
    </div>
  );
}

export default AppHome;
