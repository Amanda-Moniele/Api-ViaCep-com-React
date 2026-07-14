import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./styles.css";
import api from "./services/api";

function App() {
  const [input, setInput] = useState("");
  const [cep, setCep] = useState({});

  function formatCep(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  }

  async function handleSearch() {
    const cepLimpo = input.replace(/\D/g, "");

    if (cepLimpo === "") {
      alert("Digite um CEP!");
      return;
    }

    if (cepLimpo.length !== 8) {
      alert("CEP deve ter 8 dígitos!");
      return;
    }

    try {
      const response = await api.get(`${cepLimpo}/json`);

      if (response.data.erro) {
        alert("CEP não encontrado!");
        setCep({});
        setInput("");
        return;
      }

      setCep(response.data);
      setInput("");
    } catch {
      alert("Ops, erro ao buscar o CEP!");
      setCep({});
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscar Cep</h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite seu CEP..."
          value={formatCep(input)}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#fff" />
        </button>
      </div>

      {Object.keys(cep).length > 0 && (
        <main className="main">
          <h2>CEP: {cep.cep}</h2>
          {cep.logradouro && <span>{cep.logradouro}</span>}
          {cep.complemento && <span>Complemento: {cep.complemento}</span>}
          {cep.bairro && <span>{cep.bairro}</span>}
          {cep.localidade && cep.uf && (
            <span>{cep.localidade} - {cep.uf}</span>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
