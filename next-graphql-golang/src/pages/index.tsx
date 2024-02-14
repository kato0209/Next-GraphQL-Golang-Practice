import type { NextPage } from "next";
import * as React from 'react';
import { useQuery, useMutation  } from "@apollo/client";
import { CreateTodoMutation, GetTodoDocument, GetTodoQuery, CreateTodoDocument, UpdateTodoTextDocument, UpdateTodoTextMutation, DeleteTodoDocument, DeleteTodoMutation, IsLoggedInDocument, IsLoggedInQuery, Todo } from "../graphql/generated/graphql";
import { Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetServerSideProps } from "next";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloLink, Operation, NextLink } from '@apollo/client';
import Home from "../component/home";

/*
type Props = {
  todos: Todo[];
}
*/

const Index: NextPage = () => {
  return (
    <>
      <Home />
    </>
    
  )
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {

  
  if (context.req.cookies?.jwt_token === undefined) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const httpLink = createHttpLink({
    uri: "http://backend:8080/query",
    credentials: "include",
  });

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        cookie: context.req.headers.cookie,
      }
    }));

    return forward(operation);
  });

  const link = authLink.concat(httpLink);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
    credentials: "include",
  });

  const { data } = await client.query<GetTodoQuery>({
    query: GetTodoDocument,
  });

  return {
    props: {todos: data?.todos},
  };
  
  return {
    props: {},
  };
};
