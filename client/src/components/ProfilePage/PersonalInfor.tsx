import { Button } from "@/components/ui/button";
import {
  setConfirmCoverPicture,
  setCoverPictureUser,
  setPosCoverPicture,
  setTabProfile,
  UserState,
} from "@/redux/userSlice";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { conversationAPI } from "@/apis/conversationApi";
import { useEffect, useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { profileUserItems } from "@/utils/path";
import { ModalState, showModal } from "@/redux/modalSlice";
import EditAvatarModal from "./CustomAvatar/EditAvatarModal";
import { cn } from "@/lib/utils";
import EditPersonalPage from "./EditPersonalPage";

const PersonalInfor = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, tabProfile } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isLoading, setLoading] = useState(false);
  const pictureRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState(0);
  const [showInstruct, setShowInstruct] = useState(false);
  const { isShowModal } = useSelector(
    (state: { modal: ModalState }) => state.modal
  );

  useEffect(() => {
    if (isShowModal) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isShowModal]);

  const handleChangeCoverPicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    if (file) {
      if (!file.type.includes("image")) {
        toast.warning("File not support");
        return;
      }
      formData.append("imageInfo", file);
      setLoading(true);
      try {
        const response = await conversationAPI.uploadImageVideos(formData);
        if (response.success) {
          setLoading(false);
          setShowInstruct(true);
          dispatch(setConfirmCoverPicture(true));
          dispatch(setCoverPictureUser(response.imageVideos[0].path));
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hide loading spinner after API call
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    e.preventDefault();
    setShowInstruct(false);
    if (!pictureRef.current || !containerRef.current) return;
    const containerHeight = containerRef.current.offsetHeight; // Chiều cao vùng chứa
    const imageHeight = pictureRef.current.offsetHeight; // Chiều cao ảnh
    let newTopOffset = topOffset;
    switch (e.key) {
      case "ArrowUp":
        // Nếu ảnh chưa chạm đến đầu thì di chuyển lên
        if (newTopOffset < 0) {
          newTopOffset += 20;
        }
        break;

      case "ArrowDown":
        // Kiểm tra nếu ảnh chưa bị đẩy ra ngoài vùng chứa thì di chuyển xuống
        if (newTopOffset + imageHeight > containerHeight) {
          // Nếu phần dưới của ảnh đã chạm đáy vùng chứa
          newTopOffset -= 20; // Di chuyển ảnh lên (cắt bớt phần dưới)
        }
        break;
    }
    setTopOffset(newTopOffset);
    dispatch(
      setPosCoverPicture({
        image_position: newTopOffset,
      })
    );
  };

  const handleChangeAvatar = () => {
    dispatch(
      showModal({ isShowModal: true, childrenModal: <EditAvatarModal /> })
    );
  };

  const handleClickItems = (item: string) => {
    dispatch(setTabProfile(item));
    const queries = Object.fromEntries(searchParams);
    let itemName = "";
    switch (item) {
      case "Giới thiệu":
        itemName = "about";
        break;
      case "Bạn bè":
        itemName = "friends";
        break;
      case "Ảnh/Video":
        itemName = "photos";
        break;
      case "Reels":
        itemName = "reels_tab";
        break;
      default:
        itemName = "";
        break;
    }
    if (itemName !== "") queries.sk = itemName;
    else delete queries.sk;
    navigate({
      pathname: `${location.pathname}`,
      search: createSearchParams(queries).toString(),
    });
  };

  return (
    <div className="bg-white w-full">
      {!currentUser?.cover_picture ? (
        <div className="relative h-[350px] mx-auto w-[70%] bg-gradient-to-b from-slate-100 to-zinc-600 rounded-lg hover:bg-[#e6e8ea] cursor-pointer overflow-hidden shadow-default">
          {isLoading && (
            <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-10">
              <PulseLoader size={10} />
            </div>
          )}

          <div className="absolute bottom-4 right-8">
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
              className="bg-white hover:bg-[#f2f2f2] flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
            >
              <FaCamera size={20} color="black" />
              <span className="text-[#080809] text-[15px] font-semibold">
                Thêm ảnh bìa
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative h-[350px] mx-auto w-[70%] rounded-lg cursor-pointer overflow-hidden shadow-default"
        >
          {showInstruct && (
            <div className="py-2 px-3 bg-[#1c1c1d99] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 text-white text-[15px] rounded-lg">
              Dùng phím mũi tên lên, xuống để đặt lại hình ảnh
            </div>
          )}
          <img
            src={currentUser!.cover_picture}
            loading="lazy"
            alt="cover_picture"
            tabIndex={0}
            className="w-full object-contain"
            ref={pictureRef}
            style={{
              position: "absolute",
              top: `${currentUser?.cover_picture_pos}px`,
            }}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </div>
      )}

      <div className="h-[144px]">
        <div className="relative pb-4 w-[67%] mx-auto h-full border-b border-solid border-[#e2e5e9]">
          <div className="absolute left-4 bottom-4">
            <div className="h-[176px] w-[176px] rounded-full bg-white">
              <div className="absolute inset-0 p-1 w-full h-full">
                <img
                  src={currentUser?.avatar}
                  alt="anh"
                  className="w-full h-full object-cover rounded-full border border-solid border-[#e2e5e9]"
                />
                <div
                  className="absolute bottom-5 right-0"
                  onClick={() => handleChangeAvatar()}
                >
                  <div className="w-9 h-9 rounded-full bg-[#e2e5e9] flex items-center justify-center cursor-pointer">
                    <FaCamera size={20} color="black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 flex items-center gap-10 h-full">
            <div className="w-[176px] h-full"></div>
            <div className="flex items-center justify-between w-full">
              <span className="flex-1 text-[32px] font-semibold">
                {currentUser?.lastName + " " + currentUser?.firstName}
              </span>
              <div className="flex-1 flex items-center gap-4 h-full">
                <Button className="bg-[#1877F2]">
                  <FaPlus />
                  <span className="text-white">Thêm vào tin</span>
                </Button>
                <Button
                  className="bg-[#e2e5e9] hover:bg-[#D6D9DD]"
                  onClick={() => {
                    dispatch(
                      showModal({
                        isShowModal: true,
                        childrenModal: <EditPersonalPage />,
                      })
                    );
                  }}
                >
                  <MdModeEdit color="#080809" />
                  <span className="text-[#080809] text-[15px]">
                    Chỉnh sửa trang cá nhân
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[60px] bg-white shadow">
        <div className="w-2/3 mx-auto h-full flex items-center justify-between">
          <ul className="w-full px-4 flex items-center h-full">
            {profileUserItems.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "py-[3px] h-full w-auto",
                  tabProfile === item.nameItems &&
                    "border-b-[3px] border-solid border-[#0861F2]"
                )}
                onClick={() => handleClickItems(item.nameItems)}
              >
                <span
                  className={cn(
                    "px-4 text-[16px] h-full text-[#65686c] flex items-center cursor-pointer hover:bg-[#F2F2F2] rounded-md",
                    tabProfile === item.nameItems && "text-[#0861F2]"
                  )}
                >
                  {item.nameItems}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfor;
