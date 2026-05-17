import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, ListTodo } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { showSuccess } from "@/utils/toast";

const Index = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await addTask(title, details);
    showSuccess("Tarefa adicionada com sucesso!");
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <PlusCircle className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Nova Tarefa</CardTitle>
          <CardDescription className="text-gray-500">
            Organize seu dia adicionando uma nova atividade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Título</label>
              <Input
                placeholder="O que precisa ser feito?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Detalhes</label>
              <Textarea
                placeholder="Adicione mais informações sobre a tarefa..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-[120px] rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                Criar Tarefa e Ver Lista
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => navigate("/tasks")}
                className="w-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl py-6"
              >
                <ListTodo className="w-4 h-4 mr-2" />
                Ver Tarefas Existentes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;