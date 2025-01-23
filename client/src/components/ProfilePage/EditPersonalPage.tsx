import { showModal } from "@/redux/modalSlice";
import { setBio, UserState } from "@/redux/userSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { FaHouseUser } from "react-icons/fa";
import { PhoneCall } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { LuCake, LuUsers } from "react-icons/lu";
import EditAvatarModal from "./CustomAvatar/EditAvatarModal";
import EditCoverPicture from "./EditCoverPicture";
import { useRef, useState } from "react";
import { IoEarth } from "react-icons/io5";
import useEditProfile from "@/hooks/useEditProfile";
import { toast } from "react-toastify";
import { userAPI } from "@/apis/userApi";
import { useNavigate } from "react-router-dom";
import { path } from "@/utils/path";

const EditPersonalPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isAddBio, setIsAddBio] = useState<boolean>(false);
  const [contentBio, setContentBio] = useState<string>(currentUser?.bio ?? "");
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

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

  const handleChangeCoverPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      dispatch(
        showModal({
          isShowModal: true,
          childrenModal: <EditCoverPicture coverPicture={file} />,
        })
      );
    }
  };

  return (
    <div
      className="w-[700px] bg-white rounded-lg overflow-auto h-screen"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-50">
            <PulseLoader size={10} color="white" />
            <span className="text-white text-[18px] whitespace-nowrap">
              Đang tải avatar
            </span>
          </div>
        )} */}
      <div className="relative w-full h-[50px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">
          Chỉnh sửa trang cá nhân
        </div>
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
      <div className="pt-5 px-4 pb-4">
        {/* Ảnh cá nhân */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Ảnh đại diện
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  showModal({
                    isShowModal: true,
                    childrenModal: <EditAvatarModal />,
                  })
                );
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
          <div className="p-[6px] w-[168px] h-[168px] rounded-full self-center border border-solid border-[#afaeae]">
            <img
              src={currentUser!.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Ảnh bìa */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="relative flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Ảnh bìa
            </div>

            <div>
              <input
                type="file"
                id="cover_photo"
                hidden
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeCoverPicture(e);
                }}
              />
              <label
                htmlFor="cover_photo"
                className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC] flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
              >
                <span className="text-[15px]">Thêm</span>
              </label>
            </div>
          </div>
          <div className="relative p-[6px] w-[500px] h-[185px] self-center">
            <img
              src={currentUser!.cover_picture}
              alt="cover-picture"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Tiểu sử */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Tiểu sử
            </div>
            {currentUser?.bio.length === 0 ? (
              <Button
                variant="ghost"
                className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
                onClick={handleEditBio}
              >
                Thêm
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
                onClick={handleEditBio}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
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
                </div>
              ) : (
                <div className="p-[6px] self-center">
                  <span className="text-[#65686c] text-[17px]">
                    Mô tả bản thân...
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-1 mt-2 mx-auto w-[215px]">
              <textarea
                ref={bioRef}
                className="w-full h-[80px] rounded-lg border border-solid border-[#d7dade] outline-none p-3 resize-none focus:border-black text-[15px]"
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
                <div className="flex items-center gap-1">
                  <IoEarth size={20} />
                  <span className="text-[#080809] text-[15px] whitespace-nowrap">
                    Công khai
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[13px]"
                    onClick={() => setIsAddBio(false)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="text-[13px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                    onClick={handleSaveBio}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chỉnh sửa phần giới thiệu */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Chỉnh sửa phần giới thiệu
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
              onClick={() => {
                dispatch(
                  showModal({
                    isShowModal: false,
                    childrenModal: null,
                  })
                );
                navigate(`/${path.PROFILE}?id=${currentUser!.id}&sk=about`);
              }}
            >
              Thêm
            </Button>
          </div>
          <ul>
            <li className="flex items-center">
              <div className="p-[6px]">
                <FaHouseUser size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Tỉnh/Thành phố hiện tại
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <PhoneCall size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Số điện thoại
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <MdEmail size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Địa chỉ Email
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <LuCake size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Ngày, tháng, năm sinh
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <LuUsers size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Giới tính
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalPage;
