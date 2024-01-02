import * as React from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useMutation  } from "@apollo/client";
import { CreateUserDocument, CreateUserMutation } from "../graphql/generated/graphql";
import { useRouter } from 'next/router';

export default function SignUp() {
    const [email, setEmail] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmationPassword, setConfirmationPassword] = React.useState<string>('');
    const [createUser, { loading: createLoading, error: createError }] = useMutation<CreateUserMutation>(CreateUserDocument);
    const router = useRouter();

    const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmationPassword) {
            alert('パスワードが一致しません');
            return;
        }
        await createUser({
            variables: {
                email: email,
                name: username,
                password: password,
            },
        });
        router.push('/');
    }

    if (createLoading) return 'Creating todo...';
    if (createError) return `Creation error! ${createError.message}`;
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
                    Sign up
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleCreateUser}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="メールアドレス"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="username"
                                label="ユーザー名"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="パスワード"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="confirmationPassword"
                                label="パスワード(再入力)"
                                type="password"
                                id="confirmationPassword"
                                autoComplete="new-password"
                                value={confirmationPassword}
                                onChange={(e) => setConfirmationPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Signup
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                アカウントをお持ちの方はこちら
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}