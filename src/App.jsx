import { useCallback, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import GuideModal from "./components/guide/GuideModal";
import PrivacyAcknowledgmentModal from "./components/PrivacyAcknowledgmentModal";
import "./App.css";

const INTRO_STORAGE_KEY = "fp_hasSeenIntro_v1";
const PRIVACY_ACK_STORAGE_KEY = "fp_privacyAck_v1";

function App() {
  const [privacyOpen, setPrivacyOpen] = useState(() => {
    try {
      return localStorage.getItem(PRIVACY_ACK_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const [showLanding, setShowLanding] = useState(() => {
    try {
      return localStorage.getItem(INTRO_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const [guideOpen, setGuideOpen] = useState(false);

  const acknowledgePrivacy = () => {
    try {
      localStorage.setItem(PRIVACY_ACK_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setPrivacyOpen(false);
  };

  const finishIntro = () => {
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShowLanding(false);
  };

  const setGuide = useCallback((next) => setGuideOpen(Boolean(next)), []);

  return (
    <>
      <PrivacyAcknowledgmentModal open={privacyOpen} onAcknowledge={acknowledgePrivacy} />
      {showLanding ? (
        <LandingPage onContinue={finishIntro} />
      ) : (
        <>
          <Home guideModalOpen={guideOpen} onOpenGuide={setGuide} />
          <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
        </>
      )}
      <Analytics />
    </>
  );
}

export default App;
