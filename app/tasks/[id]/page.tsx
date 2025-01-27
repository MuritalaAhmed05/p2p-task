'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api, Task } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      api
  .getTask(id as string)
  .then((task) => {
    if (task) {
      setTask(task);
    } else {
      setError('Task not found.');
    }
  })
  .catch(() => setError('Task not found.'))
  .finally(() => setLoading(false));
    }
  }, [id]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-gray-600">{error}</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Task List
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
          <p className="text-gray-600">Task not found.</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Task List
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Task List
            </Button>
          </Link>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            {task.status}
          </span>
        </div>
        <Card className="border-2 shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-2xl font-bold tracking-tight">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Created on {new Date(task.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <div className="flex justify-between items-center w-full">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                className={
                  task.status === 'completed'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                {task.status === 'completed' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                   Pending
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default TaskPage;
