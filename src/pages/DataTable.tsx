// App.tsx
import React, { useState, useEffect } from 'react';
import {  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, CardContent, Card, CardHeader, CardActions, Box, AppBar, IconButton, Chip, InputAdornment, OutlinedInput, Tooltip } from '@mui/material';
import { Edit, Delete, Add, Save, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';
import { CustomButton } from '../components/custom/CustomButton';
import { CustomCenterDiv } from '../components/custom/CustomCenterDiv';
import { User, Department } from '../types';


type Entity = User | Department;
type EntityType = 'user' | 'department';

interface DataTableProps {
  entity: string;
}

export const DataTable: React.FC<DataTableProps> = ({ entity }) => {
  const [entities, setEntities] = useState<(User | Department)[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityType, setEntityType] = useState<EntityType>('user');
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showTablePasswords, setShowTablePasswords] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    const type = tabValue === 0 ? 'users' : 'departments';
    const response = await fetch(`http://localhost:3001/${type}`);
    const data = await response.json();
    setEntities(data);

    // Always fetch departments for reference
    const deptResponse = await fetch('http://localhost:3001/departments');
    const deptData = await deptResponse.json();
    setDepartments(deptData);

    // Always fetch users for reference
    const usersResponse = await fetch('http://localhost:3001/users');
    const usersData = await usersResponse.json();
    setUsers(usersData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:3001/${entityType}s${currentEntity?.id ? `/${currentEntity.id}` : ''}`;
    const method = currentEntity?.id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentEntity),
    });

    setOpenDialog(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    const type = tabValue === 0 ? 'users' : 'departments';
    await fetch(`http://localhost:3001/${type}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAddNew = () => {
    if (tabValue === 0) {
      setCurrentEntity({
        name: '',
        email: '',
        department_id: departments[0]?.id,
        password: ''
      } as User);
    } else {
      setCurrentEntity({
        name: '',
        manager_id: 0
      } as Department);
    }
    setOpenDialog(true);
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  return (
    <CustomCenterDiv>

     <Card>
      <CardHeader className='bg-gray' title={tabValue === 0 ? 'Users' : 'Departments'} />
      <CardContent>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <AppBar position="static">

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} 
           indicatorColor="secondary"
          textColor="inherit"
        >
        <Tab label="Users"sx={{textTransform: 'none', color: 'white'}} />
        <Tab label="Departments"sx={{textTransform: 'none', color: 'white'}} />
      </Tabs>
          </AppBar>
      </Box>

      </CardContent>
     </Card>
     <Card>
      <CardContent>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow className='bg-lightGray'>
              {tabValue === 0 ? (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Password</TableCell>

                </>
              ) : (
                <>
                <TableCell>Department Name</TableCell>
                <TableCell>Manager</TableCell>
                </>
              )}
              <TableCell sx={{textAlign: 'center'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.id}>
                {tabValue === 0 ? (
                  <>
                    <TableCell>{(entity as User).name}</TableCell>
                    <TableCell>{(entity as User).email}</TableCell>

                    <TableCell>
                      {departments.find(d => d.id === (entity as User).department_id)?.name}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {showTablePasswords[entity.id!] ? (entity as User).password : '••••••••'}
                        <IconButton
                          size="small"
                          onClick={() => setShowTablePasswords(prev => ({
                            ...prev,
                            [entity.id!]: !prev[entity.id!]
                          }))}
                        >
                          {showTablePasswords[entity.id!] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Box>
                    </TableCell>

                  </>
                ) : (
                  <>
                  <TableCell>{(entity as Department).name}</TableCell>
                <TableCell>{users.find(d => d.id === (entity as Department).manager_id)?.name || 'N/A'}</TableCell>

                  </>

                )}
                <TableCell sx={{textAlign: 'center'}}>
                  <Tooltip title="Edit" >
                  <IconButton
                    color="info"
                    size="small"
                    onClick={() => {
                      setCurrentEntity(entity);
                      setEntityType(tabValue === 0 ? 'user' : 'department');
                      setOpenDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" >
                  <IconButton
                    onClick={() => handleDelete(entity.id!)}
                    color="error"
                    size="small"
                  >
                        <Delete />
                  </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </CardContent>
      <CardActions className='bg-gray'>
      <CustomButton 
        variant="contained" 
        startIcon={<Add />} 
        onClick={handleAddNew}
      >
        Add {tabValue === 0 ? 'User' : 'Department'}
      </CustomButton>
      </CardActions>
     </Card>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{ width: '100%'}}>
          <form onSubmit={handleSubmit} noValidate>
        <DialogTitle className='bg-gray'>
          {currentEntity?.id ? 'Edit'  : 'Add'} {<Chip style={{textTransform: 'uppercase'}} color="primary" size="small" label={entityType}></Chip>}
        </DialogTitle>
        <DialogContent>
            {entityType === 'user' ? (
              <>
              <FormControl sx={{ m: 1,  }} variant="outlined" fullWidth margin="dense">
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  fullWidth
                  value={(currentEntity as User)?.name || ''}
                  onChange={(e) => setCurrentEntity({
                    ...currentEntity,
                    name: e.target.value,
                    department_id: (currentEntity as User)?.department_id || departments[0]?.id
                  } as User)}
                />
                </FormControl>

                <FormControl sx={{ m: 1,  }} variant="outlined" fullWidth margin="dense">
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={(currentEntity as User)?.email || ''}
                  onChange={(e) => setCurrentEntity({
                    ...currentEntity,
                    email: e.target.value
                  } as User)}
                />
</FormControl>

        <FormControl sx={{ m: 1,  }} variant="outlined" fullWidth margin="dense">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
          fullWidth
          value={(currentEntity as User)?.password || ''}
          onChange={(e) => setCurrentEntity({
            ...currentEntity,
            password: e.target.value
          } as User)}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            margin="dense"
          />
        </FormControl>

  

    <FormControl sx={{ m: 1,  }} variant="outlined" fullWidth margin="dense">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={(currentEntity as User)?.department_id || ''}
                    onChange={(e) => setCurrentEntity({
                      ...currentEntity,
                      department_id: Number(e.target.value)
                    } as User)}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
              <TextField
                autoFocus
                margin="dense"
                label="Department Name"
                fullWidth
                value={(currentEntity as Department)?.name || ''}
                onChange={(e) => setCurrentEntity({
                  ...currentEntity,
                  name: e.target.value
                } as Department)}
                />

          <FormControl fullWidth margin="dense">
                  <InputLabel shrink >Manager</InputLabel>
                  <Select
                    value={(currentEntity as Department)?.manager_id || ''}
                    onChange={(e) => setCurrentEntity({
                      ...currentEntity,
                      manager_id: Number(e.target.value)
                    } as Department)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </>
            )}

            </DialogContent>
        <DialogActions className='bg-gray'>
              <CustomButton size='small' onClick={() => setOpenDialog(false)} variant='contained'  color='error' startIcon={<Cancel />}>Cancel</CustomButton>
              <CustomButton size='small' type="submit" variant="contained" startIcon={currentEntity?.id ? <Save /> : <Add />}>
                {currentEntity?.id ? 'Update' : 'Save'}
              </CustomButton>
            </DialogActions>
          </form>
      </Dialog>
    </CustomCenterDiv>
  );
};
