import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateDoc, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

  return (
    <div>
      <Typography variant="h4" gutterBottom>Editar Cargo</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="cargo">Cargo:</label>
          <input
            id="cargo"
            type="text"
            defaultValue={dados.cargo}
            {...register('cargo')}
          />
          <p>{errors.cargo?.message}</p>
        </div>
        <Button type="submit">Promover</Button>
      </form>
    </div>
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