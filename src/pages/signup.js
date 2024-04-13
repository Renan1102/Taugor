import styles from "../styles/signup.module.scss";
import { useState } from "react";
import { initializeApp } from 'firebase/app';
import { app, auth } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/dist/client/router";

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

//schema 
const schema = yup
  .object({
    email: yup.string().required('Email é obrigatório').email('Email invalído'),
    senha: yup.string().required('Senha é obrigatório').min(8, 'Senha deve ter no mínimo 8 caracteres'),
  })
  .required()

export default function Home() {
const router = useRouter();
const [email, setEmail] = useState();
const [password, setPassword] = useState();


//hook form
const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  }) 
  

//fazer cadastro usuario
const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('Conta criada!', user);
        router.replace('/');
      })
      .catch(error => {
        console.log(error);
        
        // Adicione aqui a lógica para lidar com erros, por exemplo: alert("Erro ao criar conta: " + error.message);
      })
  }

  return (
    <>
      <div className={styles.container}>
      <form className={styles.container2} onSubmit={handleSubmit(handleSignUp)}>
      <h1 className={styles.principal}>Crie uma Conta</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <span className={styles.erro}>{errors.email?.message}</span>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          {...register("senha")}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <span className={styles.erro}>{errors.senha?.message}</span>
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonOutline}`}
        >
          <span className={styles.buttonOutlineText}>Registrar</span>
        </button>
        
        <p className={styles.registrado}>
          Já está registrado? <a href="/" className={styles.log}>Login</a>
        </p>
      </div>
      </form>
    </div>
    </>
  );
}
