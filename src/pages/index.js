import styles from "../styles/login.module.scss";
import { Inter } from "next/font/google";
//import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import { auth, app } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/dist/client/router";
import Link from 'next/link';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Home() {
const router = useRouter();
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [loginError, setLoginError] = useState();


//verificar logado
/*
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      router.replace('/func');
    }
  })

  return unsubscribe
}, [])
*/
//fazer login
const handleLogin = () => {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Logged in with:', user.email);
      alert("Você logou")
      router.replace('/func');
    })
    .catch(error => {
      console.log(error);
      setLoginError("Email ou Senha invalídos")
      // Adicione aqui a lógica para lidar com erros, por exemplo: alert("Erro ao fazer login: " + error.message);
    })
}

  return (
    <>
      <div className={styles.container}>
      <div className={styles.container2}>
      <p className={styles.principal}>Fazer Login</p>
      <div className={styles.inputContainer}>
      <label className={styles.label_input}>
          <EmailIcon className={styles.icons}/>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        </label>
        <label className={styles.label_input}>
          <LockIcon className={styles.icons}/>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        </label>
      </div>
      <span className={styles.erro}>{loginError}</span>

      <div className={styles.buttonContainer}>
      <button
         onClick={handleLogin}
          className={`${styles.button} ${styles.buttonOutline}`}
        >
          Login
        </button>

      </div>
      </div>

      <div className={styles.first_column}>
      <AccountCircleIcon color="action" className={styles.logo}/>
                <h2 className={styles.title_primary}>Cadastre-se!</h2>
                <p className={styles.description_primary}>Não tem uma conta?</p>
                <Link href="/signup">
                <button className={styles.btn}>Sign up</button>
                </Link>
            </div>
    </div>
    </>
  );
}
