import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import './teamDialog.styles.scss';
import theme from './theme';

const TeamDialog = ({ team, teamMembers, open, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  if (!team) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{team.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>{team.description}</DialogContentText>
          <DialogContentText className="integrantes-title">Integrantes:</DialogContentText>
          <ul className="team-members-list">
            {teamMembers &&
              teamMembers.map((member) => (
                <li key={member.id}>
                  <Avatar className="avatar">{`${member.first_name.charAt(0).toUpperCase()}${member.last_name.charAt(0).toUpperCase()}`}</Avatar>
                  <span>{`${member.first_name} ${member.last_name}`}</span>
                </li>
              ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Link to={`/teams/${team.id}/okr`} style={{ textDecoration: 'none' }}>
            <Button style={{ backgroundColor: '#5A81FA', color: '#FFF' }}>OKRs</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default TeamDialog;
