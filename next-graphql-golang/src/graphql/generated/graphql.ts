import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type LoginUser = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: Todo;
  createUser: User;
  deleteTodo: Scalars['Boolean']['output'];
  login: User;
  updateTodo: Todo;
};


export type MutationCreateTodoArgs = {
  input: NewTodo;
};


export type MutationCreateUserArgs = {
  input: NewUser;
};


export type MutationDeleteTodoArgs = {
  todoId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginUser;
};


export type MutationUpdateTodoArgs = {
  text: Scalars['String']['input'];
  todoId: Scalars['ID']['input'];
};

export type NewTodo = {
  text: Scalars['String']['input'];
};

export type NewUser = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  todos: Array<Todo>;
};

export type Todo = {
  __typename?: 'Todo';
  done: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  user: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateTodoMutationVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type CreateTodoMutation = { __typename?: 'Mutation', createTodo: { __typename?: 'Todo', text: string, done: boolean, user: { __typename?: 'User', id: string } } };

export type DeleteTodoMutationVariables = Exact<{
  todoId: Scalars['ID']['input'];
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteTodo: boolean };

export type UpdateTodoTextMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;


export type UpdateTodoTextMutation = { __typename?: 'Mutation', updateTodo: { __typename?: 'Todo', id: string, text: string } };

export type GetTodoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodoQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, text: string }> };


export const CreateTodoDocument = gql`
    mutation CreateTodo($text: String!) {
  createTodo(input: {text: $text}) {
    user {
      id
    }
    text
    done
  }
}
    `;
export const DeleteTodoDocument = gql`
    mutation DeleteTodo($todoId: ID!) {
  deleteTodo(todoId: $todoId)
}
    `;
export const UpdateTodoTextDocument = gql`
    mutation UpdateTodoText($id: ID!, $text: String!) {
  updateTodo(todoId: $id, text: $text) {
    id
    text
  }
}
    `;
export const GetTodoDocument = gql`
    query getTodo {
  todos {
    id
    text
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateTodo(variables: CreateTodoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateTodoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTodoMutation>(CreateTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTodo', 'mutation', variables);
    },
    DeleteTodo(variables: DeleteTodoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteTodoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTodoMutation>(DeleteTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteTodo', 'mutation', variables);
    },
    UpdateTodoText(variables: UpdateTodoTextMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTodoTextMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTodoTextMutation>(UpdateTodoTextDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateTodoText', 'mutation', variables);
    },
    getTodo(variables?: GetTodoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetTodoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTodoQuery>(GetTodoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTodo', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;