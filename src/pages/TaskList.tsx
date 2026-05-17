import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowLeft, Calendar, CheckCircle2, Circle, Loader2, Clock } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";

const TaskList = () => {
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    showError("Tarefa excluída permanentemente.");
  };

  const toggleComplete = async (id: string, currentStatus: string) => {
    const isCompleted = currentStatus === 'concluido';
    const updates = {
      status: isCompleted ? 'pendente' : 'concluido' as any,
      data_conclusao: isCompleted ? null : new Date().toISOString()
    };
    await updateTask(id, updates);
    showSuccess(!isCompleted ? "Tarefa concluída!" : "Tarefa reaberta.");
  };

  const handleDateChange = async (id: string, newDate: string) => {
    if (!newDate) return;
    try {
      const isoDate = new Date(newDate).toISOString();
      await updateTask(id, { data_conclusao: isoDate });
      showSuccess("Data de conclusão atualizada!");
    } catch (e) {
      showError("Data inválida.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4A5D23]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A5D23] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/")}
              className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Minhas Tarefas</h1>
          </div>
          <Button 
            onClick={() => navigate("/")}
            className="bg-white text-[#4A5D23] hover:bg-gray-100 rounded-xl px-6 font-semibold"
          >
            Nova Tarefa
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white/10 rounded-3xl border border-dashed border-white/30">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white">Nenhuma tarefa encontrada</h3>
            <p className="text-white/70 mt-1">Comece criando sua primeira tarefa hoje!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card 
                key={task.id} 
                className={`overflow-hidden border-none shadow-lg transition-all hover:scale-[1.01] ${
                  task.status === 'concluido' 
                    ? 'bg-gray-200' 
                    : 'bg-red-100'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 pt-1">
                      <button 
                        onClick={() => toggleComplete(task.id, task.status)}
                        className="transition-transform active:scale-90"
                      >
                        {task.status === 'concluido' ? (
                          <CheckCircle2 className="w-7 h-7 text-green-600" />
                        ) : (
                          <Circle className="w-7 h-7 text-red-400 hover:text-red-600" />
                        )}
                      </button>
                    </div>

                    <div className="flex-grow space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={task.titulo}
                          onChange={(e) => updateTask(task.id, { titulo: e.target.value })}
                          className={`text-xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent ${
                            task.status === 'concluido' ? 'line-through text-gray-500' : 'text-red-900'
                          }`}
                        />
                        <Textarea
                          value={task.detalhes}
                          onChange={(e) => updateTask(task.id, { detalhes: e.target.value })}
                          className={`border-none p-0 min-h-[40px] focus-visible:ring-0 bg-transparent resize-none ${
                            task.status === 'concluido' ? 'text-gray-500' : 'text-red-800'
                          }`}
                          placeholder="Sem detalhes..."
                        />
                      </div>

                      <div className={`flex flex-wrap gap-4 text-xs font-medium pt-2 border-t ${
                        task.status === 'concluido' ? 'border-gray-300 text-gray-500' : 'border-red-200 text-red-700'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Criada em: {format(new Date(task.data_criacao), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </div>
                        
                        {task.status === 'concluido' && task.data_conclusao && (
                          <div className="flex items-center gap-2 text-green-700 bg-green-100/50 px-2 py-1 rounded-md border border-green-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Concluída em:</span>
                            <input
                              type="datetime-local"
                              value={format(parseISO(task.data_conclusao), "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => handleDateChange(task.id, e.target.value)}
                              className="bg-transparent border-none p-0 text-xs font-bold focus:outline-none cursor-pointer hover:underline"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-start">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        className={`${
                          task.status === 'concluido' 
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                            : 'text-red-400 hover:text-red-700 hover:bg-red-200'
                        } rounded-full`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;