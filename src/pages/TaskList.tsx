import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowLeft, Calendar, CheckCircle2, Circle } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";

const TaskList = () => {
  const { tasks, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteTask(id);
    showError("Tarefa excluída permanentemente.");
  };

  const toggleComplete = (id: string, currentStatus: string | null) => {
    const completedAt = currentStatus ? null : new Date().toISOString();
    updateTask(id, { completedAt });
    showSuccess(completedAt ? "Tarefa concluída!" : "Tarefa reaberta.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/")}
              className="rounded-full bg-white shadow-sm border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          </div>
          <Button 
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6"
          >
            Nova Tarefa
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500 mt-1">Comece criando sua primeira tarefa hoje!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${task.completedAt ? 'bg-gray-50/50' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 pt-1">
                      <button 
                        onClick={() => toggleComplete(task.id, task.completedAt)}
                        className="transition-transform active:scale-90"
                      >
                        {task.completedAt ? (
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                        ) : (
                          <Circle className="w-7 h-7 text-gray-300 hover:text-indigo-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex-grow space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={task.title}
                          onChange={(e) => updateTask(task.id, { title: e.target.value })}
                          className={`text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent ${task.completedAt ? 'line-through text-gray-400' : 'text-gray-900'}`}
                        />
                        <Textarea
                          value={task.details}
                          onChange={(e) => updateTask(task.id, { details: e.target.value })}
                          className="text-gray-600 border-none p-0 min-h-[40px] focus-visible:ring-0 bg-transparent resize-none"
                          placeholder="Sem detalhes..."
                        />
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Criada em: {format(new Date(task.createdAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </div>
                        {task.completedAt && (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Encerrada em: {format(new Date(task.completedAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-start">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
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