import { useState } from "react";
import { FaPlay, FaVolumeXmark } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";

interface ChangeStateActionProps {
  pauseFlagMouse: React.MutableRefObject<boolean>;
  pauseFlagBtn: React.MutableRefObject<boolean>;
}
const ChangeStateAction = ({
  pauseFlagMouse,
  pauseFlagBtn,
}: ChangeStateActionProps) => {
  const [stateBtn, setStateBtn] = useState(pauseFlagMouse.current);
  const handleChangeStateAction = () => {
    pauseFlagMouse.current = !pauseFlagMouse.current;
    pauseFlagBtn.current = !pauseFlagBtn.current;
    setStateBtn(!stateBtn);
  };
  return (
    <div className="flex text-end items-center gap-2 h-5">
      {!stateBtn ? (
        <FaPause
          size={18}
          color="white"
          onClick={() => handleChangeStateAction()}
        />
      ) : (
        <FaPlay
          size={18}
          color="white"
          onClick={() => handleChangeStateAction()}
        />
      )}
      <FaVolumeXmark size={18} color="white" />
    </div>
  );
};

export default ChangeStateAction;
