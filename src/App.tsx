import React, { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation, useNavigate } from "react-router-dom";
import { LoginProvider, useLogin } from "./LoginContext";
import DashboardLayout from "./pages/Dashboard/DashboardLayout"; // Updated import
import SignupLogin from "./pages/SignupLogin/SignupLogin"; // Import the SignupLogin component
import Logout from "./pages/Logout/Logout"; // Import the Logout component
import AudioRecoderLayout from "./pages/AudioRecoder/AudioRecoderLayout"; // Import the AudioRecoderLayout
import VoiceChatbot_Interaction_Page from "./pages/VoiceChatTest/VoiceChatTest";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const { isLoggedIn } = useLogin();

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Home";
        metaDescription = "Welcome to the home page";
        break;
      // Add more cases as needed
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        (metaDescriptionTag as HTMLMetaElement).content = metaDescription;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signup");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route path="/dashboard" element={<DashboardLayout />} /> {/* Add the dashboard route */}
      <Route path="/voice-agent" element={<AudioRecoderLayout />} /> {/* Add the audio recorder layout route */}
      <Route path="/voice-agent-test" element={<VoiceChatbot_Interaction_Page />} /> {/* Add the audio recorder layout route */}

     
      <Route path="/signup" element={<SignupLogin />} /> {/* Add the signup route */}
      <Route path="/logout" element={<Logout />} /> {/* Add the logout route */}
    </Routes>
  );
}

export default function WrappedApp() {
  return (
    <LoginProvider>
      <App />
    </LoginProvider>
  );
}