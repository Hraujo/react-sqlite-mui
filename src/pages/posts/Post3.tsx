import React from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardHeader, CardContent , CardActions, IconButton} from '@mui/material';
import { useEffect, useState } from "react";
import { CustomCenterDiv } from "../../components/custom/CustomCenterDiv";
import { CustomButton } from "../../components/custom/CustomButton";
import { Delete, Edit } from "@mui/icons-material";
import {Author, Post}  from '../../types/'


export function Post3() {
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [open, setOpen] = React.useState(false);
  // const [currentAuthor, setCurrentAuthor] = React.useState<Author | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [currentAuthor, setCurrentAuthor] = useState<Author>({id: 0, name: ""});
  
  const api = 'http://localhost:3001';
  const apiPosts = 'http://localhost:3001/posts';
  const apiAuthors = 'http://localhost:3001/authors';


  useEffect(() => {
    fetchAuthors();
    fetchPosts();
  }, []);

  const fetchAuthors = async () => {
    const response = await fetch('http://localhost:3001/authors');
    const data = await response.json();
    setAuthors(data);
  };

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:3001/posts');
    const data = await response.json();
    setPosts(data);
  };

  const handleOpen = () => {
    setCurrentAuthor(author || { id: 0, name: "" });
    setOpen(true);
  };

  
  // const handleOpen = (Author?: Author) => {
  //   setCurrentAuthor(Author || { id: 0, name: "" });
  //   setOpen(true);
  // };
  const handleClose = () => {
    setCurrentAuthor(null);
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`apiAuthors/${id}`, { method: 'DELETE' });
    fetchAuthors();
  };

  const handleSave = async () => {
    if (currentAuthor ) {
      await fetch(`http://localhost:3001/authors/${currentAuthor.id}`, {
        method: 'PUT',
        body: JSON.stringify(currentAuthor),
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      await fetch(`http://localhost:3001/authors`, {
        method: 'POST',
        body: JSON.stringify({ name: '' }),  // Replace with actual input values
        headers: { 'Content-Type': 'application/json' }
      
      });
    }
    fetchAuthors();
    handleClose();
  };

  // const handleCreateAuthor = () => {
  //     db.run(`INSERT INTO authors(name) VALUES (?)`,
  //       [currentAuthor.name],
  //       (err) => {
  //         if (err) throw err;
  //       },
  //     );
  //     fetchAuthors();
  //     setCurrentAuthor({id: 0, name: ""});
  //     setOpen(false);
  //   };


  return (
    <CustomCenterDiv>
      <Card>
        <CardHeader className="bg-gray" title="Authors" />
              <CardContent>
      <TableContainer>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(author => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  {/* <TableCell>{posts.find(Post => Post.id === author.PostId)?.name}</TableCell> */}
                  <TableCell>
                    <IconButton onClick={() => handleOpen(author)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(author.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      </CardContent>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={authors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
      <CardActions className='bg-gray'>
        <CustomButton variant="contained" size='small' onClick={() => handleOpen()}>Add Author</CustomButton>
      </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentAuthor ? 'Edit Author' : 'Add Author'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentAuthor?.name || ''}
            onChange={(e) => setCurrentAuthor({ ...currentAuthor, name: e.target.value } as Author)}
          />
          {/* <TextField
            margin="dense"
            label="Department"
            type="number"
            fullWidth
            variant="outlined"
            value={currentAuthor?.PostId || ''}
            onChange={(e) => setCurrentAuthor({ ...currentAuthor, PostId: parseInt(e.target.value) } as Author)}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

    </CustomCenterDiv>
  );
}