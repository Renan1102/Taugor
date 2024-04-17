import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#f0f0f0', // Cor de fundo da página
  },
  section: {
    marginVertical: 10,
    padding: 10,
    flexGrow: 1,
    backgroundColor: '#ffffff', // Cor de fundo das seções
    borderRadius: 8,
    border: '1px solid #d3d3d3', // Borda
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#333333', // Cor do título
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#0782F9', // Cor do subtítulo
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666666', // Cor do texto
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#333333', // Cor do título do histórico
  },
});

const FuncionarioPDF = ({ dados, historicoFuncionario }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Informações de Contato</Text>
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
        <Text style={styles.title}>Informações do Funcionário</Text>
        <Text style={styles.subtitle}>Cargo:</Text>
        <Text style={styles.text}>{dados.cargo}</Text>
        <Text style={styles.subtitle}>Setor:</Text>
        <Text style={styles.text}>{dados.setor}</Text>
        <Text style={styles.subtitle}>Data Admissão:</Text>
        <Text style={styles.text}>{dados.dataAdmissao}</Text>
        <Text style={styles.subtitle}>Status:</Text>
        <Text style={styles.text}>{dados.status}</Text>
      </View>
      <View style={[styles.section, styles.historySection]}>
        <Text style={styles.historyTitle}>Histórico do Funcionário</Text>
        {historicoFuncionario.map((item, index) => (
          <View key={index}>
            <View style={styles.section}>
              <Text style={styles.subtitle}>ID do Histórico:</Text>
              <Text style={styles.text}>{item.id}</Text>
              <Text style={styles.subtitle}>Detalhes:</Text>
              {item.tipoAlteracao !== 'Funcionário demitido ou contrato encerrado' ? (
                <>
                  <Text style={styles.text}>{`Nome: ${item.detalhes.nome}, Sexo: ${item.detalhes.sexo}, Endereco: ${item.detalhes.endereco}, Telefone: ${item.detalhes.telefone}, Data de nascimento: ${item.detalhes.dataNascimento}`}</Text>
                  <Text style={styles.text}>{`Data de Admissão: ${item.detalhes.dataAdmissao}, cargo: ${item.detalhes.cargo}, Status: ${item.detalhes.status}`}</Text>
                </>
              ) : (
                <Text style={styles.text}>Sem detalhes - Funcionário demitido ou contrato encerrado</Text>
              )}
              <Text style={styles.subtitle}>Data da Alteração:</Text>
              <Text style={styles.text}>{item.dataAlteracao}</Text>
              <Text style={styles.subtitle}>Status:</Text>
              <Text style={styles.text}>{item.tipoAlteracao}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default FuncionarioPDF;
