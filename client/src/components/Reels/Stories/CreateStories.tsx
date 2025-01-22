import { IoMdClose } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { RiImageAddFill } from "react-icons/ri";
import { PiTextAaBold } from "react-icons/pi";
import RightHeader from "@/components/Header/RightHeader";
import { useEffect, useState } from "react";
import PreviewReel from "@/components/Reels/PreviewReel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TiArrowSortedDown } from "react-icons/ti";
import SelectFont from "@/components/Reels/SelectFont";
import BackGroundImageReel from "@/components/Reels/BackGroundImageReel";
import { useDispatch, useSelector } from "react-redux";
import { clickCreateText, typeText } from "@/redux/reelSlice";
import { reelType } from "@/types";
import Swal from "sweetalert2";
import { ModalState, showModal } from "@/redux/modalSlice";
import YourPrivacy from "@/components/Reels/YourPrivacy";
import Modal from "@/components/Modal/Modal";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "@/redux/userSlice";
import { storyAPI } from "@/apis/storyApi";
import { v4 as uuidv4 } from "uuid";
import { path } from "@/utils/path";

const CreateStories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isShowModal, childrenModal } = useSelector(
    (state: { modal: ModalState }) => state.modal
  );
  const { isCreateText, changeFont, typeTextReel, selectBg } = useSelector(
    (state: { reel: reelType }) => state.reel
  );
  const [imagePostReel, setImagePostReel] = useState<File>();
  const [isClickTypeText, setIsClickTypeText] = useState(false);
  const [isChangeFont, setIsChangeFont] = useState(false);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const handleClickOutTextArea = (e: Event) => {
      const clickTypeTextEle = document.getElementById("clickTypeText");
      if (e.target instanceof Node && !clickTypeTextEle?.contains(e.target))
        setIsClickTypeText(false);
    };
    document.addEventListener("click", handleClickOutTextArea);
    return () => {
      document.removeEventListener("click", handleClickOutTextArea);
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsClickTypeText(true);
    dispatch(typeText(e.target.value));
  };

  const handleCancelButton = () => {
    Swal.fire({
      title: "Bỏ tin",
      text: "Bạn có chắc chắn muốn bỏ tin này không? Hệ thống sẽ không lưu tin của bạn.",
      denyButtonText: "Bỏ",
      showDenyButton: true,
      confirmButtonText: "Tiếp tục chỉnh sửa",
      confirmButtonColor: "#0866FF",
    }).then((result) => {
      if (result.isDenied) {
        setImagePostReel(undefined);
        dispatch(clickCreateText(false));
      }
    });
  };

  const handlePostTextReel = async () => {
    try {
      const newStory = {
        id: uuidv4(),
        user_id: currentUser!.id,
        caption: typeTextReel,
        thumbnail_url: selectBg.srcImg,
        mode_privacy: "public",
        expiredAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      };
      setLoading(true);
      const response = await storyAPI.createStory(newStory);
      if (response.success) {
        setLoading(false);
        navigate(`/${path.HOME}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isShowModal && <Modal>{childrenModal}</Modal>}
      <div className="relative flex w-screen h-screen overflow-hidden">
        <div className="absolute left-0 top-0 w-[360px] h-full bg-white shadow-default">
          <div className="flex items-center justify-start py-2 px-4 gap-2 shadow-stories">
            <Link
              to="/"
              className="w-10 h-10 bg-[#999999] rounded-full flex items-center justify-center cursor-pointer"
            >
              <IoMdClose size={28} color="white" />
            </Link>
            <Link to="/">
              <FaFacebook size={40} color="#0866FF" />
            </Link>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-[#050505] text-[24px] font-semibold">
                Tin của bạn
              </h1>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-[#D8DADF]"
                onClick={() => {
                  dispatch(
                    showModal({
                      isShowModal: true,
                      childrenModal: <YourPrivacy />,
                    })
                  );
                }}
              >
                <IoMdSettings size={20} />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 flex items-center gap-2 border-b border-solid border-[#E5E5E5]">
            <img
              src={anonymousAvatar}
              alt="anonymous"
              className="w-[60px] h-[60px] rounded-full cursor-pointer"
            />
            <span className="text-[#050505] text-[20px] font-semibold">
              Name
            </span>
          </div>
          {imagePostReel && (
            <div className="p-4">
              <div className="p-2 flex items-center gap-4 cursor-pointer hover:bg-[#F2F2F2] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#E4E6E9] flex items-center justify-center">
                  <PiTextAaBold size={20} />
                </div>
                <span className="text-[#050505] text-[17px]">Thêm văn bản</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full shadow-default">
                <div className="flex gap-4 p-4 bg-white">
                  <Button
                    className="flex-1 text-black font-semibold hover:bg-[#D8DADF] bg-[#E4E6E9]"
                    onClick={handleCancelButton}
                  >
                    Bỏ
                  </Button>
                  <Button
                    className="flex-1 hover:bg-[#0866FF] bg-blue-500"
                    // onClick={handlePostReel}
                  >
                    Chia sẻ lên tin
                  </Button>
                </div>
              </div>
            </div>
          )}
          {isCreateText && (
            <div
              className="p-4 pt-1 h-[calc(100vh-268px)] overflow-y-scroll w-full"
              // onScroll={(e) => {
              //   console.log(e);
              // }}
            >
              <div className="my-4 flex flex-col gap-4">
                <div
                  id="clickTypeText"
                  className={cn(
                    "border border-solid rounded-lg pb-[10px] text-[17px] h-[178px]",
                    isClickTypeText
                      ? "pt-[10px] border-blue-500"
                      : "pt-[18px] border-[#CED0D4]"
                  )}
                >
                  {isClickTypeText && (
                    <span className="text-[12px] text-blue-600 px-[16px]">
                      Văn bản
                    </span>
                  )}
                  <textarea
                    rows={6}
                    cols={36}
                    className="w-full outline-none py-[3px] px-[16px] h-full leading-[24px]"
                    placeholder="Bắt đầu nhập"
                    value={typeTextReel}
                    onChange={handleTextChange}
                  ></textarea>
                </div>
                <div
                  className="relative border border-solid rounded-lg border-[#CED0D4] p-4 flex item-center justify-between cursor-pointer"
                  onClick={() => setIsChangeFont(!isChangeFont)}
                >
                  <div className="flex items-center gap-4">
                    <PiTextAaBold size={20} />
                    <span className="text-[17px] text-[#050505]">
                      {changeFont.name}
                    </span>
                  </div>
                  <div>
                    <TiArrowSortedDown size={20} />
                  </div>
                  {isChangeFont && (
                    <SelectFont setIsChangeFont={setIsChangeFont} />
                  )}
                </div>
              </div>
              <BackGroundImageReel />
              <div className="absolute bottom-0 left-0 w-full shadow-default">
                <div className="flex gap-4 p-4 bg-white">
                  <Button
                    className={cn(
                      "flex-1 text-black font-semibold hover:bg-[#D8DADF] bg-[#E4E6E9]",
                      loading && "cursor-no-drop"
                    )}
                    onClick={handleCancelButton}
                    disabled={loading}
                  >
                    Bỏ
                  </Button>
                  <Button
                    className={cn(
                      "flex-1 hover:bg-[#0866FF] bg-blue-500",
                      loading && "cursor-no-drop"
                    )}
                    onClick={handlePostTextReel}
                    disabled={loading}
                  >
                    Chia sẻ lên tin
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute left-[360px] top-0 w-[calc(100vw-360px)] h-full bg-[#f0f2f5]">
          <div className="absolute top-2 right-2">
            <RightHeader />
          </div>
          {imagePostReel ? (
            <PreviewReel imagePostReel={imagePostReel} />
          ) : isCreateText ? (
            <PreviewReel isCreateText={isCreateText} />
          ) : (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex gap-5">
              <div
                className="w-[220px] h-[330px] rounded-lg inline-block"
                style={{
                  backgroundImage:
                    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/OKGvh9pqBPm.png)",
                  backgroundPosition: "0px 0px",
                  backgroundSize: "auto",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <input
                  id="image-video"
                  type="file"
                  accept="image/*,image/heif,image/heic"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) setImagePostReel(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="image-video"
                  className="flex flex-col items-center justify-center w-full h-full gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <RiImageAddFill size={24} />
                  </div>
                  <span className="text-[15px] text-white">
                    Tạo tập tin ảnh
                  </span>
                </label>
              </div>
              <div
                className="w-[220px] h-[330px] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundImage:
                    "url(https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/OKGvh9pqBPm.png)",
                  backgroundPosition: "0px -331px",
                  backgroundSize: "auto",
                  backgroundRepeat: "no-repeat",
                }}
                onClick={() => {
                  dispatch(clickCreateText(true));
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <PiTextAaBold size={24} />
                </div>
                <span className="text-[15px] text-white">
                  Tạo tin dạng văn bản
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateStories;
