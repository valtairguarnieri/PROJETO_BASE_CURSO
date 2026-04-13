import { Migration } from './runner';
import { migration_001 } from './001_create_items';

// Registre novas migrations aqui na ordem de versão.
// Exemplo:
// import { migration_002 } from './002_add_descricao_to_items';

export const migrations: Migration[] = [
  migration_001,
  // migration_002,
];
