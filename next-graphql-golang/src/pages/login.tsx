import * as React from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useMutation  } from "@apollo/client";
import { LoginMutation, LoginDocument } from "../graphql/generated/graphql";
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [login, { loading: loginLoading, error: loginError }] = useMutation<LoginMutation>(LoginDocument);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await login({
            variables: {
                email: email,
                password: password,
            },
        });
        router.push('/');
    }

    if (loginLoading) return 'Login...';
    if (loginError) return `Login error! ${loginError.message}`;
  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: '8rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
            <TextField
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/signup" variant="body2">
                        アカウント作成はこちら
                    </Link>
                </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}