export interface Task {
  id: string;
  titulo: string;
  detalhes: string;
  data_criacao: string;
  status: 'pendente' | 'concluido';
  data_conclusao: string | null;
  user_id?: string;
}