const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function checkDatabase(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health/db`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function getItems() {
  const res = await fetch(`${BASE_URL}/api/items`);
  return res.json();
}

export async function createItem(nome: string) {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome }),
  });
  return res.json();
}
