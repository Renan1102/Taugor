import { useState, useEffect } from "react";
import { auth, db } from '../../../firebase';
import { addDoc, collection, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import FuncionarioPDF from '../../components/FuncionarioPDF';

export default function Func({ dados }) {
  const [historicoFuncionario, setHistoricoFuncionario] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistorico() {
      try {
        // Inicia o carregamento
        setLoading(true);

        const historicoQuery = query(collection(db, 'HistoricoFuncionarios'), where('idFuncionario', '==', dados._id));
        const historicoSnapshot = await getDocs(historicoQuery);
        const historicoData = historicoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
          
        }));
        setHistoricoFuncionario(historicoData);

        // Se ocorrer um erro, finaliza o carregamento e manipula o erro conforme necessário
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar histórico do funcionário:', error);

         // Se ocorrer um erro, finaliza o carregamento e manipula o erro conforme necessário
         setLoading(false);
      }
    }
    fetchHistorico();
  }, [dados._id]);

  //verificar logado
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (!user) {
      router.replace('/');
    }
  })

  return unsubscribe
}, [])


  const [loading, setLoading] = useState(true);


  return (
    <>
    <div>
      <h1>Detalhes do Funcionário</h1>
      {loading ? ( // Se estiver carregando, exibe um indicador de carregamento
        <p>Carregando...</p>
      ) : ( // Caso contrário, exibe o PDFViewer
        typeof window !== 'undefined' && ( // Renderiza o PDFViewer apenas no lado do cliente
          <PDFViewer width="100%" height="700vh">
            <FuncionarioPDF dados={dados} historicoFuncionario={historicoFuncionario} />
          </PDFViewer>
        )
      )}
    </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const funcRef = doc(db, 'Funcionarios', params.id);
    const funcSnapshot = await getDoc(funcRef);
    if (funcSnapshot.exists()) {
      const dados = {
        _id: funcSnapshot.id,
        ...funcSnapshot.data()
      };
      return {
        props: { success: true, dados }
      };
    } else {
      return {
        props: { success: false, dados: {} }
      };
    }
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    return {
      props: { success: false, dados: {} }
    };
  }
}
