import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import jwtDecode from "jwt-decode";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@mui/material"
import "./climate.styles.scss";
import CreateTheme from "../../components/colors.jsx";
import { ThemeProvider } from '@mui/material/styles';


function Climate() {
  const [data, setData] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [isFinalizing, setIsFinalizing] = useState(false); 
  const [showThankYou, setShowThankYou] = useState(false); 
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employee_id");
  const teamId = localStorage.getItem("team_id");
  const BASE_URL = "https://vydra-back.onrender.com";
  const headers = {
    'Content-Type': 'application/json',
    token
  };
  const endpointData = `${BASE_URL}/questions/${employeeId}`;
  const endpointAnswer = `${BASE_URL}/answer`;

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

  const fetchData = async () => {
    try {
      const url = `${endpointData}?employee_id=${employeeId}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespondClick = () => {
    setShowQuestion(true); 
  };

  const handleAnswerButtonClick = (value) => {
    setSelectedValue(value);
  };

  const handleNextQuestion = () => {
    if (selectedValue !== null) {
      const newAnswer = {
        question_id: data.questions[currentQuestionIndex].question_id,
        team_id: teamId,
        value: selectedValue,
      };
      setAnswers([...answers, newAnswer]);
      if (currentQuestionIndex < data.questions.length - 1) {
        const nextQuestionId = data.questions[currentQuestionIndex + 1].question_id;
        const nextQuestionAnswer = answers.find((answer) => answer.question_id === nextQuestionId);
        setSelectedValue(nextQuestionAnswer ? nextQuestionAnswer.value : null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsFinalizing(true);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers.find(
        (answer) => answer.question_id === data.questions[currentQuestionIndex - 1].question_id
      );
      setSelectedValue(previousAnswer ? previousAnswer.value : null);
    }
  };
  
  const handleFinalizeWave = async () => {
    const payload = {
      answers: answers,
      employee_id: employeeId,
    };

    const endpoint = endpointAnswer;
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(endpoint, options);
      if (response.status === 200) {
        setShowThankYou(true);
      } else {
        console.error('Erro ao finalizar a onda.');
      }
    } catch (error) {
      console.error('Erro ao finalizar a onda:', error);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };
  

  return (
    <div>
      {showThankYou ? (
        <div className="thankYouContainer">
        <Navbar />
        <div className="thankYouMessage">
          <h2 className="thankYouText">Obrigado por sua resposta!</h2>
          <Link to="/painel" className={`navbar-link ${isActiveLink('/painel') ? 'active' : ''}`}>
            <Button variant="contained">Voltar ao Painel</Button>
          </Link>
        </div>
        </div>
      ) : (
    <div>
      <Navbar />
      <div className="container">
        {!showQuestion && data && (
          data.permission ? (
            <div className="box">
              <h2 className="climateText">Responder Onda</h2>
              <ThemeProvider theme={CreateTheme}>
                <Button variant="contained" onClick={handleRespondClick}>Responder</Button>
              </ThemeProvider>
            </div>
          ) : (
            <h2 className="climateInvitation">Não existe uma onda disponível no momento</h2>
          )
        )}
        {showQuestion && data && data.questions.length > 0 && (
          <div className="questionBox">
            <h2 className="climateText">{data.questions[currentQuestionIndex].description}</h2>
            <div className="answerButtons">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <Button
                  key={value}
                  variant="contained"
                  onClick={() => handleAnswerButtonClick(value)}
                  style={{ backgroundColor: selectedValue === value ? "#5A98E2" : "" }}
                >
                  {value}
                </Button>
              ))}
            </div>
            <div className="auxiliaryValues">
              {data.questions[currentQuestionIndex].min_value && (
                <h3 className="minValue">{data.questions[currentQuestionIndex].min_value}</h3>
              )}
              {data.questions[currentQuestionIndex].max_value && (
                <h3 className="maxValue">{data.questions[currentQuestionIndex].max_value}</h3>
              )}
            </div>
            <div className="questionButtons">
                <ThemeProvider theme={CreateTheme}> 
                  <Button className="btn-previousQuestion" variant="contained" color="secondary" onClick={handlePreviousQuestion}>
                    Revisar Anterior
                  </Button>
                  {isFinalizing ? (
                    <Button className="btn-finalizeWave" variant="contained" onClick={handleFinalizeWave}>
                      Finalizar Onda
                    </Button>
                  ) : (
                    <Button className="btn-nextQuestion" variant="contained" onClick={handleNextQuestion}>
                      Próxima Pergunta
                    </Button>
                  )}
                  </ThemeProvider>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Climate;
