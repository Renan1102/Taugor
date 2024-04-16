import { useState } from "react";
import { auth, db, storage } from '../../../firebase';
import { addDoc, collection, getDoc, doc} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import styles from "@/styles/Home.module.css";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


// Schema de validação para a primeira página
const firstPageSchema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  sexo: yup.string().required('Sexo é obrigatório'),
  endereco: yup.string().required('Endereço é obrigatório'),
  //telefone: yup.string().required('Telefone é obrigatório'),
  dataNascimento: yup.string().required('Data de Nascimento é obrigatória'),
});

// Schema de validação para a segunda página
const secondPageSchema = yup.object().shape({
  cargo: yup.string().required('Cargo é obrigatório'),
  dataAdmissao: yup.string().required('Data de Admissão é obrigatória'),
  setor: yup.string().required('Setor é obrigatório'),
  salario: yup.string().required('Salário é obrigatório'),
});

const steps = ['Informações de contato', 'Informações de Funcionário'];

export default function FuncEdit({ dados }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState();

  

  //selecao da imagem
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log(image)
    }
  };

  const handlePhone = (e) => {
    setPhone(e.target.value)
    console.log(phone)
  };
  

  // Definindo o esquema de validação com base na etapa ativa
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: activeStep === 0 ? yupResolver(firstPageSchema) : yupResolver(secondPageSchema)
  });

  const onSubmit = async (form) => {
    const { id } = router.query;
    try {
      if (activeStep === steps.length - 1) {
        if(form.telefone === phone){
          form.telefone = dados.telefone;
        }else{
        form.telefone = phone;
      }

      // Atualiza a imagem se uma nova imagem for selecionada
      if (image) {
        const imageUrl = await handleImageUpload();
        if (imageUrl) {
          form.imageUrl = imageUrl;
          console.log('nova imagem')
        }
      }
      
        const res = await fetch(`/api/funcionario/${id}`, {
          method: "PUT",
          headers: {
              "Content-type": "application/json",

          },
          body: JSON.stringify(form),
      });

      form.status = "Atualizacao"
      //const form = await res.json();
      console.log(form);
      // Salvar um registro na coleção de histórico
      const historicoData = {
        idFuncionario: id,
        dataAlteracao: new Date().toString(),
        tipoAlteracao: 'Atualizacao',
        detalhes: form // Salva os novos detalhes do funcionário como parte do histórico
      };
      await addDoc(collection(db, 'HistoricoFuncionarios'), historicoData);
      console.log("atualizou historico")

        router.push('/home');
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } catch (error) {
      console.error('Error ao fazer put: ', error);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //upload imagem
  const handleImageUpload = async () => {
    if (image) {
      try {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        await uploadTask;
  
        // Obter a URL de download da imagem
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Imagem enviada com sucesso:", downloadURL);
        return downloadURL;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null;
      }
    } else {
      console.log("Selecione uma imagem antes de fazer o upload.");
      return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {activeStep === 0 && (
          <>
          <h1>Editar Informações</h1>
            <Typography sx={{ mt: 2, mb: 1 }}>Passo 1</Typography>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Nome"
                name="nome"
                defaultValue={dados.nome}
                {...register("nome", { required: true })}
              />
             <span className={styles.erro}>{errors.nome?.message}</span>
            </div>
            <div className={styles.input_container}>
            <input
                type="file"
                name="imagem"
                onChange={handleImageChange}
              />
            </div>
            <div className={styles.input_container}>
            <select defaultValue={dados.sexo} name="sexo" {...register("sexo", { required: true })}>
                <option value="" disabled>Selecione sexo</option>
                <option value="Homem">Homem</option>
                <option value="Mulher">Mulher</option>
        </select>
              <span className={styles.erro}>{errors.sexo?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Endereço"
                defaultValue={dados.endereco}
                {...register("endereco", { required: true })}
              />
              <span className={styles.erro}>{errors.endereco?.message}</span>
            </div>
            <div className={styles.input_container}>
            <IMaskInput mask="(00) 00000-0000" type="text" placeholder="Ex:(54) 00000-0000"
             autoComplete="off" required defaultValue={dados.telefone} onChange={handlePhone}/>
              <span className={styles.erro}>{errors.telefone?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="date"
                placeholder="Data de Nascimento"
                defaultValue={dados.dataNascimento}
                {...register("dataNascimento", { required: true })}
              />
              <span className={styles.erro}>{errors.dataNascimento?.message}</span>
            </div>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>Passo 2</Typography>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Cargo"
                defaultValue={dados.cargo}
                {...register("cargo", { required: true })}
              />
              <span className={styles.erro}>{errors.cargo?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="date"
                placeholder="Data de Admissão"
                defaultValue={dados.dataAdmissao}
                {...register("dataAdmissao", { required: true })}
              />
              <span className={styles.erro}>{errors.dataAdmissao?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Setor"
                defaultValue={dados.setor}
                {...register("setor", { required: true })}
              />
              <span className={styles.erro}>{errors.setor?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Salário"
                defaultValue={dados.salario}
                {...register("salario", { required: true })}
              />
              <span className={styles.erro}>{errors.salario?.message}</span>
            </div>
          </>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button type="submit">
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </Box>
      </form>
      
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  try {
    // Consulta os dados do funcionário específico no Firestore usando o ID fornecido
    const funcRef = doc(db, 'Funcionarios', params.id);
    const funcSnapshot = await getDoc(funcRef);

    // Verifica se o documento existe
    if (funcSnapshot.exists()) {
      const dados = {
        _id: funcSnapshot.id,
        ...funcSnapshot.data()
      };

      return {
        props: { success: true, dados }
      };
    } else {
      // Retorna um objeto vazio se o funcionário não for encontrado
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