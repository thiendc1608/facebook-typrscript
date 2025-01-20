import DetailInformation from "@/components/ProfilePage/DetailInformation";
import IntroduceTab from "@/components/ProfilePage/IntroduceTab";
import PersonalInfor from "@/components/ProfilePage/PersonalInfor";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const getItemTab = searchParams.get("sk");
  return (
    <>
      <PersonalInfor />
      <div className="w-full bg-[#F2F4F7]">
        <div className="w-[67%] pt-4 mx-auto flex gap-4 h-full">
          {getItemTab === null && <DetailInformation />}
          {getItemTab === "about" && <IntroduceTab />}
        </div>
      </div>
    </>
  );
};

export default Profile;
