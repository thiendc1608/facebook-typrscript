import Header from "@/components/Header/Header";
import Modal from "@/components/Modal/Modal";
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
      {isShowModal && <Modal>{childrenModal}</Modal>}
      <Header />
      <div className="bg-[#F0F2F5] top-[56px] relative z-0 min-h-[calc(100vh-56px)]">
        <Outlet />
      </div>
    </>
  );
}
