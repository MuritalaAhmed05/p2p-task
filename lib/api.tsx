export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    createdAt: string;
  }
let tasks: Task[]= [];
export const api = {
    getTasks: async(): Promise<Task[]>=>{
        return new Promise((resolve) => {
            setTimeout(() => resolve(tasks), 500);
        })
    },
    getTask: async(id: string): Promise<Task | undefined>=>{
        return new Promise((resolve) =>{
            setTimeout(() => resolve(tasks.find((task) => task.id === id)), 500);
        })
    },
    createTask : async(task: Omit<Task, "id" | "createdAt">): Promise<Task>=>{
        const newTask: Task = {
            ...task,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        tasks = [newTask, ...tasks];
        return new Promise((resolve)=>{
            setTimeout(() => resolve(newTask), 500);
        })
    },
    updateTaskStatus: async(id: string, status: Task["status"]):Promise<Task | undefined>=>{
        const task = tasks.find((t) => t.id === id);
        if (task) {
            task.status = status;
            return new Promise((resolve) => {
                setTimeout(() => resolve(task), 500);
            });
        }
        return undefined;

    }
}
