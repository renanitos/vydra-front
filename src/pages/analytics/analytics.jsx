import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import jwtDecode from "jwt-decode";
import { Link, useNavigate, useParams } from 'react-router-dom';

function Analytics() {

  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  let { team_id: teamId } = useParams();

  const navigate = useNavigate();
  const BASE_URL = "https://vydra-back.onrender.com";

  const endpointData = `${BASE_URL}/tasks/all_tasks`;
  const headers = {
    'Content-Type': 'application/json',
    token
  };

  const handleStorageEvent = async (event) => {
    const keysToWatch = ['token'];
    if (keysToWatch.includes(event.key)) {
      const validation = await validateToken(event.newValue);
      if (!validation) {
        navigate('/');
      }
    }
  };

  const validateToken = async (token) => {
    const endpoint = `${BASE_URL}/validate-token`;
    const body = { token };
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(endpoint, options);
    if (response.status !== 200) return false;
    return true;
  };

  const checkToken = () => {
    if (!token) {
      navigate('/');
      return;
    }
    if (!teamId) {
      const loggedUser = jwtDecode(token);
      teamId = loggedUser.username.team_id;
    }
    window.addEventListener('storage', handleStorageEvent);
  };

  const treatRoute = async () => {
    checkToken();
    try {
      if (teamId) {
        const response = await fetch(`${BASE_URL}/teams/${teamId}`, { headers });
        const result = await response.json();
        setTeam(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const url = `${endpointData}?team_id=${teamId}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    treatRoute();
  }, []);

  return (
    <div className="analytics"> 
     <Navbar />
     <h1 className="userName">Central de análise</h1>
     {data && (
       <div>
         <pre>{JSON.stringify(data, null, 2)}</pre>
       </div>
     )}
    </div>
  );
}

export default Analytics;
