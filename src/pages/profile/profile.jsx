import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import "./profile.styles.scss";

function Profile() {
  const BASE_URL = "https://vydra-back.onrender.com";
  const token = localStorage.getItem("token")
  const employeeId = localStorage.getItem("employee_id")
  const email = localStorage.getItem("email")
  const headers = {
    'Content-Type': 'application/json',
    token
  };
  const [name, setName] = useState()
  const [user, setUser] = useState()
  const endpoint = `${BASE_URL}/profile?id=${employeeId}`;

  useEffect(() => {
    fetchProfile();
  }, [])

  const fetchProfile = async () => {
    const body = { 'email': email, 'employee_id': employeeId }
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(endpoint, options);
    const data = await response.json();
    setUser(data[0])
    setName(data[0].first_name)
  }
  console.log(user)

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-container">
        {user ? (
          <>
            <h3 className="profile-header">Perfil de {user.first_name} {user.last_name}</h3>
            <div className="profile-details">
              <div>
                <p><strong>Nome:</strong> {user.first_name}</p>
                <p><strong>Sobrenome:</strong> {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <br/>
                <p><strong>Time:</strong> {user.team_name}</p>
                <p><strong>Cargo:</strong> {user.role_name}</p>
              </div>
            </div>
          </>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
