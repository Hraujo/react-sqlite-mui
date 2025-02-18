// App.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Tabs, Tab, CardContent, Card, CardHeader, CardActions, Box, AppBar, IconButton, Chip, Tooltip, TablePagination, List, ListItem, ListItemText
} from '@mui/material';
import { Edit, Delete, Add, Save, Cancel, Visibility } from '@mui/icons-material';
import { CustomButton } from '../../components/custom/CustomButton';
import { CustomCenterDiv } from '../../components/custom/CustomCenterDiv';
import { Author, Post } from '../../types';


type Entity = Author | Post;
type EntityType = 'author' | 'post';

interface UserListProps {
  entity: string;
}

export const PostList: React.FC<UserListProps> = ({ entity }) => {
  const [entities, setEntities] = useState<(Author | Post)[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [entityType, setEntityType] = useState<EntityType>('author');
  const [tabValue, setTabValue] = useState(0);
  const [viewPostDialogOpen, setViewPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [authorPostsDialogOpen, setAuthorPostsDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);

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
        id: undefined  // Explicitly set id as undefined for new records
      } as Author);
    } else {
      setCurrentEntity({
        title: '',
        content: '',
        author_id: authors[0]?.id,
        created_at: new Date(),
        id: undefined  // Explicitly set id as undefined for new records
      } as Post);
    }
    setEntityType(tabValue === 0 ? 'author' : 'post');
    setOpenDialog(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAuthorPostsDialog = (author: Author) => {
    setSelectedAuthor(author);
    setAuthorPosts(posts.filter(post => post.author_id === author.id));
    setAuthorPostsDialogOpen(true);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - entities.length) : 0;

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
                <TableRow className='bg-lightGray' sx={{ color: 'red' }}>
                  {tabValue === 0 ? (
                    <>
                      <TableCell>Name</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>Post Title</TableCell>
                      <TableCell sx={{
                        maxWidth: '200px', // Adjust the value as needed
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>Post Content</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Posted At</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? entities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : entities
                ).map((entity) => (
                  <TableRow key={entity.id} sx={{ color: 'red' }}>
                    {tabValue === 0 ? (
                      <>
                        <TableCell>{(entity as Author).name}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Tooltip title={`View Posts by ${(entity as Author).name}`}>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenAuthorPostsDialog(entity as Author)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
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
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{(entity as Post).title}</TableCell>
                        <TableCell sx={{
                          maxWidth: '200px', // Adjust the value as needed
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{(entity as Post).content}</TableCell>
                        <TableCell>{authors.find(d => d.id === (entity as Post).author_id)?.name || 'N/A'}</TableCell>
                        <TableCell>{(entity as Post).created_at}</TableCell>
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
                      </>
                    )}
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={3}
            count={entities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                'aria-label': 'rows per page',
              },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
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

      {/* Author Posts Dialog */}
      <Dialog open={authorPostsDialogOpen} onClose={() => setAuthorPostsDialogOpen(false)} maxWidth="md"  fullWidth mt={4} sx={{ maxHeight:'85%', marginTop: '110px' }}>
        <DialogTitle className='bg-gray'>Posts by {selectedAuthor?.name}</DialogTitle>
        <DialogContent>
          <List>
            {authorPosts.map((post) => (
              <ListItem key={post.id}>
                <ListItemText
                  primary={post.title}
                  secondary={post.content}
                  sx={{
                    marginBottom: '2px',
                    '& .MuiListItemText-primary': {
                      backgroundColor: '#31CCCA', // Change to your desired color
                      padding: '5px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      textWeight: 'bold',
                    },
                    '& .MuiListItemText-secondary': {
                      backgroundColor: '#ffffff', // Change to your desired color
                      padding: '5px',
                      borderRadius: '4px',
                      textAlign: "justify",
                      border: '1px solid #31CCCA',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions className='bg-gray'>
          <CustomButton onClick={() => setAuthorPostsDialogOpen(false)} variant="contained" color="error">
            Close
          </CustomButton>
        </DialogActions>
      </Dialog>

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
                      ...(currentEntity?.id ? { id: currentEntity.id } : {}) // Only set id if it exists
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
              multiline
              maxRows={24}
              label="Content"
              fullWidth
              value={selectedPost?.content || ''}
              margin="dense"

            // InputProps={{ readOnly: true }}
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

// custom table pagination
import { useTheme } from '@mui/material/styles';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}
