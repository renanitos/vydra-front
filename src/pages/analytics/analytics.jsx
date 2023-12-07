import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import ChatBox from "../../components/ChatBox/ChatBox.jsx";
import jwtDecode from "jwt-decode";
import { useNavigate, useParams } from 'react-router-dom';

function Analytics() {
  const [data, setData] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);
  const token = localStorage.getItem("token");
  let { team_id: teamId } = useParams();

  const navigate = useNavigate();
  const BASE_URL = "https://vydra-back.onrender.com";

  const endpointData = `${BASE_URL}/tasks/all_tasks`;
  const endpointAnswers = `${BASE_URL}/answers/${teamId}`;
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
    return response.status === 200;
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

  const fetchAnswers = async () => {
    try {
      const response = await fetch(endpointAnswers, { headers });
      const answers = await response.json();
      return answers;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
    checkToken();
    fetchAnswers().then((answers) => {
      if (data) {
        const combinedData = {
          tasks: data,
          answers: answers,
        };
        setAnalyzedData(combinedData);
      }
    });
  }, [data, teamId]);

  return (
    <div className="analytics">
      <Navbar />
      <iframe title="dashboard-exemplo" width="1024" height="612" src="https://app.powerbi.com/view?r=eyJrIjoiYjQxODQzNTgtY2Q4Ny00OWU4LTljMjItM2ZmMWZmYjJlMzAwIiwidCI6ImNmNzJlMmJkLTdhMmItNDc4My1iZGViLTM5ZDU3YjA3Zjc2ZiIsImMiOjR9&pageName=ReportSection" frameborder="0" allowFullScreen="true"></iframe>
      <ChatBox />
    </div>
  );
}

export default Analytics;
