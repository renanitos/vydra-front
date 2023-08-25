import React, { useState, useEffect } from 'react';
import Node from './node.jsx';
import './organograma.styles.scss';
import Navbar from '../../components/navbar/navbar';
import TeamDialog from './teamDialog.jsx'; 

const Organograma = () => {
  const token = localStorage.getItem('token');
  const BASE_URL = 'http://127.0.0.1:5000';
  const endpoint = `${BASE_URL}/teams`;

  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            token: `${token}`,
          },
        });
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/employees`, {
          headers: {
            token: `${token}`,
          },
        });
        const data = await response.json();
        const membersByTeam = {};

        teams.forEach((team) => {
          const members = data.filter((member) => member.team_id === team.id);
          membersByTeam[team.id] = members;
        });

        setTeamMembers(membersByTeam);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeamMembers();
  }, [teams, token]);

  const renderNodes = (teams, majorTeamId) => {
    const subteams = teams.filter((team) => team.major_team_id === majorTeamId);

    if (subteams.length === 0) {
      return null;
    }

    return subteams.map((team) => (
      <Node
        key={team.id}
        label={team}
        teamMembers={teamMembers[team.id] || []} 
        setSelectedTeam={setSelectedTeam}
        setDialogOpen={setDialogOpen}
      >
        {renderNodes(teams, team.id)}
      </Node>
    ));    
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="organograma">
        {renderNodes(teams, null)}
        <TeamDialog team={selectedTeam} teamMembers={teamMembers[selectedTeam?.id] || []} open={isDialogOpen} onClose={closeDialog} />
      </div>
    </div>
  );
};

export default Organograma;