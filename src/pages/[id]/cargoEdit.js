import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateDoc, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "@/styles/Home.module.css";
import s from "@/styles/cadastro.module.css";
import { Header } from '../../components/header';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';

export default function cargoEdit({ dados }) {
  const router = useRouter();
  const { id } = router.query; // Obtém o ID do funcionário da rota

  const cargoSchema = yup.object().shape({
    cargo: yup.string().required('Cargo é obrigatório'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(cargoSchema)
  });

  const onSubmit = async (formData) => {
    try {
      formData.status = "Promovido"
      await updateDoc(doc(db, 'Funcionarios', id), {
        cargo: formData.cargo,
        status: 'Promovido'
      });
      console.log('Cargo atualizado com sucesso!');
      dados.cargo = formData.cargo
      console.log(dados.cargo)
      

      const historicoData = {
        idFuncionario: id,
        dataAlteracao: new Date().toString(),
        tipoAlteracao: 'Funcionário Promovido',
        detalhes: dados // Salva os novos detalhes do funcionário como parte do histórico
      };
      await addDoc(collection(db, 'HistoricoFuncionarios'), historicoData);
      console.log("atualizou historico")

      router.push(`/${id}/func`); // Redireciona de volta para a página de detalhes do funcionário
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error);
    }
  };

  //verificar logado
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (!user) {
      router.replace('/');
    }
  })

  return unsubscribe
}, [])


  return (
    <>
    <Header/>
    <div style={{ marginLeft: '10vh', marginTop: '20vh' }}>
      <Typography variant="h4" gutterBottom>Editar Cargo - Promover Funcionário<CreateTwoToneIcon/></Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="cargo" style={{ marginLeft: '2vh' }}>Cargo:</label>
          <div className={styles.input_container}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="text"
                placeholder="Cargo"
                defaultValue={dados.cargo}
                {...register("cargo", { required: true })}
              />
              <label>Cargo</label>
              </div>
              <label className={s.lab_inputs}>Ex: Analista de Sistemas</label>
              <span className={styles.erro}>{errors.cargo?.message}</span>
            </div>
        </div>
        <Button type="submit">Promover</Button>
      </form>
    </div>
    </>
  );
};

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