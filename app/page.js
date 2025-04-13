"use client"
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { addtask, deteletask, gettasks } from "@/lib/task";
import Taskcark from "./components/Taskcark";
import Navbar from "./components/Navbar";
import { darkmode } from "@/store/darkmodeslice";
import { useDispatch } from "react-redux";
export default function Home() {
  const router = useRouter();
  const [user, setuser] = useState({});
  const [loading, setloading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch()

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", !darkMode);
    }
    dispatch(darkmode(!darkMode))
  };

  // Load saved theme preference and the set the user state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setDarkMode(savedTheme === "true");
        dispatch(darkmode(!darkMode))


      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
        dispatch(darkmode(!darkMode))

      }
    }
    const usercreditals = onAuthStateChanged(auth, (u) => {
      if (u) {
        setuser(u)
        setloading(false)
      }
      else {
        router.push('/signup')
      }
    })
    return () => usercreditals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // creating the newtask obj
    const newTask = {
      title: taskName,
      status: "pending",
    };

    // adding the task in the database
    const newtask = await addtask(newTask, user.uid);
    setTasks((prev) => [...prev, newtask]);
    setTaskName("");
    setShowForm(false); // hide form after submit
  };

  // handleing the logout feature
  const handlelogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }
  const handleDelete = async (taskId) => {
    await deteletask(taskId);
    setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
  };



  // in this effect fetch the task on the base on the user and update the state
  useEffect(() => {
    const fetchTasks = async () => {

      const tasks = await gettasks(user.uid)
      setTasks(tasks)
    }
    fetchTasks();

  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${darkMode ? "border-purple-500" : "border-indigo-600"}`}></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Modal for Add Task */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Add New Task</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none ${darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                  : "bg-white border-gray-300 focus:ring-indigo-500"}`}
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${darkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Bar */}

      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} user={user} handlelogout={handlelogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6 transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Total Tasks</h3>
            <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-purple-400" : "text-indigo-600"}`}>{tasks.length}</p>
          </div>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6 transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Completed</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {tasks.filter(task => task.status === "completed").length}
            </p>
          </div>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6 transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Pending</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {tasks.filter(task => task.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Task List */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className={`text-xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Your Tasks</h2>
              <button
                className={`w-full sm:w-auto transition-colors ${darkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-indigo-600 hover:bg-indigo-700"} text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2`}
                onClick={() => setShowForm(!showForm)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg">No tasks yet. Add your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Taskcark t={task} darkMode={darkMode} key={task.taskId} ondelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}