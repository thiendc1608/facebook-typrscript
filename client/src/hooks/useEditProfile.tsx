import { useEffect } from "react";

interface EditProfileProps {
  valueEdit: string;
  isExecuteEdit: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>; // Ref của div input;
}

const useEditProfile = ({
  valueEdit,
  isExecuteEdit,
  textAreaRef,
}: EditProfileProps) => {
  // Đảm bảo con trỏ luôn ở cuối khi bắt đầu chỉnh sửa (nhấn nút chỉnh sửa)
  useEffect(() => {
    if (isExecuteEdit && textAreaRef.current) {
      const textareaItem = textAreaRef.current;
      textareaItem.focus();
      textareaItem.value = valueEdit;
      const length = textareaItem.value.length;
      textareaItem.setSelectionRange(length, length); // Đặt con trỏ ở cuối nội dung hiện tại
      textareaItem.scrollTop = textareaItem.scrollHeight; // Đảm bảo textarea cuộn đến cuối
    }
  }, [valueEdit, isExecuteEdit, textAreaRef]); // Mỗi khi isExecuteEdit thay đổi, xử lý đặt con trỏ
};

export default useEditProfile;
