import { useEffect, useState } from 'react';
import { getItems, createItem } from './api';

interface Item {
  id: number;
  nome: string;
  criado_em: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    const data = await getItems();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    await createItem(nome);
    setNome('');
    await fetchItems();
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Meu Produto</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do item"
          style={{ padding: '0.5rem', marginRight: '0.5rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Adicionar
        </button>
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.nome}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
