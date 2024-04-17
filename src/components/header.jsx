import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { auth, db } from '../../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from "next/dist/client/router";

import LogoutIcon from '@mui/icons-material/Logout';

export const Header = () => {
  const router = useRouter();

  // Deslogar
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Usuário deslogado');
        router.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };


    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <Button onClick={logout} color="inherit">LogOut<LogoutIcon sx={{marginLeft: '2vh'}}/></Button>
        </Toolbar>
      </AppBar>
    </Box>
    </>
    )
}