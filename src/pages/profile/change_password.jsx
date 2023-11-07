import React, { useState } from "react";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from 'react-router-dom';


function ChangePassword() {
  const BASE_URL = "https://vydra-back.onrender.com";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const headers = {
    'Content-Type': 'application/json',
    'token': token
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setMessageType('error');
      return;
    }

    const body = {
      'password': newPassword,
      'confirm_password': confirmPassword
    };

    const options = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, options);
      if (response.status === 200) {
        setMessage('Senha alterada com sucesso.');
        setMessageType('success');
      } else {
        setMessage('Ocorreu um erro ao alterar a senha.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Ocorreu um erro de rede. Tente novamente mais tarde.');
      setMessageType('error');
    }
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-container">
        <div className="profile-details">
          <div className="form-container">
            <form className="form margin-30">
              <label className="label-form" htmlFor="newPassword">Nova senha*</label><br></br>
              <input className="input-form" type="password" name="newPassword" id="newPassword" onChange={(e) => setNewPassword(e.target.value)} /><br></br>
              <label className="label-form" htmlFor="confirmPassword">Confirme a senha*</label><br></br>
              <input className="input-form" type="password" name="confirmPassword" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} /><br></br>
              {message && <p className={messageType === 'success' ? "success-message" : "error-message"}>{message}</p>}<br></br>
              <div className="div-buttons-change">
                <Button color="info" component={Link} to="/profile">Cancelar</Button>
                <Button color="info" variant="contained" onClick={handleChangePassword}>Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
