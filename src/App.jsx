import { useState, useEffect } from 'react';
import './App.css';

const API_URL = "";

const MOCK_ALUNOS = [
  { id: 50, nome: "ana", turma: "501", curso: "analise e desenvolvimento de sistemas", matricula: "2132131" },
  { id: 55, nome: "joão", turma: "501", curso: "analise de sistemas", matricula: "2132131" },
  { id: 60, nome: "Pedro", turma: "501", curso: "ciências da computação", matricula: "2132131" },
  { id: 44, nome: "Maria", turma: "501", curso: "engenharia de software", matricula: "2132131" },
  { id: 33, nome: "José", turma: "501", curso: "analise e desenvolvimento de sistemas", matricula: "2132131" },
  { id: 47, nome: "Ana Clara", turma: "501", curso: "desenvolvimento de sistemas", matricula: "2132131" },
  { id: 70, nome: "João", turma: "501", curso: "ciências da computação", matricula: "2132131" },
  { id: 22, nome: "Pedro", turma: "501", curso: "ciência da computação", matricula: "2132131" }
];

function App() {
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    turma: '',
    curso: '',
    style: { display: 'flex', flexDirection: 'column', gap: '10px' }
  });



  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    if (!API_URL) {
      setAlunos(MOCK_ALUNOS);
      return;
    }
    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error(`Erro ao buscar alunos: ${resp.status}`);
      const data = await resp.json();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setAlunos(MOCK_ALUNOS); 
      alert("API fora do ar. Exibindo dados simulados.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, matricula, turma, curso } = formData;

    if (!nome || !matricula || !turma || !curso) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!API_URL) {
      alert("API fora do ar. Não é possível cadastrar alunos.");
      return;
    }

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, matricula, turma, curso }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        let errorMessage = `Erro ao cadastrar aluno: ${resp.status} ${resp.statusText}`;
        if (errorData && errorData.erro) {
          errorMessage += ` Detalhes: ${errorData.erro}`;
        }
        throw new Error(errorMessage);
      }

      alert("Aluno inserido com sucesso!");
      setFormData({ nome: '', matricula: '', turma: '', curso: '' });
      carregarAlunos();
    } catch (error) {
      console.error("Erro ao salvar aluno na API:", error);
      alert("Erro ao cadastrar aluno.");
    }
  };

  return (
    <main className='container'>
      <h1>Cadastro de Alunos</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />

        <label htmlFor="matricula">Matrícula:</label>
        <input type="text" name="matricula" value={formData.matricula} onChange={handleInputChange} required />

        <label htmlFor="turma">Turma:</label>
        <input type="text" name="turma" value={formData.turma} onChange={handleInputChange} required />

        <label htmlFor="curso">Curso:</label>
        <input type="text" name="curso" value={formData.curso} onChange={handleInputChange} required />

        <button type="submit">Cadastrar Aluno</button>
      </form>

      <h2>Lista de Alunos</h2>
      <table id='alunoTable'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Turma</th>
            <th>Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome ?? ''}</td>
              <td>{aluno.matricula ?? ''}</td>
              <td>{aluno.turma ?? ''}</td>
              <td>{aluno.curso ?? ''}</td>
              <td>
                <button
                  style={{
                    color: "#272727",
                    border: "2px solid #000",
                    background: "transparent",
                    fontSize: "18px",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  
                    fontFamily: "Raleway, sans-serif",
                  }}
                  onClick={() => alert(`Editar aluno ${aluno.nome} (ID: ${aluno.id})`)}
                >
                  Editar
                </button>
                <button
                  style={{
                    color: "#000",
                    border: "2px solid #000",
                    fontSize: "18px",
                    background: "#FFF8DC",
                    borderRadius: "5px",
                    gap: "2rem",
                    fontFamily: "Raleway, sans-serif",

                  }}
                  onClick={() => alert(`Deletar aluno ${aluno.nome} (ID: ${aluno.id})`)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;