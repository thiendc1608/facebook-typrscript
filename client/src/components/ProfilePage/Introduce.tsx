import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { IoEarth } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { userAPI } from "@/apis/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setBio, UserState } from "@/redux/userSlice";
import { toast } from "react-toastify";
import useEditProfile from "@/hooks/useEditProfile";

const Introduce = () => {
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const dispatch = useDispatch();
  const [isAddBio, setIsAddBio] = useState<boolean>(false);
  const [contentBio, setContentBio] = useState<string>(currentUser?.bio ?? "");
  const bioRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveBio = async () => {
    setIsAddBio(false);
    const response = await userAPI.changeBio(
      { bio: contentBio },
      currentUser!.id
    );
    if (response.success) {
      toast.success(response.message);
      dispatch(setBio({ bio: contentBio }));
    } else {
      toast.error(response.message);
    }
  };

  useEditProfile({
    valueEdit: currentUser!.bio,
    isExecuteEdit: isAddBio,
    textAreaRef: bioRef,
  });

  const handleEditBio = () => {
    setIsAddBio(true);
  };

  return (
    <div className="w-[40%] flex flex-col gap-4">
      <div className="p-4 bg-white rounded-lg">
        <span className="text-[#080809] text-[20px] font-semibold">
          Giới thiệu
        </span>
        {!isAddBio ? (
          <>
            {currentUser?.bio ? (
              <div className="mt-4">
                <p className="text-[#080809] text-[15px] text-center self-start">
                  {currentUser?.bio.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <div className="pt-[22px]">
                  <Button
                    className="bg-[#e2e5e9] hover:bg-[#d6d9dd] w-full text-[#080809] text-[15px]"
                    onClick={handleEditBio}
                  >
                    Chỉnh sửa tiểu sử
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-[22px]">
                <Button
                  className="bg-[#e2e5e9] hover:bg-[#d6d9dd] w-full text-[#080809] text-[15px]"
                  onClick={() => setIsAddBio(true)}
                >
                  Thêm tiểu sử
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1 mt-2">
            <textarea
              ref={bioRef}
              className="w-full h-[100px] rounded-lg border border-solid border-[#d7dade] outline-none p-3 resize-none focus:border-black text-[15px]"
              name="bio"
              id="bio"
              cols={36}
              rows={5}
              autoFocus
              placeholder="Mô tả về bạn"
              value={bioRef.current?.value}
              onChange={(e) => {
                if (e.target.value.length > 101) {
                  return;
                }
                setContentBio(e.target.value);
              }}
            ></textarea>
            <span className="text-[#65686c] text-[13px] self-end">
              {`Còn ${101 - contentBio.length} ký tự`}
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoEarth size={20} />
                <span className="text-[#080809] text-[17px]">Công khai</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[15px]"
                  onClick={() => setIsAddBio(false)}
                >
                  Huỷ
                </Button>
                <Button
                  className={cn(
                    "text-[15px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                  )}
                  onClick={handleSaveBio}
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-[#080809] text-[20px] font-semibold">Ảnh</span>
          <button className="px-3 py-2 text-[15px] rounded-lg bg-white hover:bg-[#d6d9dd] text-[#005FC6]">
            Xem tất cả ảnh
          </button>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-[#080809] text-[20px] font-semibold">
            Bạn bè
          </span>
          <button className="px-3 py-2 text-[15px] rounded-lg bg-white hover:bg-[#d6d9dd] text-[#005FC6]">
            Xem tất cả bạn bè
          </button>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
