// App.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, CardContent, Card, CardHeader, CardActions, Box, AppBar, IconButton, Chip, InputAdornment, OutlinedInput, Tooltip } from '@mui/material';
import { Edit, Delete, Add, Save, Cancel, Visibility } from '@mui/icons-material';
import { CustomButton } from '../../components/custom/CustomButton';
import { CustomCenterDiv } from '../../components/custom/CustomCenterDiv';
import { Author, Post } from '../../types';


type Entity = Author | Post;
type EntityType = 'author' | 'post';

interface DataTableProps {
  entity: string;
}

export const PostList: React.FC<DataTableProps> = ({ entity }) => {
  const [entities, setEntities] = useState<(Author | Post)[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityType, setEntityType] = useState<EntityType>('author');
  const [tabValue, setTabValue] = useState(0);
const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false);
const [selectedPost, setSelectedPost] = useState<Post | null>(null);


  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    const type = tabValue === 0 ? 'authors' : 'posts';
    const response = await fetch(`http://localhost:3001/${type}`);
    const data = await response.json();
    setEntities(data);

    // Always fetch authors for reference
    const authorResponse = await fetch('http://localhost:3001/authors');
    const authorData = await authorResponse.json();
    setAuthors(authorData);

    // Always fetch posts for reference
    const postResponse = await fetch('http://localhost:3001/posts');
    const postData = await postResponse.json();
    setPosts(postData);
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:3001/${entityType}s${currentEntity?.id ? `/${currentEntity.id}` : ''}`;
    const method = currentEntity?.id ? 'PUT' : 'POST';
  
    const payload = entityType === 'post' ? {
      title: (currentEntity as Post)?.title,
      content: (currentEntity as Post)?.content,
      author_id: (currentEntity as Post)?.author_id,
    } : {
      name: (currentEntity as Author)?.name,
    };
  
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (response.ok) {
      setOpenDialog(false);
      fetchData();
    } else {
      console.error('Error:', response.statusText);
    }
  };


  const handleDelete = async (id: number) => {
    const type = tabValue === 0 ? 'authors' : 'posts';
    await fetch(`http://localhost:3001/${type}/${id}`, { method: 'DELETE' });
    fetchData();
  };

const handleAddNew = () => {
  if (tabValue === 0) {
    setCurrentEntity({
      name: '',
    } as Author);
  } else {
    setCurrentEntity({
      title: '',
      content: '',
      author_id: authors[0]?.id,
      created_at: new Date(),
    } as Post);
  }
  setEntityType(tabValue === 0 ? 'author' : 'post');
  setOpenDialog(true);
};



  return (
    <CustomCenterDiv>

      <Card>
        <CardHeader className='bg-gray' title={tabValue === 0 ? 'Authors' : 'Posts'} />
        <CardContent>
          <Box sx={{ bgcolor: 'background.paper' }}>
            <AppBar position="static">

              <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}
                indicatorColor="secondary"
                textColor="inherit"
              >
                <Tab label="Authors" sx={{ textTransform: 'none', color: 'white' }} />
                <Tab label="Posts" sx={{ textTransform: 'none', color: 'white' }} />
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

                    </>
                  ) : (
                    <>
                      <TableCell>Post Title</TableCell>
                      <TableCell>Post Content</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Posted At</TableCell>
                    </>
                  )}
                  <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    {tabValue === 0 ? (
                      <>
                        <TableCell>{(entity as Author).name}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{(entity as Post).title}</TableCell>
                        <TableCell>{(entity as Post).content}</TableCell>
                        <TableCell>{authors.find(d => d.id === (entity as Post).author_id)?.name || 'N/A'}</TableCell>
                        <TableCell>{(entity as Post).created_at}</TableCell>
                      </>

                    )}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Edit" >
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => {
                            setCurrentEntity(entity);
                            setEntityType(tabValue === 0 ? 'author' : 'post');
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
                      <Tooltip title="View Post">
  <IconButton
    color="primary"
    size="small"
    onClick={() => {
      setSelectedPost(entity as Post);
      setViewPostDialogOpen(true);
    }}
  >
    <Visibility />
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
            Add {tabValue === 0 ? 'Author' : 'Post'}
          </CustomButton>
        </CardActions>
      </Card>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle className='bg-gray'>
            {currentEntity?.id ? 'Edit' : 'Add'} {<Chip style={{ textTransform: 'uppercase' }} color="primary" size="small" label={entityType}></Chip>}
          </DialogTitle>
          <DialogContent>
            {entityType === 'author' ? (
              <>
                <FormControl sx={{ m: 1, }} variant="outlined" fullWidth margin="dense">
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={(currentEntity as Author)?.name || ''}
                    onChange={(e) => setCurrentEntity({
                      ...currentEntity,
                      name: e.target.value,
                      id: (currentEntity as Author)?.id || authors[0]?.id
                    } as Author)}
                  />
                </FormControl>

              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label=" Title"
                  fullWidth
                  value={(currentEntity as Post)?.title || ''}
                  onChange={(e) => setCurrentEntity({
                    ...currentEntity,
                    title: e.target.value
                  } as Post)}
                />

                <TextField
                  autoFocus
                  margin="dense"
                  label=" Content"
                  fullWidth
                  value={(currentEntity as Post)?.content || ''}
                  onChange={(e) => setCurrentEntity({
                    ...currentEntity,
                    content: e.target.value
                  } as Post)}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel shrink >Author</InputLabel>
                  <Select
                    value={(currentEntity as Post)?.author_id || ''}
                    onChange={(e) => setCurrentEntity({
                      ...currentEntity,
                      author_id: Number(e.target.value)
                    } as Post)}
                  >
                    {authors.map((author) => (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

          </DialogContent>
          <DialogActions className='bg-gray'>
            <CustomButton size='small' onClick={() => setOpenDialog(false)} variant='contained' color='error' startIcon={<Cancel />}>Cancel</CustomButton>
            <CustomButton size='small' type="submit" variant="contained" startIcon={currentEntity?.id ? <Save /> : <Add />}>
              {currentEntity?.id ? 'Update' : 'Save'}
            </CustomButton>

          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={viewPostDialogOpen} onClose={() => setViewPostDialogOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle className='bg-gray'>Post Details</DialogTitle>
  <DialogContent>
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Title"
        fullWidth
        value={selectedPost?.title || ''}
        margin="dense"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Content"
        fullWidth
        value={selectedPost?.content || ''}
        margin="dense"
        multiline
        rows={4}
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Author"
        fullWidth
        value={authors.find(a => a.id === selectedPost?.author_id)?.name || 'N/A'}
        margin="dense"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Posted At"
        fullWidth
        value={selectedPost?.created_at ? new Date(selectedPost.created_at).toLocaleString() : 'N/A'}
        margin="dense"
        InputProps={{ readOnly: true }}
      />
    </Box>
  </DialogContent>
  <DialogActions className='bg-gray'>
    <CustomButton onClick={() => setViewPostDialogOpen(false)} variant="contained" color="error">
      Close
    </CustomButton>
  </DialogActions>
</Dialog>
    </CustomCenterDiv>
  );
};
