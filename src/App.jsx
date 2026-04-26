import { useCallback, useState } from "react";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import GuideModal from "./components/guide/GuideModal";
import "./App.css";

const INTRO_STORAGE_KEY = "fp_hasSeenIntro_v1";

function App() {
  const [showLanding, setShowLanding] = useState(() => {
    try {
      return localStorage.getItem(INTRO_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const [guideOpen, setGuideOpen] = useState(false);

  const finishIntro = () => {
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShowLanding(false);
  };

  const setGuide = useCallback((next) => setGuideOpen(Boolean(next)), []);

  if (showLanding) return <LandingPage onContinue={finishIntro} />;

  return (
    <>
      <Home guideModalOpen={guideOpen} onOpenGuide={setGuide} />
      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}

export default App;
