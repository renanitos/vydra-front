import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Analytics from "./pages/analytics/analytics.jsx";
import Climate from "./pages/climate/climate.jsx";
import Employees from "./pages/employees/employees.jsx";
import Login from "./pages/login/login.jsx";
import Okr from "./pages/okr/okr.jsx";
import Organograma from "./pages/organograma/organograma.jsx";
import Painel from "./pages/painel/painel.jsx";
import ChangePassword from "./pages/profile/change_password.jsx";
import Profile from "./pages/profile/profile.jsx";
import Teams from "./pages/teams/teams.jsx";

const ProtectedsRoutes = ({ element }) => {
  const isAdmin = localStorage.getItem('administrator') == "true";

  // Se o usuário for um administrador, renderizar a rota, caso contrário, redirecionar para o login
  return isAdmin ? element : <Navigate to="/painel" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/profile/:employee_id/climate" element={<Climate />} />
        <Route path="/teams/:team_id/okr" element={<Okr />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/organograma" element={<Organograma />} />
        <Route path="/teams/:team_id/analytics" element={<ProtectedsRoutes element={<Analytics />} />} />
      </Routes>
    </Router>
  );
}

export default App;
