import styles from "../styles/signup.module.scss";
import { useState } from "react";
import { initializeApp } from 'firebase/app';
import { app, auth } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/dist/client/router";
import Link from 'next/link';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

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
      <div className={styles.first_column}>
                <h2 className={styles.title_primary}>Bem vindo de volta!</h2>
                <p className={styles.description_primary}>Já está registrado?</p>
                <Link href="/">
                <button className={styles.btn}>Login</button>
                </Link>
            </div> 
      <form className={styles.container2} onSubmit={handleSubmit(handleSignUp)}>
      <h1 className={styles.principal}>Crie uma Conta</h1>
      <div className={styles.inputContainer}>
        <label className={styles.label_input}>
          <EmailIcon className={styles.icons}/>
        <input
          type="text"
          placeholder="Email"
          value={email}
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        </label>
        <span className={styles.erro}>{errors.email?.message}</span>
        <label className={styles.label_input}>
          <LockIcon className={styles.icons}/>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          {...register("senha")}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        </label>
        <span className={styles.erro}>{errors.senha?.message}</span>
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonOutline}`}
        >
          Registrar
        </button>
        

      </div>
      </form>
    </div>
    </>
  );
}
