// App.tsx
import React, { useState, useEffect } from 'react';
import { Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

type Entity = User | Department;
type EntityType = 'user' | 'department';

const App = () => {
  const [entities, setEntities] = useState<(User | Department)[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityType, setEntityType] = useState<EntityType>('user');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    const type = tabValue === 0 ? 'users' : 'departments';
    const response = await fetch(`http://localhost:3001/${type}`);
    const data = await response.json();
    
    if (tabValue === 0) {
      setEntities(data);
      const deptResponse = await fetch('http://localhost:3001/departments');
      setDepartments(await deptResponse.json());
    } else {
      setEntities(data);
    }
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

  return (
    <Container>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Users" />
        <Tab label="Departments" />
      </Tabs>

      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => {
          setCurrentEntity(null);
          setEntityType(tabValue === 0 ? 'user' : 'department');
          setOpenDialog(true);
        }}
      >
        Add {tabValue === 0 ? 'User' : 'Department'}
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {tabValue === 0 ? (
                <>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                </>
              ) : (
                <TableCell>Department Name</TableCell>
              )}
              <TableCell>Actions</TableCell>
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
                  </>
                ) : (
                  <TableCell>{(entity as Department).name}</TableCell>
                )}
                <TableCell>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => {
                      setCurrentEntity(entity);
                      setEntityType(tabValue === 0 ? 'user' : 'department');
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    onClick={() => handleDelete(entity.id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentEntity?.id ? 'Edit' : 'Add'} {entityType}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {entityType === 'user' ? (
              <>
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
                <FormControl fullWidth margin="dense">
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
            )}
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {currentEntity?.id ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default App;