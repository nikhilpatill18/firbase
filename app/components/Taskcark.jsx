"use client"
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { editstatus, edittaskstitle, deteletask } from '@/lib/task'


const Taskcark = ({ t, darkMode, ondelete }) => {
    // console.log("task in task component", task);
    const task = t
    const [edit, setedit] = useState(false)
    const [ta, settasks] = useState(task.title)
    const [completed, setcompleted] = useState(task.status == "completed" ? true : false)

    const updatetask = async (taskid, updatetitle) => {
        const ut = await edittaskstitle(taskid, updatetitle)
        if (!ut) {
            console.log(ut, 'ut');
            setedit(!edit)
        }

    }
    const updateStatus = async (taskid, comp) => {
        const status = !comp ? "completed" : "pending"
        console.log(status);

        const up = await editstatus(taskid, status)
        if (!up) {
            console.log("status");

            setcompleted(!completed)
        }
    }


    return (
        <div>
            <div
                key={task.taskId}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border ${darkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                    } transition-colors`}
            >
                <input type="checkbox" name="check" id="" checked={completed} onChange={() => { updateStatus(task.taskId, completed) }} />
                <div className="flex items-center space-x-4 mb-3 sm:mb-0 w-full sm:w-auto">
                    <input className={`${completed
                        ? "line-through opacity-70"
                        : ""
                        } text-lg break-words flex-1 border-0`} value={ta} onChange={(e) => settasks(e.target.value)} readOnly={!edit} />


                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                        {completed ? "completed" : "pending"}
                    </span>

                    {!edit && <button
                        onClick={() => { setedit(!edit) }}
                        className={`${darkMode
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-indigo-600 hover:bg-indigo-700"} text-white text-sm font-medium py-1 px-3 rounded-md transition-colors border-0`}
                        disabled={completed} >
                        Edit
                    </button>}
                    {
                        edit && <button
                            onClick={() => { updatetask(task.taskId, ta) }}
                            className={`${darkMode
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "bg-indigo-600 hover:bg-indigo-700"} text-white text-sm font-medium py-1 px-3 rounded-md transition-colors`}
                        >
                            update
                        </button>
                    }


                    <button
                        onClick={() => { ondelete(task.taskId) }}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Taskcark
