import { useState } from "react";
import { auth, db } from '../../firebase';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "@/styles/Home.module.css";
import { Header } from '../components/header';
export default function Home({ dados }) {
 
  return (
    <>
    <Header />
    <section className='index'>

      <div>
        <div className="carousel-wrapper">
          
            {
              dados.map(({ _id, nome, sexo, setor }) => (
                <div className="text-center" key={_id}>

                  <div className={styles.teste}>
                  <h2 >{nome}</h2>
                  <h2 >{sexo}</h2>
                  <h2 >{setor}</h2>
                  </div>


                </div>
              ))
            }
          
        </div>
      </div>


    </section>
    </>
  )
}

export async function getServerSideProps() {
  try {
    // Consulta os dados no Firestore
    const func = collection(db, 'Funcionarios');
    const funcSnapshots = await getDocs(func);

    // Mapeia os documentos e retorna os dados
    const dados = funcSnapshots.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));

    return {
      props: { dados } // Passa os dados dos dados como props para a página
    };
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    return {
      props: { dados: [] }, // Retorna um array vazio caso haja erro
    };
  }
}
