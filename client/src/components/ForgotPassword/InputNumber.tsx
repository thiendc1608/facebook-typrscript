import { memo } from "react";
import "./ForgotPassword.css";

interface InputNumberProps {
  OTPinput: string[];
  setOTPinput: (OTPinput: string[]) => void;
  indexNumber: number;
}

const InputNumber = ({
  OTPinput,
  setOTPinput,
  indexNumber,
}: InputNumberProps) => {
  const jumpToNextPcInput = (currentIndex: number) => {
    currentIndex++;
    const pcElement = document.getElementById("pc" + currentIndex);
    if (pcElement === null) return;
    pcElement.focus();
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") return;
    jumpToNextPcInput(indexNumber);
  };

  return (
    <div className="w-16 h-16">
      <input
        id={`pc${indexNumber}`}
        maxLength={1}
        className="inputStyle"
        style={{
          width: "100%",
          padding: "6px",
          height: "100%",
          borderRadius: "12px",
          outline: "none",
          border: "1px solid #E5E7EB",
          backgroundColor: "white",
          color: "black",
          fontSize: "18px",
          lineHeight: "28px",
          textAlign: "center",
        }}
        type="text"
        onKeyUp={(e) => handleOnKeyUp(e)}
        onChange={(e) => {
          OTPinput.splice(indexNumber, 1, e.target.value);
          setOTPinput(OTPinput);
        }}
      ></input>
    </div>
  );
};

export default memo(InputNumber);
