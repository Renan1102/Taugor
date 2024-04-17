import { useState, useEffect } from "react";
import { auth, db, storage } from '../../../firebase';
import { addDoc, collection, getDoc, doc} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import styles from "@/styles/Home.module.css";
import s from "@/styles/cadastro.module.css";
import { Header } from '../../components/header';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import PhotoCameraFrontTwoToneIcon from '@mui/icons-material/PhotoCameraFrontTwoTone';
import FileUploadTwoToneIcon from '@mui/icons-material/FileUploadTwoTone';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';


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

        router.push('/func');
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

  //verificar logado
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (!user) {
      router.replace('/');
    }
  })

  return unsubscribe
}, [router])

  return (
    <>
    <Header/>
    <Box className={s.tudo}>
      <div className={s.container}>
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
            <Typography sx={{ mt: 2, mb: 1, color: '#0782F9' }}>Passo 1</Typography>
            <div className={s.grup}>
              <div className={s.parte_one}>
            <div className={styles.input_container}>
              <h4>Informações do Funcionário<CreateTwoToneIcon/></h4>

              <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="text"
                placeholder="Nome"
                name="nome"
                defaultValue={dados.nome}
                {...register("nome", { required: true })}
              />
              <label>Nome Completo</label>
              </div>
              <label className={s.lab_inputs}>Ex: Thiago Pereira</label>
             <span className={styles.erro}>{errors.nome?.message}</span>
            </div>

            <div className={styles.input_container}>
            <div className="form-floating mb-3">
            <select className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput" defaultValue={dados.sexo} name="sexo" {...register("sexo", { required: true })}>
                <option value="" disabled>Selecione sexo</option>
                <option value="Homem">Homem</option>
                <option value="Mulher">Mulher</option>
        </select>
        <label>Sexo</label>
        </div>
        <label className={s.lab_inputs}>Ex: Homem</label>
              <span className={styles.erro}>{errors.sexo?.message}</span>
            </div>
            </div>
            

            <div className={`${styles.input_container} ${s.another_class}`}>
            <label className={s.custom_file_upload} style={{ display: 'flex' }}>
              <input
                type="file"
                name="imagem"
                onChange={handleImageChange}
              />
              <PhotoCameraFrontTwoToneIcon className={s.imgg}/>
              <h4 style={{ width: '30vh', marginTop: '30px' }}>Foto do Perfil<br/><FileUploadTwoToneIcon style={{ width: '8vh', height: '8vh' }}/></h4>
            </label>
            </div>
            
            </div>
            

            <div className={`${styles.input_container} ${s.inp_endereco}`}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="text"
                placeholder="Endereço"
                defaultValue={dados.endereco}
                {...register("endereco", { required: true })}
              />
              <label>Endereço</label>
              </div>
              <label className={s.lab_inputs}>Ex: Avenida Paulista, 1234, São Paulo - SP - 07010 001</label>
              <span className={styles.erro}>{errors.endereco?.message}</span>
            </div>

            <div className={styles.input_container}>
            <div className="form-floating mb-3">
            <IMaskInput mask="(00) 00000-0000" className="form-control my-2" style={{ backgroundColor: '#f7f4f4' }} type="text" placeholder="Ex:(54) 00000-0000"
             autoComplete="off" required defaultValue={dados.telefone} onChange={handlePhone}/>
              <label>Telefone</label>
             </div>
             <label className={s.lab_inputs}>Ex: (11) 99123-7676</label>
              <span className={styles.erro}>{errors.telefone?.message}</span>
            </div>


            <div className={`${styles.input_container} ${s.inp_data}`}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="date"
                placeholder="Data de Nascimento"
                defaultValue={dados.dataNascimento}
                {...register("dataNascimento", { required: true })}
              />
              <label>Data de Nascimento</label>
              </div>
              <label className={s.lab_inputs}>Ex: 01/05/2001</label>
              <span className={styles.erro}>{errors.dataNascimento?.message}</span>
            
            </div>
            
          </>
        )}
        {activeStep === 1 && (
          <>
            <Typography sx={{ mt: 2, mb: 1, color: '#0782F9' }}>Passo 2</Typography>
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

            <div className={styles.input_container}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="date"
                placeholder="Data de Admissão"
                defaultValue={dados.dataAdmissao}
                {...register("dataAdmissao", { required: true })}
              />
              <label>Data de Admissão</label>
              </div>
              <label className={s.lab_inputs}>Ex: 10/05/2023</label>
              <span className={styles.erro}>{errors.dataAdmissao?.message}</span>
            </div>

            <div className={styles.input_container}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="text"
                placeholder="Setor"
                defaultValue={dados.setor}
                {...register("setor", { required: true })}
              />
              <label>Setor</label>
              </div>
              <label className={s.lab_inputs}>Ex: TI</label>
              <span className={styles.erro}>{errors.setor?.message}</span>
            </div>

            <div className={styles.input_container}>
            <div className="form-floating mb-3">
              <input
              className="form-control" style={{ backgroundColor: '#f7f4f4' }} id="floatingInput"
                type="number"
                placeholder="Salário"
                defaultValue={dados.salario}
                {...register("salario", { required: true })}
              />
              <label>Salário</label>
              </div>
              <label className={s.lab_inputs}>Ex: 2000.00</label>
              <span className={styles.erro}>{errors.salario?.message}</span>
            </div>
          </>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button  className="btn btn-outline-primary" style={{ marginLeft: '5vh' }}
            
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button className="btn btn-primary btn-lg" type="submit" style={{ marginRight: '5vh' }}>
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </Box>
      </form>
      </div>
    </Box>
    </>
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