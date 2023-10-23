import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Employees from "./pages/employees/employees.jsx";
import Login from "./pages/login/login.jsx";
import Okr from "./pages/okr/okr.jsx";
import Organograma from "./pages/organograma/organograma.jsx";
import Analytics from "./pages/analytics/analytics.jsx";
import Painel from "./pages/painel/painel.jsx";
import Profile from "./pages/profile/profile.jsx";
import Teams from "./pages/teams/teams.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/teams/:team_id/okr" element={<Okr />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/organograma" element={<Organograma />} />
        <Route path="/teams/:team_id/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
