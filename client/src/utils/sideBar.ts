import friend from "@/assets/images/friend.png"
import anniversary from "@/assets/images/clock.png"
import saved from "@/assets/images/save-instagram.png"
import groups from "@/assets/images/groups.png"
import video from "@/assets/images/video.png"
import shop from "@/assets/images/shop.png"
import feed from "@/assets/images/feed.png"
import heart from "@/assets/images/heart.png"
import game from "@/assets/images/game.png"
import card from "@/assets/images/card.png"
import cost from "@/assets/images/cost-per-click.png"
import messenger from "@/assets/images/messenger.png"
import reel from "@/assets/images/reel.png"
import gift from "@/assets/images/gift.png"
import calendar from "@/assets/images/calendar.png"
import page from "@/assets/images/facebook-page.png"
import analysis from "@/assets/images/market-research.png"
import climate from "@/assets/images/climate-change.png"
import creator from "@/assets/images/content-creator.png"
import { path } from "@/utils/path"

export const sideBar = [
    {
        id: 1,
        image: friend,
        name: "Tìm bạn bè",
        url: `/${path.FRIENDS}`,
    },
    {
        id: 2,
        image: anniversary,
        name: "Kỉ niệm",
        url: `/${path.MEMORIES}`,
    },
    {
        id: 3,
        image: saved,
        name: "Đã lưu",
        url: "/saved",
    },
    {
        id: 4,
        image: groups,
        name: "Nhóm",
        url: `/${path.GROUPS}`,
    },
    {
        id: 5,
        image: video,
        name: "Video",
        url: `/${path.VIDEO}`,
    },
    {
        id: 6,
        image: shop,
        name: "Marketplace",
        url: `/${path.MARKETPLACE}`,
    },
    {
        id: 7,
        image: feed,
        name: "Bảng feed",
        url: `/${path.FEED}`,
    },
    {
        id: 8,
        image: heart,
        name: "Chiến dịch gây quỹ",
        url: `/${path.FUNDRAISER}`,
    },
    {
        id: 9,
        image: game,
        name: "Chơi game",
        url: `/${path.GAMING_PLAY}`,
    },
    {
        id: 10,
        image: card,
        name: "Đơn đặt hàng và thanh toán",
        url: `/${path.FACEBOOK_PAY}`,
    },
    {
        id: 11,
        image: cost,
        name: "Hoạt động gần đây với quảng cáo",
        url: `/${path.ADS_ACTIVITY}`,
    },
    {
        id: 12,
        image: messenger,
        name: "Messenger",
        url: `/${path.MESSENGER}`,
    },
    {
        id: 13,
        image: reel,
        name: "Reels",
        url: `/${path.REELS}`,
    },
    {
        id: 14,
        image: gift,
        name: "Sinh nhật",
        url: `/${path.EVENTS_BIRTHDAYS}`,
    },
    {
        id: 15,
        image: calendar,
        name: "Sự kiện",
        url: `/${path.EVENTS}`,
    },
    {
        id: 16,
        image: page,
        name: "Trang",
        url: `/${path.PAGES}`,
    },
    {
        id: 17,
        image: analysis,
        name: "Trình quản lý quáng cáo",
        url: `/${path.AD_CAMPAIGN}`,
    },
    {
        id: 18,
        image: climate,
        name: "Trung tâm khoa học khí hậu",
        url: `/${path.CLIMATE_SCIENCE_INFO}`,
    },
    {
        id: 19,
        image: creator,
        name: "Video chơi game",
        url: `/${path.VIDEO_GAMING}`,
    },
]