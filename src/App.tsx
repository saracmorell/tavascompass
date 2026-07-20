import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Assessment from "@/pages/Assessment";
import Results from "@/pages/Results";
import Success from "@/pages/Success";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/success" element={<Success />} />
      </Route>
    </Routes>
  );
}
