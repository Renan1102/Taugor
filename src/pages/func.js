import { useState } from "react";
import { auth, db } from '../../firebase';
import { doc, getDocs, deleteDoc, update, addDoc, collection, getDoc } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import s from "../styles/func.module.scss";
import Link from "next/link";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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


  return (
    <section className={s.container}>

 {
              dados.map(({ _id, nome, sexo, endereco, telefone, dataNascimento, cargo, dataAdmissao, setor, salario, status, imageUrl }) => (
                <div className={s.cont} key={_id}>
    <Card className={s.card}>
      <CardMedia
        component="img"
        alt="green iguana"
        
        image={imageUrl}
        className={s.img_redimensionada}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {cargo}<br/>
        {setor}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">
            <Link href={`/${_id}/func`}>
                    Abrir
            </Link>
        </Button>
        <Button size="small">
          <Link href={`/${_id}/funcEdit`}>
          Editar
          </Link>
        </Button>

        <Button size="small" onClick={() => onDelete(_id)}>
            Deletar
        </Button>
        <Button size="small">
        <Link href={`/${_id}/cargoEdit`}>
                    Promover
            </Link>
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
