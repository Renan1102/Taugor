import { db } from "../../../../firebase";
import { updateDoc, deleteDoc, getDoc, doc, query, collection, where, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  // GET api/empresa/:id
  // DELETE api/empresa/:id
  // PUT api/empresa/:id

  const { method, query: { id } } = req;

  try {
    switch (method) {
      case "PUT":
        const updatedFunc = await updateFuncionario(id, req.body);
        return res.json({ success: true, data: updatedFunc });
      case "DELETE":
        const deletedFunc = await deleteFuncionario(id);
        return res.json({ success: true, data: deletedFunc });
      case "GET":
        const funcData = await getFuncionario(id);
        return res.json({ success: true, data: funcData });
      default:
        return res.status(500).json({ success: false, error: "Falha de servidor" });
    }
  } catch (error) {
    console.error("Erro na solicitação:", error);
    return res.status(500).json({ success: false, error: "Erro na solicitação" });
  }
}

// Função para atualizar empresa no Firestore
async function updateFuncionario(id, data) {
  const funcRef = doc(db, 'Funcionarios', id);
  await updateDoc(funcRef, data);
  const updatedFuncSnapshot = await getDoc(funcRef);
  return updatedFuncSnapshot.data();
}

// Função para deletar empresa no Firestore
async function deleteFuncionario(id) {
  const funcRef = doc(db, 'Funcionarios', id);
  const deletedFuncSnapshot = await getDoc(funcRef);
  await deleteDoc(funcRef);
  
  // Consulta o histórico do funcionário com base no ID
  const historicoQuery = query(collection(db, 'HistoricoFuncionarios'), where('idFuncionario', '==', id));
  const historicoSnapshot = await getDocs(historicoQuery);

  // Itera sobre os documentos do histórico e os exclui um por um
  const deletions = historicoSnapshot.docs.map(async (doc) => {
    await deleteDoc(doc.ref);
    return doc.data();
  })
  
// Espera que todas as exclusões sejam concluídas
await Promise.all(deletions);

return { deletedFuncionario: id, deletedHistorico: historicoSnapshot.docs.map(doc => doc.id) };
}

// Função para obter dados da empresa do Firestore
async function getFuncionario(id) {
  const funcSnapshot = await db.collection("Funcionario").doc(id).get();
  return funcSnapshot.data();
}
