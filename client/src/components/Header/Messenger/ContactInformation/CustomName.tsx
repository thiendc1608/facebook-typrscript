import { showModal } from "@/redux/modalSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidEditAlt } from "react-icons/bi";
import { UserState } from "@/redux/userSlice";
import { chattingUserType } from "@/redux/conversationSlice";
import { useContext, useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { SocketContext } from "@/context/SocketContext";
import { conversationAPI } from "@/apis/conversationApi";
import { changNickNameType } from "@/components/Header/Messenger/InformationConservation";

const CustomName = () => {
  const { socket } = useContext(SocketContext)!;
  const [listNickName, setListNickName] = useState<changNickNameType[]>([]);
  const dispatch = useDispatch();
  const [editName, setEditName] = useState({
    id: "",
    name: "",
  });
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  const handleClickEditName = (id: string) => {
    setEditName({ ...editName, id });
  };

  const handleClickSubmitEdit = () => {
    socket?.emit("change_name", {
      receiver_id: private_chat.current_conversation?.members?.user?.id,
      conversation_id: private_chat.current_conversation?.id,
      id: editName.id,
      sender_id: currentUser?.id,
      name: editName.name,
    });
    dispatch(
      showModal({
        isShowModal: false,
        childrenModal: null,
      })
    );
  };

  useEffect(() => {
    const fetchListNickName = async () => {
      if (private_chat.current_conversation) {
        const response = await conversationAPI.getAllNickName(
          private_chat.current_conversation.id
        );
        if (response.success) {
          setListNickName(response.allNickName);
        }
      }
    };
    fetchListNickName();
  }, []);

  return (
    <div
      className="w-[548px] h-auto bg-white rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">Biệt danh</div>
        <div
          className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              showModal({
                isShowModal: false,
                childrenModal: null,
              })
            );
          }}
        >
          <IoMdClose size={24} />
        </div>
      </div>

      <div className="p-4">
        {listNickName.map((member) => (
          <div
            key={member.id}
            className="p-2 flex items-center justify-between"
          >
            <div className=" flex items-center gap-2 w-full">
              <div className="py-2 pr-2">
                <img
                  src={member.user.avatar}
                  alt="anh"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              {editName.id === member?.user_id ? (
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="py-[10px] group w-full">
                    <div className="py-2 px-3 bg-white border border-solid border-black rounded-lg group-hover:bg-[#E4E6E9] w-full">
                      <input
                        type="text"
                        autoFocus
                        className="text-[#828487] text-[15px] w-full h-full outline-none overflow-hidden group-hover:bg-[#E4E6E9]"
                        defaultValue={member?.nickname}
                        onChange={(e) => {
                          setEditName({ ...editName, name: e.target.value });
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="w-[30px] h-[30px] rounded-full hover:bg-[#e5e5e5] flex items-center justify-center cursor-pointer"
                    onClick={handleClickSubmitEdit}
                  >
                    <TiTick size={28} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col justify-center gap-1">
                    <span className="text-[#080809] text-[15px] font-semibold">
                      {member?.nickname}
                    </span>
                    <span className="text-[#080809] text-[13px]">
                      Đặt biệt danh
                    </span>
                  </div>
                </>
              )}
            </div>
            {editName.id !== member?.user_id && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleClickEditName(member!.user_id);
                }}
              >
                <BiSolidEditAlt size={28} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomName;
