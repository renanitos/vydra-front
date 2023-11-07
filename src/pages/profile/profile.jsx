import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from 'react-router-dom';
import "./profile.styles.scss";

function Profile() {
  const BASE_URL = "https://vydra-back.onrender.com";
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employee_id");
  const email = localStorage.getItem("email");
  const headers = {
    'Content-Type': 'application/json',
    token
  };
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstLetter, setFirstLetter] = useState('');
  const [secLetter, setSecLetter] = useState('');
  const endpoint = `${BASE_URL}/profile?id=${employeeId}`;
  const [roleId, setRoleId] = useState(0);
  const [teamId, setTeamId] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const body = { 'email': email, 'employee_id': employeeId };
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(endpoint, options);
    const data = await response.json();
    setUser(data[0]);
    setFirstName(data[0].first_name);
    setLastName(data[0].last_name);
    setRoleId(data[0].role_id);
    setTeamId(data[0].team_id);
    setFirstLetter(data[0].first_name[0]);
    setSecLetter(data[0].last_name[0]);
  }

  const handleUpdateProfile = async () => {
    const body = {
      'first_name': firstName,
      'last_name': lastName,
      'role_id': roleId,
      'team_id': teamId,
    };

    const options = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(`${BASE_URL}/employees/${employeeId}`, options);
      if (response.status === 200) {
        setMessage('Dados alterados com sucesso.');
        console.log(message)
        window.location.reload();
      } else {
        setMessage('Ocorreu um erro ao alterar os dados.');
        console.log(message)
      }
    } catch (error) {
      setMessage('Ocorreu um erro de rede. Tente novamente mais tarde.');
      console.log(message)
    }

    console.log(message)
  }

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  }

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-container">
        {user ? (
          <>
            <div className="profile-details">
              <div className="form-container">
                <div className="avatar">
                  <p className="initials">{firstLetter}{secLetter}</p>
                </div>
                <form className="form">
                  <label className="label-form" htmlFor="first_name">Nome*</label><br></br>
                  <input className="input-form" type="text" name="first_name" id="first_name" value={firstName} onChange={handleFirstNameChange} /><br></br>
                  <label className="label-form" htmlFor="last_name">Sobrenome*</label><br></br>
                  <input className="input-form" type="text" name="last_name" id="last_name" value={lastName} onChange={handleLastNameChange} /><br></br>
                  <label className="label-form" htmlFor="email">Email*</label><br></br>
                  <input className="input-form" type="text" name="email" id="email" value={user.email} disabled={true} readOnly={true} /><br></br>
                  <br></br>
                  <label className="label-form">Time*</label><br></br>
                  <input className="input-form" type="text" value={user.team_name} disabled={true} readOnly={true} /><br></br>
                  <label className="label-form">Cargo*</label><br></br>
                  <input className="input-form" type="text" value={user.role_name} disabled={true} readOnly={true} /><br></br><br></br>
                  <Button variant="outlined" color="info" component={Link} to="/change_password">Alterar senha</Button><br></br><br></br>
                  <Button variant="contained" color="info" onClick={handleUpdateProfile}>Salvar</Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </div>
      <br></br><br></br>
    </div>
  );
}

export default Profile;
