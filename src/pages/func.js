import { useState, useEffect } from "react";
import { auth, db } from '../../firebase';
import { doc, getDocs, deleteDoc, update, addDoc, collection, getDoc } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import s from "../styles/func.module.scss";
import Link from "next/link";
import { Header } from '../components/header';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function Func({ dados }) {
  const router = useRouter();

  const onDelete = async (_id) => {
    if(window.confirm("Tem certeza que deseja remover esse funcionario?")){
      try {
        await fetch(`/api/funcionario/${_id}`, {
            method: "DELETE",
        });
        console.log("deletado")
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
  }
}

async function demitirFuncionario(_id) {
  const { id } = router.query;
  if(window.confirm("Tem certeza que deseja demitir esse funcionario?")){
  try {
    // Atualiza o status do funcionário para "demitido" no servidor
    const res = await fetch(`/api/funcionario/${_id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ status: "Demitido" }), // Atualiza apenas o status
    });
    console.log("Demitiu")

    if (!res.ok) {
      throw new Error("Erro ao demitir funcionário");
    }
    
    dados.status = 'Demitido';
    
    const historicoData = {
      idFuncionario: _id,
      dataAlteracao: new Date().toString(),
      tipoAlteracao: 'Funcionário demitido ou contrato encerrado',
      detalhes: dados // Salva os novos detalhes do funcionário como parte do histórico
    };
    await addDoc(collection(db, 'HistoricoFuncionarios'), historicoData);
    console.log("atualizou historico")
    window.location.reload();

    return { success: true };
  } catch (error) {
    console.error('Erro Atualizar funcionário:', error);
    return { success: false, message: 'Erro ao demitir funcionário. Por favor, tente novamente.' };
  }
}
}

//verificar logado
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (!user) {
      router.replace('/');
    }
  })

  return unsubscribe
}, [])

const ordenadas = dados.sort((a, b) =>
a.nome.localeCompare(b.nome));


  return (
    <>
    <Header/>
    <div style={{ marginTop: '5vh' }}>
    <Link className={s.but_cadastro} href={`/cadastro`}>
        <Button className="btn btn-success btn-lg">
                    Cadastrar Funcionário
        </Button>
        </Link>
        <h1 className={s.title_func}>Funcionários</h1>
    <section className={s.container}>

 
                {
                  ordenadas.filter(e => e.nome.toLowerCase() && e.status != "Demitido").map(({ _id, nome, sexo, endereco, telefone, dataNascimento, cargo, dataAdmissao, setor, salario, status, imageUrl }) => (
                <div className={s.cont} key={_id}>
    <Card className={s.card}>
      <CardMedia
        component="img"
        alt="green iguana"
        
        image={imageUrl}
        className={s.img_redimensionada}
      />
      <CardContent className={s.infos}>
        <Typography gutterBottom variant="h5" component="div">
        {nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {cargo}<br/>
        {setor}
        </Typography>
      </CardContent>
      <CardActions>
      <Link className={s.but} href={`/${_id}/func`}>
        <Button className="btn btn-primary btn-sm">
                    Abrir
        </Button>
        </Link>

        <Link href={`/${_id}/funcEdit`}>
        <Button size="small">
          <CreateTwoToneIcon sx={{ color: '#faa302', width: '3vh' }}/>
        </Button>
        </Link>

        <Button size="small" onClick={() => onDelete(_id)}>
            <DeleteOutlineIcon sx={{ color: 'red', width: '3vh' }}/>
        </Button>

        <Link href={`/${_id}/cargoEdit`}>
        <Button size="small">
                    <ArrowUpwardIcon sx={{ color: 'green', width: '3vh' }}/>
        </Button>
        </Link>
        
        {status != 'Demitido' ?
        <Button className="btn btn-danger btn-sm" onClick={() => demitirFuncionario(_id)}>
            Demitir
        </Button>: ''}
        
      </CardActions>
    </Card>
    </div>
              ))
            }



{
                  ordenadas.filter(e => e.nome.toLowerCase() && e.status == "Demitido").map(({ _id, nome, sexo, endereco, telefone, dataNascimento, cargo, dataAdmissao, setor, salario, status, imageUrl }) => (
                <div className={s.cont} key={_id}>
    <Card className={s.card} style={{ backgroundColor: 'rgb(237, 113,104)' }}>
      <CardMedia
        component="img"
        alt="green iguana"
        
        image={imageUrl}
        className={s.img_redimensionada}
      />
      <CardContent className={s.infos}>
        <Typography gutterBottom variant="h5" component="div">
        {nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {cargo}<br/>
        {status}
        </Typography>
      </CardContent>
      <CardActions>
      <Link className={s.but} href={`/${_id}/func`}>
        <Button className="btn btn-primary btn-sm">    
                    Abrir
        </Button>
        </Link>

        <Link href={`/${_id}/funcEdit`} style={{ width: '3vh', marginLeft: '8vh'  }}>
        <Button size="small" sx={{border: '0.3px solid gray'}}>
          <CreateTwoToneIcon sx={{ color: '#faa302'}} style={{ width: '3vh' }}/>
        </Button>
        </Link>

        <Button size="small" sx={{border: '0.3px solid gray'}} style={{ width: '3vh', marginLeft: '8vh'  }} onClick={() => onDelete(_id)}>
        <DeleteOutlineIcon sx={{ color: 'red', width: '3vh' }}/>
        </Button>
        
        
        {status != 'Demitido' ?
        <Button size="small" onClick={() => demitirFuncionario(_id)}>
            Terminar
        </Button>: ''}
        
      </CardActions>
    </Card>
    </div>
              ))
            }
            
    </section>
    </div>
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
