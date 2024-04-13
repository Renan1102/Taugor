import styles from "../styles/login.module.scss";
import { Inter } from "next/font/google";
//import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import { auth, app } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/dist/client/router";



export default function Home() {
const router = useRouter();
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [loginError, setLoginError] = useState();


//verificar logado
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      router.replace('/home');
    }
  })

  return unsubscribe
}, [])

//fazer login
const handleLogin = () => {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Logged in with:', user.email);
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
      <p className={styles.buttonOutlineText}>Fazer Login</p>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>
      <span className={styles.erro}>{loginError}</span>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleLogin}
          className={styles.button}
        >
          Login
        </button>
        <p className={styles.registrado}>
          Não tem uma conta? <a href="/signup" className={styles.log}>
            Registre-se
          </a>
        </p>
      </div>
      </div>
    </div>
    </>
  );
}
