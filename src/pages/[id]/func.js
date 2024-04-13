import { useState, useEffect } from "react";
import { auth, db } from '../../../firebase';
import { addDoc, collection, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function Func({ dados }) {
  const [historicoFuncionario, setHistoricoFuncionario] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const historicoQuery = query(collection(db, 'HistoricoFuncionarios'), where('idFuncionario', '==', dados._id));
        const historicoSnapshot = await getDocs(historicoQuery);
        const historicoData = historicoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistoricoFuncionario(historicoData);
      } catch (error) {
        console.error('Erro ao buscar histórico do funcionário:', error);
      }
    }
    fetchHistorico();
  }, [dados._id]);

  return (
    <div>
      <p className="fw-light"><b>Nome:</b> {dados.nome}</p>
      <p className="fw-light"><b>Sexo:</b> {dados.sexo}</p>
      <p className="fw-light"><b>Endereço:</b> {dados.endereco}</p>
      <p className="fw-light"><b>Telefone:</b> {dados.telefone}</p>
      <p className="fw-light"><b>Data de Nascimento:</b> {dados.dataNascimento}</p>
      <p className="fw-light"><b>Cargo:</b> {dados.cargo}</p>
      <p className="fw-light"><b>Setor:</b> {dados.setor}</p>
      <p className="fw-light"><b>Status:</b> {dados.status}</p>

      <h2>Histórico do Funcionário</h2>
      {historicoFuncionario.map(item => (
        <div key={item.id}>
          <p>Id do Histórico: {item.id}</p>
          <p>Descrição: {[item.detalhes.nome,' ', item.detalhes.sexo]}</p>
          <p>Data da Alteração: {item.dataAlteracao}</p>
          <p>Status: {item.tipoAlteracao}</p>
          <hr />
        </div>
      ))}
    </div>
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
