import {
  chattingUserType,
  selectRoom,
  setCurrentConversation,
} from "@/redux/conversationSlice";
import { UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  image: string;
  name: string;
  url: string;
}
const SidebarItem = ({ image, name, url }: SidebarItemProps) => {
  const dispatch = useDispatch();
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  return (
    <div className="mx-2 flex items-center">
      <Link
        to={
          url.includes("/messenger/t")
            ? `/messenger/t/${
                private_chat?.conversations[0]?.members.user_id ||
                currentUser?.id
              }`
            : url
        }
        onClick={() => {
          dispatch(setCurrentConversation(private_chat?.conversations[0]));
          dispatch(selectRoom({ room_id: private_chat?.conversations[0].id }));
        }}
        className="p-2 w-full h-[52px] flex items-center gap-[14px] hover:bg-[#E4E6E9] hover:rounded-lg"
      >
        <img src={image} alt={name} className="w-8 h-8 rounded-full" />
        <span className="py-3 text-[#050505] text-[15px] font-medium">
          {name}
        </span>
      </Link>
    </div>
  );
};

export default SidebarItem;
