// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/routes/root";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import { path } from "@/utils/path";
import Profile from "@/pages/Profile";
import Friends from "@/pages/Friends";
import Memories from "@/pages/Memories";
import Saved from "@/pages/Saved";
import Groups from "@/pages/Groups";
import Video from "@/pages/Video";
import MarketPlace from "@/pages/MarketPlace";
import Feed from "@/pages/Feed";
import Fundraiser from "@/pages/Fundraiser";
import GamingPlay from "@/pages/GamingPlay";
import FacebookPay from "@/pages/FacebookPay";
import AdsActivity from "@/pages/AdsActivity";
import Messenger from "@/pages/Messenger";
import Reels from "@/pages/Reels";
import EventBirthday from "@/pages/EventBirthday";
import Events from "@/pages/Events";
import Pages from "@/pages/Pages";
import AdCampaign from "@/pages/AdCampaign";
import ClimateScienceInfo from "@/pages/ClimateScienceInfo";
import VideoGaming from "@/pages/VideoGaming";
import Login from "@/pages/LoginRegister/Login";
import Register from "@/pages/LoginRegister/Register";
import ForgotPassword from "./pages/LoginRegister/ForgotPassword";
import RootResetPassword from "./pages/LoginRegister/RootResetPassword";
import OTP from "./pages/LoginRegister/InputOTP";
import { Provider } from "react-redux";
// import { persistor, store } from "./redux/store";
import { store } from "./redux/store";
import ResetPassword from "./pages/LoginRegister/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { PersistGate } from "redux-persist/integration/react";
import CreateStories from "./components/Reels/Stories/CreateStories";
import CreateStoriesView from "./pages/CreateStoriesView";
import { SocketProvider } from "./context/SocketContext";
import { SkeletonTheme } from "react-loading-skeleton";
import ShowDetailPost from "./components/ContentPost/ShowPostHome/ShowDetailPost";
import { PostProvider } from "./context/PostContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: `${path.HOME}`,
        element: <Home />,
      },
      {
        path: `${path.PROFILE}`,
        element: <Profile />,
      },
      {
        path: `${path.FRIENDS}`,
        element: <Friends />,
      },
      {
        path: `${path.MEMORIES}`,
        element: <Memories />,
      },
      {
        path: `${path.SAVED}`,
        element: <Saved />,
      },
      {
        path: `${path.GROUPS}`,
        element: <Groups />,
      },
      {
        path: `${path.VIDEO}`,
        element: <Video />,
      },
      {
        path: `${path.MARKETPLACE}`,
        element: <MarketPlace />,
      },
      {
        path: `${path.FEED}`,
        element: <Feed />,
      },
      {
        path: `${path.FUNDRAISER}`,
        element: <Fundraiser />,
      },
      {
        path: `${path.GAMING_PLAY}`,
        element: <GamingPlay />,
      },
      {
        path: `${path.FACEBOOK_PAY}`,
        element: <FacebookPay />,
      },
      {
        path: `${path.ADS_ACTIVITY}`,
        element: <AdsActivity />,
      },
      {
        path: `${path.MESSENGER}`,
        element: <Messenger />,
      },
      {
        path: `${path.EVENTS_BIRTHDAYS}`,
        element: <EventBirthday />,
      },
      {
        path: `${path.EVENTS}`,
        element: <Events />,
      },
      {
        path: `${path.PAGES}`,
        element: <Pages />,
      },
      {
        path: `${path.AD_CAMPAIGN}`,
        element: <AdCampaign />,
      },
      {
        path: `${path.CLIMATE_SCIENCE_INFO}`,
        element: <ClimateScienceInfo />,
      },
      {
        path: `${path.VIDEO_GAMING}`,
        element: <VideoGaming />,
      },
      {
        path: `${path.STORIES_ID}`,
        element: <CreateStoriesView />,
      },
    ],
  },
  {
    path: `${path.REELS}`,
    element: <Reels />,
  },
  {
    path: `${path.STORIES}`,
    element: <CreateStories />,
  },
  {
    path: `${path.DETAIL_POST}`,
    element: <ShowDetailPost />,
  },
  {
    path: `${path.LOGIN}`,
    element: <Login />,
  },
  {
    path: `${path.REGISTER}`,
    element: <Register />,
  },
  {
    path: `${path.FORGOT_PASSWORD}`,
    element: <RootResetPassword />,
    children: [
      {
        path: "",
        element: <ForgotPassword />,
      },
      {
        path: `${path.OTP}`,
        element: <OTP />,
      },
      {
        path: `${path.RESET_PASSWORD}`,
        element: <ResetPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <>
    {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider> */}
    <SkeletonTheme baseColor="#E8E9EA" highlightColor="#999">
      <SocketProvider>
        <PostProvider>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </PostProvider>
      </SocketProvider>
    </SkeletonTheme>
    <ToastContainer
      position="top-right"
      autoClose={300}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="colored"
    />
    {/* Same as */}
    {/* </StrictMode> */}
  </>
);
