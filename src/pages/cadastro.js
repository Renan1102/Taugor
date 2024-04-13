import { useState } from "react";
import { auth, db, storage } from '../../firebase';
import { addDoc, collection} from "firebase/firestore";
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

export default function Home() {
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
  

  // Definindo o esquema de validação com base na etapa ativa
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: activeStep === 0 ? yupResolver(firstPageSchema) : yupResolver(secondPageSchema)
  });

  const onSubmit = async (data) => {
    try {
      if (activeStep === steps.length - 1) {
        await handleImageUpload();
        //para o telefone não ficar undefined
        data.telefone = phone;
        data.status = 'contratado';
        console.log(data)
        
        const funcionarioRef = await addDoc(collection(db, "Funcionarios"), data);
        console.log('Enviou para o banco');

        // Salvar um registro na coleção de histórico
      const historicoData = {
      idFuncionario: funcionarioRef.id,
      dataAlteracao: new Date().toString(),
      tipoAlteracao: 'contratado', 
      detalhes: data // Salva todos os detalhes do funcionário como parte do histórico
    };
    
    await addDoc(collection(db, 'HistoricoFuncionarios'), historicoData);
    console.log("salvou no historico")
        router.push('/');
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } catch (error) {
      console.error('Error adding employee: ', error);
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
            <Typography sx={{ mt: 2, mb: 1 }}>Passo 1</Typography>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Nome"
                name="nome"
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
            <select defaultValue={''} name="sexo" {...register("sexo", { required: true })}>
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
                {...register("endereco", { required: true })}
              />
              <span className={styles.erro}>{errors.endereco?.message}</span>
            </div>
            <div className={styles.input_container}>
            <IMaskInput mask="(00) 00000-0000" type="text" placeholder="Ex:(54) 00000-0000"
             autoComplete="off" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
              <span className={styles.erro}>{errors.telefone?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="date"
                placeholder="Data de Nascimento"
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
                {...register("cargo", { required: true })}
              />
              <span className={styles.erro}>{errors.cargo?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="date"
                placeholder="Data de Admissão"
                {...register("dataAdmissao", { required: true })}
              />
              <span className={styles.erro}>{errors.dataAdmissao?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Setor"
                {...register("setor", { required: true })}
              />
              <span className={styles.erro}>{errors.setor?.message}</span>
            </div>
            <div className={styles.input_container}>
              <input
                type="text"
                placeholder="Salário"
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
