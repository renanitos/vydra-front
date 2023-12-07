import { Button } from '@mui/material';
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import "./login.styles.scss";

function Login() {
  const navigate = useNavigate();
  const BASE_URL = "https://vydra-back.onrender.com";
  const endpoint = `${BASE_URL}/login`
  const [error, setError] = useState ('');
  const helpMessage = "Caso esteja com problemas para efetuar o login, entre em contato com nosso suporte no email ";

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const loginRequest = async () => {
    const body = { 'login': credentials.email, 'password': credentials.password }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("employee_id", data.employee_id);
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("last_name", data.last_name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("created_at", data.created_at);
      localStorage.setItem("birth_date", data.birth_date);
      localStorage.setItem("role_id", data.role_id);
      localStorage.setItem("team_id", data.team_id);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("administrator", data.administrator);
      navigate('/painel');
    } catch (error) {
      console.error(error);
      setError("Sua conta e/ou senha está(ão) incorreta(s).");
    }
  };

  const [showHelpDiv, setShowHelpDiv] = useState(false);
 
  const toggleHelpDiv = () => {
    setShowHelpDiv(!showHelpDiv);
  };
  

  return (
    <section className='login'>
      <div className='login__form'>
        <span className='default-name'>Vydra</span>
        <h1>Acessar conta</h1>
        <p>Entre na plataforma com o seu e-mail e senha cadastrados</p>
        <form>
          <div className="control">
            <label htmlFor="email">E-mail corporativo</label>
            <input type="email" id="email" name="email" placeholder='Digite seu E-mail'
              value={credentials.email} onChange={handleChange}
            />
          </div>
          <div className="control">
            <input type="password" id="password" name="password" placeholder='Digite sua senha'
              value={credentials.password} onChange={handleChange}
            />
          </div>
          <span className="error-message">{error}</span>
          <span className='forgotten-password'>
            <Link to='#' onClick={toggleHelpDiv}>Esqueceu a senha?</Link>
          </span>
          <Button className='btn-submit' onClick={loginRequest}>Entrar</Button>
        </form>
      </div>
      <div className={`help-div ${showHelpDiv ? 'visible' : ''}`}>
        <p className='text-help'>{helpMessage} <a className='email' href='mailto:vydra@gestão.com.br?subject=Problemas com&body=Estou enfrentando problemas com '>vydra.suporte@gmail.com</a>.</p>
        <Link to={'#'} className='btn-back' onClick={toggleHelpDiv}>VOLTAR</Link>
      </div>
      <div className={`overlay ${showHelpDiv ? 'visible' : ''}`}></div>
      <div className='help-btn'><Link to='#' onClick={toggleHelpDiv}>?</Link></div>
      <div className='login__banner'>
        <img src={logo} alt='LOGO' />
      </div>
    </section>
  );
}

export default Login;
