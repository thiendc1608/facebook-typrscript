import Header from "@/components/Header/Header";
import ShowImage from "@/components/Header/Messenger/MediaFile/ShowImage";
import Modal from "@/components/Modal/Modal";
import { messageSliceType } from "@/redux/messageSlice";
import { ModalState } from "@/redux/modalSlice";
import { setLocationList } from "@/redux/postSlice";
import { ProvinceType } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function Root() {
  const { isShowModal, childrenModal } = useSelector(
    (state: { modal: ModalState }) => state.modal
  );
  const { showImage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );

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

      <Header />
      <div className="bg-[#F0F2F5] top-[56px] relative z-0 min-h-[calc(100vh-56px)]">
        <Outlet />
      </div>
    </>
  );
}
