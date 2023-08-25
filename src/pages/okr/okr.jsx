import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from '@mui/material/Avatar';
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { HiChevronDown, HiEye, HiOutlineCog6Tooth, HiPlus, HiTrash } from "react-icons/hi2";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../components/navbar/navbar.jsx";
import "./okr.styles.scss";

function Okr() {
  const token = localStorage.getItem('token');
  let { team_id: teamId } = useParams();

  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:5000";
  const endpoint = `${BASE_URL}/objectives`;
  const endpointTeams = `${BASE_URL}/teams`;
  const headers = {
    'Content-Type': 'application/json',
    token
  };

  const [displayObjectives, setDisplayObjectives] = useState([]);
  const [objectivesToStart, setObjectivesToStart] = useState([]);
  const [finishedObjectives, setFinishedObjectives] = useState([]);
  const [team, setTeam] = useState({});
  const options = {
    name: '',
    description: '',
    prevision_date: '',
    status: false,
    team_id: teamId
  };
  const optionsKr = {
    name: '',
    weight: 0,
    objective_id: null,
    prevision_date_formated: '',
    responsable_id: null,
    responsable: null,
    percentage: 0
  };
  const [formData, setFormData] = useState({ ...options });
  const [formDataKr, setFormDataKr] = useState({ ...optionsKr });
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogKr, setOpenDialogKr] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteDialogKr, setDeleteDialogKr] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedKr, setSelectedKr] = useState(null);
  const [statusDialog, setStatusDialog] = useState('Novo')
  const [statusDialogKr, setStatusDialogKr] = useState('Novo')
  const [employees, setEmployees] = useState([])
  const [searchValue, setSearchValue] = useState("");
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  const handleCheckChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    setDisplayObjectives(isChecked ? finishedObjectives : objectivesToStart);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };
  const handleChangeCheckbox = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["status"]: event.target.checked
    }));
  };
  const handleChangeKr = (event) => {
    const { name, value } = event.target;
    setFormDataKr((prevFormDataKr) => ({
      ...prevFormDataKr,
      [name]: value
    }));
  };
  const handleChangeCheckboxKr = (event) => {
    let percentage = 0
    if (event.target.checked) percentage = 100
    setFormDataKr((prevFormDataKr) => ({
      ...prevFormDataKr,
      ["percentage"]: percentage
    }));
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);
  const handleDialogObjectiveOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setStatusDialog("Novo")
    setOpenDialog(false);
    setFormData(options)
  } 
  const handleDialogCloseKr = () => {
    setStatusDialogKr("Novo")
    setOpenDialogKr(false);
    setFormDataKr(options)
  } 
  const handleDialogObjectiveEditOpen = (objective) => {
    objective.prevision_date = formatDate(objective.prevision_date)
    setFormData(objective)
    setOpenDialog(true)
    setStatusDialog("Editar")
  }
  const handleDialogKrOpen = (objectiveId) => {
    setOpenDialogKr(true);
    setSelectedObjective(objectiveId)
  }
  const handleDialogKrClose = () => {
    setStatusDialogKr("Novo")
    setOpenDialogKr(false);
    setSelectedObjective(null);
    setFormDataKr(optionsKr)
  } 
  const handleDialogKrEditOpen = (kr) => {
    kr.prevision_date_formated = formatDate(kr.prevision_date)
    setFormDataKr(kr)
    setOpenDialogKr(true)
    setStatusDialogKr("Editar")
  }
  const handleStorageEvent = async (event) => {
    const keysToWatch = ['token'];
    if (keysToWatch.includes(event.key)) {
      const validation = await validateToken(event.newValue);
      if (!validation) {
        navigate('/');
      }
    }
  };
  const handleDeleteObjectiveDialog = (objective) => {
    setSelectedObjective(objective.id)
    setDeleteDialog(true);
  }

  const handleDeleteKrDialog = (keyResult) => {
    setSelectedKr(keyResult.id)
    setDeleteDialogKr(true);
  }
  const handleDeleteDialogClose = () => setDeleteDialog(false);
  const handleDeleteKrDialogClose = () => setDeleteDialogKr(false);

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

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(endpointTeams, {
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

  const fetchObjectives = async () => {
    try {
      const keyResultsResponse = await fetch(`${BASE_URL}/page_key_results`, { headers });
      const keyResults = await keyResultsResponse.json();

      const response = await fetch(endpoint, { headers });
      const results = await response.json();
      const objectives = results
        .filter(({ team_id }) => +team_id === +teamId)
        .map((objective) => {
          objective.key_results = keyResults.filter((keyResults) => keyResults.objective_id === objective.id) || [];
          return objective;
        });

      const objectivesToStart = objectives.filter(({ status }) => !status);
      const finishedObjectives = objectives.filter(({ status }) => !!status)
      setObjectivesToStart(objectivesToStart);
      setFinishedObjectives(finishedObjectives);
      setDisplayObjectives(objectivesToStart);
      setChecked(false)
    } catch (error) {
      console.error(error);
    }
  };


  const handleSearch = (newValue) => {
    setSearchValue(newValue);
    if (newValue === "" || !newValue) {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter((team) =>
        team.name.toLowerCase().includes(newValue.name.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  };

  const handleTeamSelection = (teamId) => {
    navigate(`/teams/${teamId}/okr`)
    window.location.reload()
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let metodo;
      let endpointSubmit;
      if (statusDialog !== "Editar") {
        metodo = "POST"
        endpointSubmit = endpoint
      }
      else {
        metodo = "PUT"
        endpointSubmit = endpoint + "/" + formData.id
      }
      const response = await fetch(endpointSubmit, {
        method: metodo,
        headers,
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ ...options });
        handleDialogClose();
        fetchObjectives();
      } else {
        console.error("Failed to register new objective.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleSubmitKr = async (event) => {
    event.preventDefault();
    setLoading(true);
    formDataKr.objective_id = selectedObjective
    try {
      let metodo;
      let endpointSubmit = `${BASE_URL}/key_results`;
      if (statusDialogKr !== "Editar") {
        metodo = "POST"
      }
      else {
        metodo = "PUT"
        endpointSubmit += "/" + formDataKr.id
      }
      const response = await fetch(endpointSubmit, {
        method: metodo,
        headers,
        body: JSON.stringify(formDataKr)
      });
      if (response.ok) {
        setFormDataKr({ ...options });
        handleDialogCloseKr();
        fetchObjectives();
      } else {
        console.error("Failed to register a key-result.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleDeleteObjective = async () => {
    if (!selectedObjective) {
      console.error("Nenhum objetivo selecionado para exclusão.");
      return;
    }
    try {
      const response = await fetch(`${endpoint}/${selectedObjective}`, {
        method: "DELETE",
        headers
      });

      if (response.ok) {
        fetchObjectives();
        setSelectedObjective(null);
        handleDeleteDialogClose();
      } else {
        console.error("Falha ao excluir o objetivo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteKr = async () => {
    if (!selectedKr) {
      console.error("Nenhum resultado-chave selecionado para exclusão.");
      return;
    }
    let endpointDelete = `${BASE_URL}/key_results`;
    try {
      const response = await fetch(`${endpointDelete}/${selectedKr}`, {
        method: "DELETE",
        headers
      });

      if (response.ok) {
        fetchObjectives();
        setSelectedKr(null)
        handleDeleteKrDialogClose();
      } else {
        console.error("Falha ao excluir o resultado-chave.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutoComplete = (newValue) => {
    handleSearch(newValue);
    let selectedTeam = teams.find((team) => team.name === newValue.name);
    if (selectedTeam) {
      handleTeamSelection(selectedTeam.id);
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employees`, {
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();
      const flattenedData = data.flatMap((nestedData) => nestedData);
      const mappedData = flattenedData.map((employee) => ({
        ...employee,
        id: employee.id,
      }));
  
      setEmployees(mappedData);

    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    var date = new Date(dateString),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const formatDateKr = (dateString) => {
    var date = new Date(dateString),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
  }

  useEffect(() => {
    treatRoute();
    fetchObjectives();
    fetchEmployees();
  }, []);

  return (
    <main className="okr__view">
      <Navbar />
      <h3 className="title">Gestão de OKRs do time {team.name}</h3>
      <header>
        <div className="search-container">
          <Autocomplete
            defaultValue={"Selecione"}
            sx={{ width: 200 }}
            value={searchValue}
            getOptionLabel={(option) => option.name || "" }
            onChange={(event, newValue) => handleAutoComplete(newValue)}
            options={teams}
            renderInput={(params) => <TextField {...params} label="Buscar times" />}
          />
        </div>
        <div className="okr__actions">
          <p>
            <span className="label">Objetivos Finalizados</span>
            <Switch
              checked={checked}
              color="primary"
              onChange={handleCheckChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </p>
          <Button size="small" variant="contained" onClick={handleDialogObjectiveOpen} startIcon={<HiPlus />}> Objetivo</Button>
          <Button component={Link} to="/teams" variant="contained" startIcon={<HiEye />}>Ver Times</Button>
        </div>
      </header>
      <section className={`okr__list${!displayObjectives.length ? '--empty' : ''}`}>
        {
          !displayObjectives.length ?
            <span>Não existem objetivos a serem exibidos!</span>
            : displayObjectives.map((objective, index) => (
              <Accordion key={index} expanded={expanded === `${objective.name}-${objective.id}`} onChange={handleAccordionChange(`${objective.name}-${objective.id}`)}>
                <AccordionSummary
                  expandIcon={<HiChevronDown />}
                  id={`${objective.name}-${objective.id}`}
                >
                  <Typography sx={{ width: '30%', flexShrink: 0 }}>{objective.name}</Typography>
                  <Typography sx={{ width: '60%', color: 'text.secondary' }}>{objective.description}</Typography>
                  <Typography sx={{ width: '15%'}}>
                  <div className="buttons">
                    <Button variant="contained" color="primary" onClick={event => handleDialogObjectiveEditOpen(objective)}> <HiOutlineCog6Tooth /> </Button>
                    <Button variant="contained" color="error" onClick={event => handleDeleteObjectiveDialog(objective)}> <HiTrash /> </Button>
                  </div>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={`accordion-details${!objective.key_results.length ? '--empty' : ''}`}>
                  <ul>
                    {
                      !objective.key_results.length ?
                        <li className="not-found-message">
                          <span>Nenhum KR cadastrado para o objetivo selecionado!</span>
                          
                        </li>
                        : 
                          <TableContainer>
                            <Table>
                              <TableBody>
                                {
                                  objective.key_results.map((keyResult, index) => (
                                    <TableRow key={keyResult.name}>
                                      <TableCell sx={{maxWidth: 5}} size="small" align="center">{<Avatar className="avatar">{`${keyResult.responsable.charAt(0).toUpperCase()}`}</Avatar>}</TableCell>
                                      <TableCell size="medium" align="left">
                                        <li>{keyResult.name}</li>
                                        <li className="secondary-text">Peso: {keyResult.weight} - Data-limite: {formatDateKr(keyResult.prevision_date)}</li>
                                      </TableCell>
                                      <TableCell className="pencil-button" size="medium">
                                      <div >
                                        <Button variant="contained" color="primary" onClick={event => handleDialogKrEditOpen(keyResult)}> <HiOutlineCog6Tooth /> </Button>
                                        <Button variant="contained" color="error" onClick={event => handleDeleteKrDialog(keyResult)}> <HiTrash /> </Button>
                                      </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                }

                              </TableBody>
                            </Table>
                          </TableContainer>
                    }
                    <li className="create-okr">
                      <Button size="small" variant="contained" onClick={event => handleDialogKrOpen(objective.id)}>Cadastrar Key Result</Button>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            ))
        }
      </section>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{statusDialog} Objetivo</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Nome"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="dense"
              name="prevision_date"
              label="Data Limite"
              type="date"
              fullWidth
              value={formData.prevision_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              disabled={loading}
            />
            <TextField
              autoFocus
              margin="dense"
              name="description"
              label="Descrição"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={loading}
            />
            <FormControlLabel control={
              <Checkbox 
                checked={formData.status}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                onChange={handleChangeCheckbox}
              />
            } label="Finalizado" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleDialogClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading} onClick={handleSubmit}>
            {!!loading ? 'Enviando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialogKr} onClose={handleDialogCloseKr}>
        <DialogTitle>{statusDialogKr} Resultados-Chave</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitKr}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Nome"
              type="text"
              fullWidth
              value={formDataKr.name}
              onChange={handleChangeKr}
              disabled={loading}
            />
            <TextField
              margin="dense"
              name="prevision_date_formated"
              label="Data Limite"
              type="date"
              fullWidth
              value={formDataKr.prevision_date_formated}
              onChange={handleChangeKr}
              InputLabelProps={{
                shrink: true
              }}
              disabled={loading}
            />
            <TextField
              autoFocus
              margin="dense"
              name="weight"
              label="Peso"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
              value={formDataKr.weight}
              onChange={handleChangeKr}
              disabled={loading}
            />
            <Autocomplete
              onChange={(event, newValue) => setFormDataKr({...formDataKr, responsable: newValue.id})}
              options={employees}
              getOptionLabel={(option) => option.first_name }
              renderInput={(params) => (
              <TextField {...params} label="Responsável" />
                )}
            />
            <TextField
              autoFocus
              margin="dense"
              name="description"
              label="Descrição"
              type="text"
              fullWidth
              value={formDataKr.description}
              onChange={handleChangeKr}
              multiline
              rows={4}
              disabled={loading}
            />
            <FormControlLabel control={
              <Checkbox 
                checked={formDataKr.percentage === 100}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                onChange={handleChangeCheckboxKr}
              />
            } label="Finalizado" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleDialogKrClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading} onClick={handleSubmitKr}>
            {!!loading ? 'Enviando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja excluir este objetivo?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDeleteObjective}>Deletar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogKr} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja excluir este resultado-chave?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteKrDialogClose}>Cancelar</Button>
          <Button onClick={handleDeleteKr}>Deletar</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default Okr;
