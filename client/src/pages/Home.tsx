import ContentPost from "@/components/ContentPost/ContentPost";
import Rightbar from "@/components/Rightbar/Rightbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { SocketContext } from "@/context/SocketContext";
import { useContext, useEffect } from "react";
import {
  notificationState,
  setIsOpenNotifications,
  setNotifications,
} from "@/redux/notificationSlice";
import ShowNotification from "@/components/Header/Notification/ShowNotification";
import ShowMessage from "@/components/Header/Messenger/ShowMessage";
import ShowChatting from "@/components/Header/Messenger/ShowChatting";
import { fetchDirectConversations } from "@/redux/conversationSlice";
import { useAppDispatch } from "@/redux/store";
import { userAPI } from "@/apis/userApi";

const Home = () => {
  const dispatch = useDispatch();
  const dispatchConversation = useAppDispatch();
  const { isLogin, currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { socket } = useContext(SocketContext);
  const { isOpenNotifications, isOpenMessage, isOpenChatting } = useSelector(
    (state: { notification: notificationState }) => state.notification
  );

  useEffect(() => {
    socket?.emit("add_user", currentUser);
  }, [currentUser, socket]);

  useEffect(() => {
    socket?.on("get_friend_request", (data) => {
      dispatch(
        setNotifications({
          user: data.sender,
          timeSend: data.timeSend,
          message: data.message,
        })
      );
    });
    socket?.on("friendRequestConfirmed", (data) => {
      dispatch(
        setNotifications({
          user: data.receiver,
          timeSend: data.timeSend,
          message: data.message,
        })
      );
    });
    return () => {
      socket?.off("get_friend_request");
      socket?.off("friendRequestConfirmed");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const handleCloseNotification = (e: Event) => {
      const closeNotificationEl = document.getElementById("notification");
      if (e.target instanceof Node && !closeNotificationEl?.contains(e.target))
        dispatch(setIsOpenNotifications(false));
    };
    document.addEventListener("click", handleCloseNotification);
    return () => document.removeEventListener("click", handleCloseNotification);
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatchConversation(fetchDirectConversations(currentUser.id));
    }
  }, [currentUser, dispatchConversation]);

  useEffect(() => {
    async function updateStatus() {
      if (currentUser?.id) {
        await userAPI.updateStatusUser("online", currentUser.id);
      }
    }
    updateStatus();
  }, [currentUser]);

  if (!isLogin && !currentUser) return <Navigate to="/login" replace={true} />;

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 fixed top-[56px] left-0 w-[360px]">
        <Sidebar />
      </div>
      <div className="flex-[2.4]">
        <ContentPost />
        <div className="h-[500px]"></div>
      </div>
      <div className="flex-1 fixed top-[56px] right-0 w-[360px]">
        <Rightbar />
        {isOpenNotifications && <ShowNotification socket={socket} />}
        {isOpenMessage && <ShowMessage />}
        {isOpenChatting && <ShowChatting />}
      </div>
    </div>
  );
};

export default Home;
