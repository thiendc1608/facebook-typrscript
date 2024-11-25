import { useDispatch } from "react-redux";
import { setIsOpenMessage } from "@/redux/notificationSlice";
import { useEffect } from "react";
import ChatUserList from "./ChatUserList";

const ShowMessage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCloseMessage = (e: Event) => {
      const closeNotificationEl = document.getElementById("message");
      if (e.target instanceof Node && !closeNotificationEl?.contains(e.target))
        dispatch(setIsOpenMessage(false));
    };
    document.addEventListener("click", handleCloseMessage);
    return () => document.removeEventListener("click", handleCloseMessage);
  }, [dispatch]);

  return (
    <div
      className="absolute top-0 right-4 bg-white rounded-lg w-[360px] h-[calc(100vh-80px)] shadow-default z-[100]"
      id="message"
    >
      <ChatUserList />
    </div>
  );
};

export default ShowMessage;
