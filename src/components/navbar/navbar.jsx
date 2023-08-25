import { Button, Dialog, DialogActions, DialogTitle, Menu, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';
import { HiLogout } from "react-icons/hi";
import { HiEllipsisVertical, HiUserGroup, HiUsers } from 'react-icons/hi2';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Avatar } from '@mui/material';
import './Navbar.scss';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [openLogout, setOpenLogout] = useState(false);
  const open2 = !!anchorEl2;

  const [firstName, setFirstName] = useState('');
  const [teamId, setTeamId] = useState('');

  const handleProfileClick = (event) => {
    navigate("/profile")
  }

  const handleConfigClick = (event) => setAnchorEl2(event.currentTarget);
  const handleLogoutClick = (event) => {
    setOpenLogout(true)
  }
  const handleClose2 = () => setAnchorEl2(null);

  const handleLogout = (event) => {
    event.preventDefault();
    if (token) {
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    const firstName = localStorage.getItem("first_name");
    const teamId = localStorage.getItem("team_id");
    setFirstName(firstName);
    setTeamId(teamId);
  }, []);

  const handleLogoutDialogCloseCancel = () => {
    setOpenLogout(false)
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/painel" className={`navbar-name ${isActiveLink('/painel') ? 'active' : ''}`}>
          Vydra
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/painel" className={`navbar-link ${isActiveLink('/painel') ? 'active' : ''}`}>
          Painel
        </Link>
        <Link to={`/teams/${teamId}/okr`} className={`navbar-link ${isActiveLink(`/teams/${teamId}/okr`) ? 'active' : ''}`}>
          OKR
        </Link>
        <Link to="/organograma" className={`navbar-link ${isActiveLink('/organograma') ? 'active' : ''}`}>
          Organograma
        </Link>
      </div>
      <div className="navbar-right">
        <div className="navbar-icon">
          <Tooltip title="Configuracoes">
            <IconButton
              onClick={handleConfigClick}
              sx={{ ml: 2 }}
              aria-controls={open2 ? 'config-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? 'true' : undefined}
            >
              <HiEllipsisVertical />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl2}
            id="config-menu"
            open={open2}
            onClose={handleClose2}
            onClick={handleClose2}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem component={Link} to="/teams">
              <ListItemIcon>
                <HiUsers />
              </ListItemIcon>
              Times
            </MenuItem>
            <MenuItem component={Link} to="/employees">
              <ListItemIcon>
                <HiUserGroup />
              </ListItemIcon>
              Funcionários
            </MenuItem>
          </Menu>
        </div>
        <div className="navbar-icon">
          <Tooltip title="Meu Perfil">
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{`${firstName.charAt(0).toUpperCase()}`}</Avatar>
            </IconButton>
          </Tooltip>
        </div>
        <div className="navbar-icon">
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogoutClick}
              size="small"
              sx={{ ml: 2 }}
              Tooltip="Logout"
            >
              <HiLogout/>
            </IconButton>
          </Tooltip>
          <Dialog open={openLogout}>
            <DialogTitle>Você realmente deseja sair?</DialogTitle>
            <DialogActions>
              <Button onClick={handleLogoutDialogCloseCancel}>Cancelar</Button>
              <Button onClick={handleLogout}><Link to="/" className="navbar-link">Sair</Link></Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;