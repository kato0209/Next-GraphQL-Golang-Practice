import type { NextPage } from "next";
import * as React from 'react';
import { useQuery, useMutation  } from "@apollo/client";
import { CreateTodoMutation, GetTodoDocument, GetTodoQuery, CreateTodoDocument, UpdateTodoTextDocument, UpdateTodoTextMutation, DeleteTodoDocument, DeleteTodoMutation } from "../graphql/generated/graphql";
import { Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Home: NextPage = () => {
  const { data, refetch  } = useQuery<GetTodoQuery>(GetTodoDocument);
  const [input, setInput] = React.useState<string>('');
  const [updateTodoAnchorEl, setUpdateTodoAnchorEl] = React.useState<null | HTMLElement>(null);
  const [updateInput, setUpdateInput] = React.useState<string>('');
  const [selectedUpdateTodoID, setSelectedUpdateTodoID] = React.useState<string>("");
  
  const [createTodo, { loading: createLoading, error: createError }] = useMutation<CreateTodoMutation>(CreateTodoDocument);
  const [updateTodo, { loading: updateLoading, error: updateError }] = useMutation<UpdateTodoTextMutation>(UpdateTodoTextDocument);
  const [deleteTodo, { loading: deleteLoading, error: deleteError }] = useMutation<DeleteTodoMutation>(DeleteTodoDocument);

  const handleCreateTodo = async () => {
    await createTodo({
      variables: {
        text: input,
        userId: "1",
      },
    });
    await refetch();
  }

  const handleUpdateDialogOpen  = (event: React.MouseEvent<HTMLElement>, todoID: string) => {
    setUpdateTodoAnchorEl(event.currentTarget);
    setSelectedUpdateTodoID(todoID);
  };

  const handleUpdateDialogClose = () => {
    setUpdateTodoAnchorEl(null);
    setSelectedUpdateTodoID("");
  };


  const handleUpdateTodo = async () => {
    await updateTodo({
      variables: {
        text: updateInput,
        id: selectedUpdateTodoID,
      },
    });
  }

  const handleDeleteTodo = async (todoID: string) => {
    await deleteTodo({
      variables: {
        todoId: todoID,
      },
    });
    await refetch();
  }

  if (createLoading) return 'Creating todo...';
  if (createError) return `Creation error! ${createError.message}`;
  if (updateLoading) return 'Updating todo...';
  if (updateError) return `Updating error! ${updateError.message}`;
  if (deleteLoading) return 'Deleting todo...';
  if (deleteError) return `Deleting error! ${deleteError.message}`;

  return (
    <Box component="main" sx={{display: "flex",flexDirection: "column", textAlign: "center"}}>
      <>
        <Box
          component="form"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '95%',
            marginTop: '50px',
          }}
          onSubmit={e => {
            e.preventDefault();
            handleCreateTodo();
            setInput('');
          }}
        >
          <TextField
            id="todo-input"
            label="タスクを入力"
            sx = {{width: '50%'}}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
              variant="contained"
              sx={{
              backgroundColor: '#FF7E73',
              color: '#fff',
              '&:hover': {
              backgroundColor: '#E56A67',
              },
              '&.Mui-disabled': {
                  backgroundColor: '#FFA49D',
                  color: '#fff',
              }
              }}
              type="submit"
          >
              作成
          </Button>
        </Box>
    </>
      <>
        {data?.todos?.map((todo) => (
          <Box 
            key={todo.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h3>{todo.text},{todo.id}</h3>
            <IconButton onClick={(e) => handleUpdateDialogOpen(e, todo.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
            <Menu 
              anchorEl={updateTodoAnchorEl}
              open={Boolean(updateTodoAnchorEl)} 
              onClose={handleUpdateDialogClose}
              sx={{
                
                '& .MuiPaper-root': {
                    boxShadow: 'none', 
                    border: '1px solid #ccc',
                },
                '& .MuiList-root ': {
                  display: 'flex',
                  padding: '1rem',
              }
            }}
            >
                <TextField
                  id="todo-update-input"
                  label="タスクを更新"
                  sx = {{width: '100%', alignItems: 'center'}}
                  value={updateInput}
                  onChange={(e) => setUpdateInput(e.target.value)}
                />
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateTodo();
                    setUpdateInput('');
                    handleUpdateDialogClose();
                  }}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#FF7E73',
                    '&:hover': {
                    backgroundColor: '#E56A67',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#FFA49D',
                        color: '#fff',
                    }
                  }}
                >
                  更新
                </Button>
            </Menu>
          </Box>
        ))}
      </>
    </Box>
  );
};

export default Home;