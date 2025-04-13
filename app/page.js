"use client"
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Protectedroute from "./middleware/protectedroute";
import { addtask, gettasks } from "@/lib/task";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [user, setuser] = useState({})
  const [loading, setloading] = useState(true)
  // console.log(user, "user");
  const [tasks, setTasks] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // creating the newtask obj
    const newTask = {
      title: taskName,
      status: "pending",
    };
    console.log("add task");

    // adding the task in the database
    const newtask = await addtask(newTask, user.uid)
    setTasks((prev) => [...prev, newtask])
    setTaskName("");
    setShowForm(false); // hide form after submit
  };

  // handleing the logout feature

  const handlelogout = async () => {
    try {
      console.log("logout");

      await signOut(auth);
      // dispatch(removeuser())

      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  // in this effect fetch the task on the base on the user and update the state
  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await gettasks(user.uid)
      setTasks(tasks)
    }
    fetchTasks();
    const usercreditals = onAuthStateChanged(auth, (u) => {
      if (u) {
        setuser(u)
        console.log(user);
        setloading(false)
      }
      else {
        console.log('no user');
        router.push('/signup')
      }
    })
    return () => usercreditals();


  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>

      </div>
    )
  }
  else {
    return (
      <>
        <div className="">
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Task
              </button>
            </form>
          )}
        </div>



        <div className="min-h-screen bg-gray-100">
          {/* Navigation Bar */}
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">TaskMaster</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.email}</span>
                  <button
                    onClick={handlelogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
                <p className="text-3xl font-bold text-indigo-600">{tasks.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                <p className="text-3xl font-bold text-green-600">
                  {tasks.filter(task => task.status === "completed").length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {tasks.filter(task => task.status === "pending").length}
                </p>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md" onClick={() => setShowForm(!showForm)}>
                    Add New Task
                  </button>
                </div>

                <div className="space-y-4 ">
                  {tasks.map((task) => (
                    <div key={task.taskId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 border-amber-300 border-2 w-[50%]">
                        {/* <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          className="h-4 w-4 text-indigo-600 rounded"
                        /> */}
                        <span className={`${task.status === "completed" ? "line-through text-gray-500" : "text-gray-700"
                          }  `}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        } text-center border-2`}>
                        {task.status}
                      </span>

                      {/* {
                        task.status !== "completed" ? <button onClick={() => { }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">Mark as completed</button> : null

                      } */}

                      <button onClick={() => { }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">edit</button>
                      <button onClick={() => { }} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">Remove</button>
                    </div>

                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </>


    );
  }
}