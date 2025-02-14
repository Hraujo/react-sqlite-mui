import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';

import { Author, Post } from '../../types';


// interface Post {
//   id: number;
//   title: string;
//   content: string;
// }

export const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState<Post>({ id: 0, title: '', content: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

const api = `http://localhost:3001`;
const url = `http://localhost:3001/posts`;


  useEffect(() => {
    // Fetch posts (replace with your actual API call)
    const fetchPosts = async () => {
      try {
          const response = await fetch(`${api}/posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        showSnackbar('Error fetching posts', 'error');
      }
    };

    fetchPosts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null); // Clear selected post on close
    setNewPost({ id: 0, title: '', content: '' }); // Reset form
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setNewPost({ ...post }); // Pre-populate form with post data
    handleOpen();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isUpdate = selectedPost !== null;
      const method = isUpdate ? 'PUT' : 'POST';
      // const url = isUpdate ? `/api/posts/${selectedPost?.id}` : '/api/posts';
      const url = isUpdate ? `http://localhost:3001/posts/${selectedPost?.id}` : 'http://localhost:3001/posts';


      const response = await fetch(`http://localhost:3001/posts`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        const errorResponse = await response.json();
        console.error('Error Response:', errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();

      if (isUpdate) {
        setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
        showSnackbar('Post updated successfully', 'success');
      } else {
        setPosts([...posts, updatedPost]);
        showSnackbar('Post created successfully', 'success');
      }

      handleClose();

    } catch (error) {
      console.error("Error submitting post:", error);
      showSnackbar('Error submitting post', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        setPosts(posts.filter((post) => post.id !== id));
        showSnackbar('Post deleted successfully', 'success');

    } catch (error) {
        console.error("Error deleting post:", error);
        showSnackbar('Error deleting post', 'error');
    }
};

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
    <div>
      <Button variant="contained" onClick={handleOpen} style={{ marginBottom: '16px' }}>
        Create Post
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(post)} color="primary" size="small">Edit</Button>
                  <Button onClick={() => handleDelete(post.id)} color="secondary" size="small">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedPost ? 'Update Post' : 'Create Post'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={newPost.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            name="content"
            value={newPost.content}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

       {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
