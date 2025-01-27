'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { api, Task } from '@/lib/api';
import Link from 'next/link';
import { PlusCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<'pending' | 'completed'>('pending');
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const fetchedTasks = await api.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const task = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
    };
    try {
      const newTask = await api.createTask(task);
      setTasks([newTask, ...tasks]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('pending');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Pending: {tasks.filter(t => t.status === 'pending').length}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>Completed: {tasks.filter(t => t.status === 'completed').length}</span>
            </div>
          </div>
        </div>
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>Create New Task</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="min-h-24 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value as 'pending' | 'completed')}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="group hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {task.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
                <div className="mt-4 flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {task.status}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href={`/tasks/${task.id}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 group-hover:underline"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}