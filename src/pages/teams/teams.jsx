import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/navbar.jsx";
import "./teams.styles.scss";

const columns = [
  { id: "name", label: "Time", minWidth: 170 },
  { id: "role", label: "Descrição", minWidth: 100 },
  { id: "team", label: "Time Responsável", minWidth: 170 },
];

function Teams() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const BASE_URL = "https://vydra-back.onrender.com";
  const endpoint = `${BASE_URL}/page_teams`;
  const [searchValue, setSearchValue] = useState("");
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); 
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({})
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    major_team_id: null
  });

  const fetchTeams = async () => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();

      const flattenedData = data.flatMap((nestedData) => nestedData);
  
      const mappedData = flattenedData.map((team) => ({
        ...team,
        id: team.id,
      }));
  
      setTeams(mappedData);
      setFilteredTeams(mappedData);

    } catch (error) {
      console.error(error);
    }
  };

  const validateToken = async (token) => {
    let endpoint = `${BASE_URL}/validate-token`
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
    fetchTeams();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event, newValue) => {
    setSearchValue(newValue);
    if (newValue === "" || !newValue) {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter((team) =>
        team.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
    setPage(0);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTeam((prevTeamsetNewTeam) => ({
      ...prevTeamsetNewTeam,
      [name]: value
    }));
  };

  const handleEditInputChange = (event) => {
    console.log(event.target)
    const { name, value } = event.target;
    setSelectedTeam((prevTeam) => ({
      ...prevTeam,
      [name]: value
    }));
  };

  const handleNewTeam = async () => {
    try {
      const response = await fetch(`${BASE_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `${token}`
        },
        body: JSON.stringify(newTeam)
      });
      if (response.ok) {
        setNewTeam({
          name: "",
          description: "",
          major_team_id: null
        });
        handleDialogClose();
        fetchTeams(); 
      } else {
        console.error("Failed to create a new team.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuOpen = (event, team) => {
    setSelectedTeamId(team.id);
    setSelectedTeam(team)
    setMenuAnchorEl(event?.currentTarget);
  };
  
  const handleMenuClose = () => {
    setSelectedTeamId(null);
    setMenuAnchorEl(null); 
  };

  const handleEditTeam = async () => {
    if (!selectedTeamId) {
      console.error("Nenhum time selecionado para edição.");
      return;
    }
    
    try {
      let body = {
        'name': selectedTeam.name,
        'description': selectedTeam.description,
        'major_team_id': selectedTeam.major_team_id,
      }

      if (selectedTeamId === selectedTeam.major_team_id) {
        console.log("O time não pode ser responsável por ele mesmo!")
        return
      }

      const response = await fetch(`${BASE_URL}/teams/${selectedTeamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": `${token}`,
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        fetchTeams();
      } else {
        console.error("Falha ao excluir o time.");
      }
    } catch (error) {
      console.error(error);
    }
  
    handleMenuClose();
  }
  
  const handleDeleteTeam = async () => {
    if (!selectedTeamId) {
      console.error("Nenhum time selecionado para edição.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/teams/${selectedTeamId}`, {
        method: "DELETE",
        headers: {
          token: `${token}`,
        },
      });
  
      if (response.ok) {
        fetchTeams();
      } else {
        console.error("Falha ao excluir o time.");
      }
    } catch (error) {
      console.error(error);
    }
  
    handleMenuClose();
  };
  
  
  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  return (
    <div className="teams">
      <Navbar />
      <div className="h2-teams">Gestão de times</div>
      <div className="search-container">
        <Autocomplete
          value={searchValue}
          onChange={handleSearch}
          options={teams.map((team) => team.name)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar times" />
          )}
        />
        {
          localStorage.getItem('administrator') == "true" && (
            <Button
              variant="contained"
              color="primary"
              className="new-team-button"
              onClick={handleDialogOpen}
            >
              Novo Time
            </Button>
          )
        }
      </div>
      <div className="table-container">
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((team) => (
                    <TableRow key={team.name}>
                      <TableCell align="center">{team.name}</TableCell>
                      <TableCell align="center">{team.description}</TableCell>
                      <TableCell align="center">{team.major_team_name}</TableCell>
                      <TableCell align="center">
                      {
                        localStorage.getItem('administrator') == "true" && (
                          <HiOutlinePencilAlt onClick={(event) => handleMenuOpen(event, team)} />
                        )
                      }
                        <Menu
                          anchorEl={menuAnchorEl}
                          open={Boolean(menuAnchorEl && selectedTeamId === team.id)}
                          onClose={handleMenuClose}
                        >
                        <MenuItem onClick={handleEditDialogOpen}>
                          Atualizar time
                        </MenuItem>
                        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                        <DialogTitle>Editar time</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Nome"
                            type="text"
                            fullWidth
                            value={selectedTeam.name}
                            onChange={handleEditInputChange}
                          />
                          <TextField
                            margin="dense"
                            name="description"
                            label="Descrição"
                            type="text"
                            fullWidth
                            value={selectedTeam.description}
                            onChange={handleEditInputChange}
                          />
                          <Autocomplete
                            onChange={(event, newValue) => setSelectedTeam({...selectedTeam, major_team_id: newValue.id})}
                            options={teams}
                            getOptionLabel={(option) => option.name }
                            renderInput={(params) => (
                              <TextField {...params} label="Time" />
                            )}
                            />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleEditDialogClose}>Cancelar</Button>
                          <Button onClick={handleEditTeam}>Salvar</Button>
                        </DialogActions>
                        </Dialog>
                          <MenuItem onClick={handleDeleteDialogOpen}>
                            Deletar Time
                          </MenuItem>
                          <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogContent>
                              Tem certeza de que deseja excluir este time?
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
                              <Button onClick={handleDeleteTeam}>Deletar</Button>
                            </DialogActions>
                          </Dialog>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredTeams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Novo time</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome"
            type="text"
            fullWidth
            value={newTeam.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição  "
            type="text"
            fullWidth
            value={newTeam.description}
            onChange={handleInputChange}
          />
          <Autocomplete
           onChange={(event, newValue) => setNewTeam({...newTeam, major_team_id: newValue.id})}
           options={teams}
           getOptionLabel={(option) => option.name }
           renderInput={(params) => (
          <TextField {...params} label="Time Responsável" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleNewTeam}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Teams;
