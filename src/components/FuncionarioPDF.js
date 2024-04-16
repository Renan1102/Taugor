import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const FuncionarioPDF = ({ dados, historicoFuncionario }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Informações do Funcionário</Text>
        <Text style={styles.subtitle}>Nome:</Text>
        <Text style={styles.text}>{dados.nome}</Text>
        <Text style={styles.subtitle}>Sexo:</Text>
        <Text style={styles.text}>{dados.sexo}</Text>
        <Text style={styles.subtitle}>Endereço:</Text>
        <Text style={styles.text}>{dados.endereco}</Text>
        <Text style={styles.subtitle}>Telefone:</Text>
        <Text style={styles.text}>{dados.telefone}</Text>
        <Text style={styles.subtitle}>Data de Nascimento:</Text>
        <Text style={styles.text}>{dados.dataNascimento}</Text>
        <Text style={styles.subtitle}>Cargo:</Text>
        <Text style={styles.text}>{dados.cargo}</Text>
        <Text style={styles.subtitle}>Setor:</Text>
        <Text style={styles.text}>{dados.setor}</Text>
        <Text style={styles.subtitle}>Data Admissão:</Text>
        <Text style={styles.text}>{dados.dataAdmissao}</Text>
        <Text style={styles.subtitle}>Status:</Text>
        <Text style={styles.text}>{dados.status}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Histórico do Funcionário</Text>
        {historicoFuncionario.map((item, index) => (
          <View key={index} style={{ marginBottom: 10, borderBottom: '2px solid black' }}>
            <Text style={styles.subtitle}>ID do Histórico:</Text>
            <Text style={styles.text}>{item.id}</Text>
            <Text style={styles.subtitle}>Descrição:</Text>
            <Text style={styles.text}>{`Nome:${item.detalhes.nome}, Sexo:${item.detalhes.sexo}, Endereco:${item.detalhes.endereco}, Telefone:${item.detalhes.telefone}
            , Data de nascimento:${item.detalhes.dataNascimento}, Data de Admissão:${item.detalhes.dataAdmissao}, cargo:${item.detalhes.cargo}, Status:${item.detalhes.status}`}</Text>
            <Text style={styles.subtitle}>Data da Alteração:</Text>
            <Text style={styles.text}>{item.dataAlteracao}</Text>
            <Text style={styles.subtitle}>Status:</Text>
            <Text style={styles.text}>{item.tipoAlteracao}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default FuncionarioPDF;
