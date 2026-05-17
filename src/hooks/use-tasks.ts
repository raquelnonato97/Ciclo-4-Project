import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { showError } from '@/utils/toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tarefas_ia_iv')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      showError("Erro ao carregar tarefas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (titulo: string, detalhes: string) => {
    try {
      const { error } = await supabase
        .from('tarefas_ia_iv')
        .insert([{ 
          titulo, 
          detalhes, 
          status: 'pendente',
          data_criacao: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchTasks();
    } catch (error: any) {
      showError("Erro ao adicionar tarefa: " + error.message);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tarefas_ia_iv')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchTasks();
    } catch (error: any) {
      showError("Erro ao atualizar tarefa: " + error.message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tarefas_ia_iv')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error: any) {
      showError("Erro ao excluir tarefa: " + error.message);
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}