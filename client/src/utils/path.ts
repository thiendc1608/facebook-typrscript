import publicImage from "@/assets/images/public.png";
import onlyFriend from "@/assets/images/only_friend_.png";
import friendExcept from "@/assets/images/friends_except.png";
import specificFriend from "@/assets/images/specific_friends.png";
import onlyMe from "@/assets/images/only_me.png";

export const path = {
  ROOT: "/",
  HOME: "",
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
  OTP: "otp",
  RESET_PASSWORD: "reset-password",
  PROFILE: "profile",
  FRIENDS: "friends",
  MEMORIES: "memories",
  SAVED: "saved",
  GROUPS: "groups",
  VIDEO: "video",
  WATCH: "watch",
  MARKETPLACE: "marketplace",
  ANALYTICS: "analytics",
  FEED: "feed",
  FUNDRAISER: "fundraiser/explore",
  GAMING_PLAY: "gaming/play",
  FACEBOOK_PAY: "facebook_pay",
  ADS_ACTIVITY: "ads/activity",
  MESSENGER: "messenger/t/:id",
  REELS: "reels",
  STORIES: "stories/create",
  STORIES_ID: "stories/:id",
  EVENTS_BIRTHDAYS: "events/birthdays",
  EVENTS: "events",
  PAGES: "pages",
  AD_CAMPAIGN: "ad_campaign",
  CLIMATE_SCIENCE_INFO: "climatescieninfo",
  VIDEO_GAMING: "gaming",
};

export const backGroundContent = [
  {
    id: 1,
    backGround: "rgba(255, 255, 255, 1)",
  },
  {
    id: 2,
    backGround: "rgba(198, 0, 255, 1)",
  },
  {
    id: 3,
    backGround: "rgba(226, 1, 59, 1)",
  },
  {
    id: 4,
    backGround: "rgba(17, 17, 17, 1)",
  },
  {
    id: 5,
    backGround: "linear-gradient(45deg, rgb(255, 0, 71), rgb(44, 52, 199))",
  },
  {
    id: 6,
    backGround: "linear-gradient(45deg, rgb(93, 63, 218), rgb(252, 54, 253))",
  },
  {
    id: 7,
    backGround:
      "url(https://scontent.fhan14-5.fna.fbcdn.net/v/t39.16376-6/27971368_423110001455136_5789798837665136640_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_eui2=AeEgl4CjTtFMwy8locvmsa5W0MjEoEQcna_QyMSgRBydr8vkrCiyAiodUlmkLr4tlyDF9PCZRaPSmTtOOzdSLWlJ&_nc_ohc=3TyV-KXvUJgQ7kNvgFrPlIj&_nc_zt=14&_nc_ht=scontent.fhan14-5.fna&_nc_gid=ADcEn-B-ZDl6VIWc6bA4rfH&oh=00_AYC0loMdJoDJ7ZsRxx2vcCcvL2YZtKFEKmkVTwGldgkjZQ&oe=67210369)",
  },
  {
    id: 8,
    backGround: "linear-gradient(45deg, rgb(93, 99, 116), rgb(22, 24, 29))",
  },
  {
    id: 9,
    backGround:
      "url(https://scontent.fhan14-5.fna.fbcdn.net/v/t39.16376-6/29160588_435684666861727_3152817560781586432_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_eui2=AeHLVB6VXuo6S47J1zLi_I6BbpAppzliuMpukCmnOWK4ymS3Afmi6cmU9lxx1UkzJ8hw9MkNuttKoWSNI_uA12pU&_nc_ohc=1MQjZz1Ji-IQ7kNvgFKF4cP&_nc_zt=14&_nc_ht=scontent.fhan14-5.fna&_nc_gid=ADcEn-B-ZDl6VIWc6bA4rfH&oh=00_AYBeFI-7hRyt-SP1cl0oGPbdTKbR719ISE7en7yIdT9Wsw&oe=67210447)",
  },
];

export const ViewModeList = [
  {
    id: 1,
    icon: publicImage,
    name: "Công khai",
    description: "Bất kỳ ai trên Facebook",
  },
  {
    id: 2,
    icon: onlyFriend,
    name: "Bạn bè",
    description: "Bạn bè của bạn trên Facebook",
  },
  {
    id: 3,
    icon: friendExcept,
    name: "Bạn bè ngoại trừ",
    description: "Không hiển thị với một số bạn bè",
  },
  {
    id: 4,
    icon: specificFriend,
    name: "Bạn bè cụ thể",
    description: "Chỉ hiển thị với một số bạn bè",
  },
  {
    id: 5,
    icon: onlyMe,
    name: "Chỉ mình tôi",
  },
];

export const fontReel = [
  {
    id: 1,
    name: "Gọn gàng",
    font: "font-succinct",
  },
  {
    id: 2,
    name: "Bình thường",
    font: "font-normalLight",
  },
  {
    id: 3,
    name: "Kiểu cách",
    font: "font-style",
  },
  {
    id: 4,
    name: "Tiêu đề",
    font: "font-title",
  },
];

export const backgroundImageReel = [
  {
    id: 1,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/55349832_403803457088017_170167072418955264_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=1SZkrMF-NosQ7kNvgGpgrqf&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBVlVEhBOdN9bGZCrAcfJ9a79nIttL-so0knO1LjHzaVQ&oe=6731662E",
  },
  {
    id: 2,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/40416603_276166656331121_1207155431042973696_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=5mom1jnN2xwQ7kNvgGXSL06&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBChdeLE9GJlALL8RTpg-efgF5jgpxj_TVY48FwU2Tt0w&oe=6731594C",
  },
  {
    id: 3,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/40415976_2163632400574709_6263437381412585472_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=FN_Uc0lAZHgQ7kNvgGSUdWC&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBvjCjAno6E5fH1ImokWEW1tt-eeUE3EwzeMEZaRhkm7Q&oe=673160F8",
  },
  {
    id: 4,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/40511501_525804521192472_6757500320013615104_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=a97AZvTerhEQ7kNvgF4X2qo&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBFIaxHuwRyEgbsCfZKOjbrfb1oqtoUWvbupn-UwKAJ8w&oe=673175C8",
  },
  {
    id: 5,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51670567_1009318279261961_1478806477517881344_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=DP-fXE9jr4wQ7kNvgGoPdpb&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBaAFzUTsVM9asBxh3U6jmjzQR6T6c-nX09SJlQx15hhw&oe=67316F2B",
  },
  {
    id: 6,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/40315930_452537141905851_1362647841457045504_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=sClow-XmRrQQ7kNvgGu_twx&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYCNXkozYO3u8WmWhzwVJX8GWgpeozmcfYmWy50bQNgG2w&oe=673183A8",
  },
  {
    id: 7,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/58262940_285817512345690_8722691640277336064_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=6jqT90DuYfoQ7kNvgFQXDQg&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYBy9PlehUajIloqwUqZN1jTEHUcIudLhW2tcciDWPy1Hg&oe=673161CB",
  },
  {
    id: 8,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51444449_241165266799621_5201263940155211776_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=Z-yJfmDY2pEQ7kNvgHdnxiT&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYAwXQ9dHdBZnZI-TAGVkWWgQdmdwj3Jrjc0tXGhd5LxWw&oe=67317959",
  },
  {
    id: 9,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51773321_459530704584489_7020247985183260672_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=6CpACj8258gQ7kNvgFrn769&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYCzSCijiAQrA7QyN8-3KwhSf9Nx0h9vxIBF3iGwzFyp0w&oe=67315FC7",
  },
  {
    id: 10,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51659228_2173297926332597_6675787257242189824_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=AmYuUEkYzisQ7kNvgEptqdy&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYCh6Qqc38AMDFIHp8OwStQyHctt65hFtbj55fArHF_XEA&oe=67317F4F",
  },
  {
    id: 11,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51747058_367314920518077_4129068334446542848_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=aTZmnhsO8oQQ7kNvgHV-4hh&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYAGBNadCYWvX4kn_3Tyb3ykbikD2im0BMc3kexSLK473w&oe=67315177",
  },
  {
    id: 12,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51716938_316152722351371_3882775088419831808_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=XXx7FrBkSGsQ7kNvgFkD-v2&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYDj3E0d153CoNW6lXCECn0m-cZKdZ1tmrX6atewecXPGQ&oe=673172A1",
  },
  {
    id: 13,
    srcImg:
      "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.16376-6/51807389_1793841934061296_4256928570250625024_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=427b5c&_nc_ohc=lXoD9zY8_3AQ7kNvgGPCDif&_nc_zt=14&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYAO6RAHzR_8_DGDg54EJ-_kwrpTt893cLJIREQHvKKvYQ&oe=67315C86",
  },
  {
    id: 14,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51692760_2349018382009504_1354244768007192576_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=-Rq5DXYtG0cQ7kNvgHKTZGq&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYAmegbLNfFe7AHy0vgz3j7Zom8zVa84zMdNpcoB7iAkvA&oe=6731529E",
  },
  {
    id: 15,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51618036_236995930542329_4218790918519521280_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=R1x_smFdbvoQ7kNvgF4B--r&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYCubuaaHOMJH6VZlh5Pop11AW8097bfPXn5gC6u1GCIuA&oe=67315E0A",
  },
  {
    id: 16,
    srcImg:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.16376-6/51656974_554617655055750_2554822740104183808_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=qz7ACT-X_wkQ7kNvgFQq6ol&_nc_zt=14&_nc_ht=scontent.fhan2-3.fna&_nc_gid=AjGT1UQUdFQgoRzrLMU-maW&oh=00_AYB9dj_roPK0xC1sGuqYXU08C04T08DiWlAg5y2bJ7hgwA&oe=673169AB",
  },
];

export const themeColorChat = [
  {
    id: 1,
    color: "#0866ff",
  },
  {
    id: 2,
    color: "#8F5900",
  },
  {
    id: 3,
    color: "#353342",
  },
  {
    id: 4,
    color: "#145718",
  },
  {
    id: 5,
    color: "#AC2F01",
  },
  {
    id: 6,
    color: "#D27300",
  },
  {
    id: 7,
    color: "#7F55FE",
  },
  {
    id: 8,
    color: "#DD087D",
  },
  {
    id: 9,
    color: "#978E21",
  },
  {
    id: 10,
    color: "#507D39",
  },
  {
    id: 11,
    color: "#5E007E",
  },
  {
    id: 12,
    color: "#493BB8",
  },
  {
    id: 13,
    color: "#6EDF00",
  },
  {
    id: 14,
    color: "#EDA600",
  },
  {
    id: 15,
    color: "#AA3232",
  },
  {
    id: 16,
    color: "#A797FF",
  },
  {
    id: 17,
    color: "#FF311E",
  },
  {
    id: 18,
    color: "#41D443",
  },
  {
    id: 19,
    color: "#A5382D",
  },
  {
    id: 20,
    color: "#DA2944",
  },
];
