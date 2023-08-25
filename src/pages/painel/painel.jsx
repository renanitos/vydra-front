import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import MyCircularProgress from "../../components/progresses/circularProgress.jsx";
import BorderLinearProgress from "../../components/progresses/linearProgress.jsx";

import "./painel.styles.scss";


function Painel() {

  const token = localStorage.getItem("token")
  const BASE_URL = "https://vydra-back.onrender.com";

  const [teamFigures, setTeamFigures] = useState([]);
  const [companyFigures, setCompanyFigures] = useState([]);
  const [percentageTeamFigures, setPercentageTeamFigures] = useState([]);

  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const teamId = localStorage.getItem("team_id");

  const endpointTeamFigures = `${BASE_URL}/dashboard?`;
  const endpointCompanyFigures = `${BASE_URL}/dashboard_comp`;
  const endpointTeams = `${BASE_URL}/dashboard_teams`;


  const fetchTeamFigures = async () => {
    try {
      const response = await fetch(`${endpointTeamFigures}team_id=${teamId}`, {
        headers: {
          token: `${token}`
        }
      });
      const figures = await response.json();
      setTeamFigures(figures[0][0]);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanyFigures = async () => {
    try {
      const response = await fetch(endpointCompanyFigures, {
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();
      setCompanyFigures(data[0][0][0]);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(endpointTeams, {
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();
      const transformedData = data[0][0].map((item) => ({
        area: item.name,
        progress: item.percentage === null ? 0 : item.percentage
      }));
      setPercentageTeamFigures(transformedData);
    } catch (error) {
      console.error(error);
    }
  };
  

  const validateToken = async (token) => {
		let endpoint = `${BASE_URL}/validate-token`;
		let body = {
		  'token': token
		}
	
		let options = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		  };
	
		try {
		  let response = await fetch(endpoint, options)
		  if (response.status != 200) return false
		  return true
		}
		catch (error) {
		  return false
		}
	}
	
	async function handleStorageEvent(event) {
		if (event.key === 'token') {
			const validation = await validateToken(event.newValue)
			if (!validation) {
				navigate('/')
				return
			}
		}
	}
  
  useEffect(() => {
    const token = localStorage.getItem("token")
		if (!token){
			navigate('/')
			return
		}
		window.addEventListener('storage', handleStorageEvent);
  }, []);

  useEffect(() => {
    fetchTeamFigures();
    fetchCompanyFigures();
    fetchTeams();
  }, []);

  return (
    <div className="painel">
      <Navbar />
      <h1 className="userName">Olá {firstName} {lastName}! </h1>
      <h2 className="userWelcome">
        Seja bem vindo(a) ao seu painel de controle.
      </h2>
      <div className="okrCompany-container">
        <h3 className="okrCompany-header">Visão Geral da Corporação</h3>
        <div className="okrCompany-box">
          <div className="okrCompany-content">
            <div className="okrCompany-progress">
              <p className="okrCompany-progress-text">OKRs do Ciclo</p>
              <BorderLinearProgress variant="determinate" value={companyFigures.percentage_okr} />
            </div>
            </div>
          <div className="okrCompany-objectives">
            <div className="okrCompany-objectives-text">Objetivos</div>
              <p className="okrCompany-objectives-value">{companyFigures.qtd_objectives}</p>
            </div>
            <div className="okrCompany-objectives ">
               <div className="okrCompany-objectives-text">Resultados Chave</div>
              <p className="okrCompany-objectives-value">{companyFigures.qtd_key_results}</p>
            </div>
        </div>
      </div>
      <div className="okrList-container">
      <div className="okrAreasList-container">
        <h3 className="okrCompany-header">Visão Geral dos times</h3>
        <div className="okrAreasList-box">
          <div className="okrAreasList-content">
            <div className="okrAreasList-progress">
              <List className="classList">
              {percentageTeamFigures.map((item, index) => (
                <React.Fragment key={item.area}>
                  <ListItem className="vertical-align">
                    <ListItemAvatar>
                      <Avatar>{item.area.slice(0, 2)}</Avatar>
                    </ListItemAvatar> 
                    <div className="classListData" >
                    <ListItemText className="align" primary={item.area} secondary={`${item.progress}%`}/>
                     <BorderLinearProgress  variant="determinate" value={item.progress} />
                    </div>
                  </ListItem>
                </React.Fragment>
              ))}
              </List>
            </div>
          </div>
          </div>
        </div>
        <div className="okrTeamsList-container">
          <h3 className="okrCompany-header">Visão Geral do seu time</h3>
         <div className="okrTeamsList-content">
         <div className="okrCircular">
          <div className="progress-label">
            <MyCircularProgress
              variant="determinate"
              value={(teamFigures.objectives_completed / teamFigures.total_objectives) * 100}
            />
            <h4 className="okrList-Figures">
              Objetivos {teamFigures.objectives_completed}/{teamFigures.total_objectives}
            </h4>
          </div>
          <div className="progress-label">
            <MyCircularProgress
              variant="determinate"
              value={(teamFigures.key_results_completed / teamFigures.total_key_results) * 100}
            />
            <h4 className="okrList-Figures">
              Resultados-chave {teamFigures.key_results_completed}/{teamFigures.total_key_results}
            </h4>
          </div>
        </div>
        </div>
        </div>
      </div>  
    </div>
  );
}

export default Painel;