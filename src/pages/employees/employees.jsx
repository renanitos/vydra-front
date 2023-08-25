import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/navbar.jsx";
import "./employees.styles.scss";

const columns = [
  { id: "name", label: "Funcionário", minWidth: 170 },
  { id: "role", label: "Cargo", minWidth: 100 },
  { id: "team", label: "Time", minWidth: 170 },
];

function Employees() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const BASE_URL = "http://127.0.0.1:5000";
  const endpoint = `${BASE_URL}/page_employees`;
  const [searchValue, setSearchValue] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); 
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    role_id: null,
    team_id: null
  });

  const filterOptions = createFilterOptions({
    stringify: (option) => option.name,
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();

      const flattenedData = data.flatMap((nestedData) => nestedData);
  
      const mappedData = flattenedData.map((employee) => ({
        ...employee,
        id: employee.employee_id,
      }));
  
      setEmployees(mappedData);
      setFilteredEmployees(mappedData);

      const rolesResponse = await fetch(`${BASE_URL}/roles`, {
        headers: {
          token: `${token}`
        }
      });
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);

      const teamsResponse = await fetch(`${BASE_URL}/teams`, {
        headers: {
          token: `${token}`
        }
      });
      const teamsData = await teamsResponse.json();
      setTeams(teamsData);

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
    fetchEmployees();
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
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((employee) =>
        employee.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredEmployees(filtered);
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
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  const handleNewEmployee = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `${token}`
        },
        body: JSON.stringify(newEmployee)
      });
      if (response.ok) {
        setNewEmployee({
          first_name: "",
          last_name: "",
          email: "",
          birth_date: "",
          role_id: null,
          team_id: null
        });
        handleDialogClose();
        fetchEmployees(); // Refresh the employee list after creating a new employee
      } else {
        console.error("Failed to create a new employee.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuOpen = (event, employee) => {
    setSelectedEmployeeId(employee.id);
    setSelectedEmployee(employee)
    setMenuAnchorEl(event?.currentTarget);
  };
  
  const handleMenuClose = () => {
    setSelectedEmployeeId(null);
    setMenuAnchorEl(null); 
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployeeId) {
      console.error("Nenhum funcionário selecionado para edição.");
      return;
    }
    
    try {
      let body = {
        'first_name': selectedEmployee.first_name,
        'last_name': selectedEmployee.last_name,
        'role_id': selectedEmployee.role_id,
        'team_id': selectedEmployee.team_id

      }
      const response = await fetch(`${BASE_URL}/employees/${selectedEmployeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": `${token}`,
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        fetchEmployees();
      } else {
        console.error("Falha ao excluir o funcionário.");
      }
    } catch (error) {
      console.error(error);
    }
  
    handleMenuClose();
  }
  
  const handleDeleteEmployee = async () => {
    if (!selectedEmployeeId) {
      console.error("Nenhum funcionário selecionado para edição.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/employees/${selectedEmployeeId}`, {
        method: "DELETE",
        headers: {
          token: `${token}`,
        },
      });
  
      if (response.ok) {
        fetchEmployees();
      } else {
        console.error("Falha ao excluir o funcionário.");
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
      <div className="h2-teams">Gestão de funcionários</div>
      <div className="search-container">
        <Autocomplete
          value={searchValue}
          onChange={handleSearch}
          options={employees.map((employee) => employee.name)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar funcionários" />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          className="new-employee-button"
          onClick={handleDialogOpen}
        >
          Novo funcionário
        </Button>
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
                {filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <TableRow key={employee.name}>
                      <TableCell align="center">{employee.name}</TableCell>
                      <TableCell align="center">{employee.role_name}</TableCell>
                      <TableCell align="center">{employee.team_name}</TableCell>
                      <TableCell align="center">
                      <HiOutlinePencilAlt onClick={(event) => handleMenuOpen(event, employee)} />
                        <Menu
                          anchorEl={menuAnchorEl}
                          open={Boolean(menuAnchorEl && selectedEmployeeId === employee.id)}
                          onClose={handleMenuClose}
                        >
                        <MenuItem onClick={handleEditDialogOpen}>
                          Atualizar Funcionários
                        </MenuItem>
                        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                        <DialogTitle>Editar funcionário</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            name="first_name"
                            label="Nome"
                            type="text"
                            fullWidth
                            value={selectedEmployee.first_name}
                            onChange={handleEditInputChange}
                          />
                          <TextField
                            margin="dense"
                            name="last_name"
                            label="Sobrenome"
                            type="text"
                            fullWidth
                            value={selectedEmployee.last_name}
                            onChange={handleEditInputChange}
                          />
                          <Autocomplete
                            onChange={(event, newValue) => setSelectedEmployee({...selectedEmployee, role_id: newValue.id})}
                            options={roles}
                            getOptionLabel={(option) => option.name }
                            renderInput={(params) => (
                              <TextField {...params} label="Cargo" />
                            )}
                            />
                          <Autocomplete
                            onChange={(event, newValue) => setSelectedEmployee({...selectedEmployee, team_id: newValue.id})}
                            options={teams}
                            getOptionLabel={(option) => option.name }
                            renderInput={(params) => (
                              <TextField {...params} label="Time" />
                            )}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleEditDialogClose}>Cancelar</Button>
                          <Button onClick={handleEditEmployee}>Salvar</Button>
                        </DialogActions>
                        </Dialog>
                          <MenuItem onClick={handleDeleteDialogOpen}>
                            Deletar Funcionários
                          </MenuItem>
                          <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogContent>
                              Tem certeza de que deseja excluir este funcionário?
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
                              <Button onClick={handleDeleteEmployee}>Deletar</Button>
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
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Novo funcionário</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="first_name"
            label="Nome"
            type="text"
            fullWidth
            value={newEmployee.first_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="last_name"
            label="Sobrenome"
            type="text"
            fullWidth
            value={newEmployee.last_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newEmployee.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="birth_date"
            label="Data de nascimento"
            type="date"
            fullWidth
            value={newEmployee.birth_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true
            }}
          />
          <Autocomplete
           onChange={(event, newValue) => setNewEmployee({...newEmployee, role_id: newValue.id})}
           options={roles}
           getOptionLabel={(option) => option.name }
           renderInput={(params) => (
          <TextField {...params} label="Cargo" />
            )}
          />
          <Autocomplete
           onChange={(event, newValue) => setNewEmployee({...newEmployee, team_id: newValue.id})}
           options={teams}
           getOptionLabel={(option) => option.name }
           renderInput={(params) => (
          <TextField {...params} label="Time" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleNewEmployee}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Employees;
