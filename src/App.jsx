import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WorldQuiz from "./pages/WorldQuiz";
import ContinentQuiz from "./pages/ContinentQuiz";
import FlagDetail from "./pages/FlagDetail";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/world-quiz" element={<WorldQuiz />} />
        <Route path="/continent/:continentId" element={<ContinentQuiz />} />
        <Route path="/flag/:id" element={<FlagDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
