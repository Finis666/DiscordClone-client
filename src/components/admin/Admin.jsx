import React, {useEffect, useRef} from "react";
import ChatSlider from "../subComponents/ChatSlider";

function Admin(props) {
  const isMount = useRef(false)
  useEffect(() => {
  }, [isMount])
  return <div>
    <ChatSlider 
      chats={props.chats}
      username={props.username}
      pendingList={props.pendingList}
      setNavigation={props.setNavigation}
    />
    <div className="w-full relative mx-auto flex flex-col justify-center pl-[300px]">
      test
    </div>
  </div>;
}

export default Admin;
