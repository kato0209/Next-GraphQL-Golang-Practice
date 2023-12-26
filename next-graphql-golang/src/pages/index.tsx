import type { NextPage } from "next";
import * as React from 'react';
import { useQuery, useMutation  } from "@apollo/client";
import { CreateTodoMutation, GetTodoDocument, GetTodoQuery, CreateTodoDocument } from "../graphql/generated/graphql";
import { Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Home: NextPage = () => {
  const { data, refetch  } = useQuery<GetTodoQuery>(GetTodoDocument);
  const [input, setInput] = React.useState<string>('');
  const [createTodo, { loading, error }] = useMutation<CreateTodoMutation>(CreateTodoDocument);

  const handleCreateTodo = async () => {
    await createTodo({
      variables: {
        text: input,
        userId: "1",
      },
    });
    await refetch();
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

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
          <div key={todo.id}>
            <h1>{todo.text}</h1>
          </div>
        ))}
      </>
    </Box>
  );
};

export default Home;