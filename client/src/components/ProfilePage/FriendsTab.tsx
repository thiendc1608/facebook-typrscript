import { userAPI } from "@/apis/userApi";
import { UserType } from "@/types";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

const FriendsTab = () => {
  const [searchParams] = useSearchParams();
  const getUserId = searchParams.get("id")!;
  const [listFriends, setListFriends] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const response = await userAPI.getOtherUsers(getUserId);
        if (response.success) {
          setListFriends(response.allUserFriend);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOtherUser();
  }, [getUserId]);

  return (
    <div className="p-4 w-full bg-white rounded-md h-auto flex flex-col justify-center">
      <div className="w-full text-[#080809] text-[20px] mt-1 mx-[10px] mb-5">
        Bạn bè
      </div>
      <div className="w-full">
        {listFriends.length === 0 ? (
          <div className="text-[#65686c] text-[20px] py-6 px-9 text-center">
            Không có bạn bè nào trong danh sách. Hãy tìm kiếm và kết bạn
          </div>
        ) : (
          <div className="grid grid-cols-2 w-full gap-2">
            {listFriends.map((item) => (
              <div
                key={item.id}
                className="col-span-1 p-4 h-[115px] rounded-lg bg-white border border-solid border-[#f2f2f2]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <Link
                      to={`/profile/${item.id}`}
                      className="w-20 h-20 rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-col gap-2">
                      <span className="text-[17px] text-[#080809]">
                        {item.lastName} {item.firstName}
                      </span>
                      {item.address && (
                        <span className="text-[13px] text-[#65686c]">
                          {item.address}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button className="bg-[#e2e5e9] text-[#080809] text-[15px] hover:bg-[#D6D9DD]">
                    Huỷ kết bạn
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsTab;
