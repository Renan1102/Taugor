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
import s from "@/styles/Home.module.css";

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
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Link className={s.but} href={`/func`}>
            <Button color="inherit">Home</Button>
            </Link>

            <Link className={s.but} href={`/func`}>
            <Button color="inherit">Cadastrar Funcionários</Button>
            </Link>
          </div>
          <div>
            <Button onClick={logout} color="inherit">LogOut<LogoutIcon sx={{marginLeft: '2vh'}}/></Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
    </>
    )
}