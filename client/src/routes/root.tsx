import Header from "@/components/Header/Header";
import ShowImage from "@/components/Header/Messenger/MediaFile/ShowImage";
import Modal from "@/components/Modal/Modal";
import { messageSliceType } from "@/redux/messageSlice";
import { ModalState } from "@/redux/modalSlice";
import { postType, setLocationList } from "@/redux/postSlice";
import { ProvinceType } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

export default function Root() {
  const { isShowModal, childrenModal } = useSelector(
    (state: { modal: ModalState }) => state.modal
  );
  const { showImage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const { deletePost } = useSelector((state: { post: postType }) => state.post);

  const dispatch = useDispatch();
  useEffect(() => {
    const getProvinceCity = async () => {
      const response = await fetch(import.meta.env.VITE_PROVINCE_CITY);
      const data: ProvinceType = await response.json();
      if (data.error === 0) {
        dispatch(setLocationList(data.data));
      }
    };
    getProvinceCity();
  }, [dispatch]);

  return (
    <>
      {showImage.isShowImage && (
        <div className="fixed inset-0 bg-[rgba(72,72,72,0.7)] flex items-center justify-center z-[100]">
          <ShowImage showImage={showImage} />
        </div>
      )}
      {isShowModal && <Modal>{childrenModal}</Modal>}
      {deletePost.isLoadingDeletePost && (
        <div className="relative inset-0 w-screen h-screen bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-50">
          <PulseLoader size={10} color="white" />
          <span className="text-white text-[18px] whitespace-nowrap">
            Đang xử lý...
          </span>
        </div>
      )}
      <Header />
      <div className="bg-[#F0F2F5] top-[56px] relative min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
