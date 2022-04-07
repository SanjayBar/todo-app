import React, { useEffect, useRef, useState } from "react";

import { FaRegTimesCircle, FaRegEdit } from "react-icons/fa";

function App() {
  const listOfTasks = JSON.parse(localStorage.getItem("taskList")) || [];

  const [newTask, setNewTask] = useState("");
  const [taskState, setTaskState] = useState(listOfTasks);
  const editId = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    container.current.focus();
  }, [newTask]);

  useEffect(() => {
    localStorage.removeItem("taskList");
    localStorage.setItem("taskList", JSON.stringify(taskState));
  }, [taskState]);

  const addTask = () => {
    if (!newTask) {
      return;
    }

    if (editId.current) {
      let position = null;
      taskState.forEach((task, index) => {
        if (task.id === editId.current) {
          position = index;
        }
      });
      const newIdTask = { id: editId.current, name: newTask };
      setTaskState((tasks) => {
        const arr = [...tasks];
        arr.splice(position, 1, newIdTask);
        return arr;
      });
      editId.current = null;
      setNewTask("");
      return;
    }

    if (!editId.current) {
      setTaskState((tasks) => {
        const id = new Date().getTime().toString();
        const newIdTask = { id, name: newTask };
        return [newIdTask, ...tasks];
      });
      setNewTask("");
    }
  };

  const removeItem = (id) => {
    const newTasksState = taskState.filter((task) => task.id !== id);
    setTaskState(newTasksState);
  };

  const updateItem = (taskId) => {
    const taskToUpdate = taskState.find((task) => task.id === taskId);
    const { id, name } = taskToUpdate;
    setNewTask(name);
    editId.current = id;
  };

  return (
    <main>
      <section className="main-section">
        <div className="todo-main-div">
          <div className="todo-title-div">
            <h2>Whats the plan for today?</h2>
            <div className="input-todo-title">
              <input
                type="text"
                placeholder="Add a note"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                ref={container}
                required
              />
              <button type="button" className="btn" onClick={addTask}>
                {editId.current ? "Edit Task" : "Add Task"}
              </button>
            </div>
          </div>
          <hr />
          <div className="display-todo">
            {taskState.map((task) => {
              const { id, name } = task;
              return (
                <article key={id} className="todo-display-article">
                  <h4>{name}</h4>
                  <div className="todo-btn">
                    <button type="button" onClick={() => removeItem(id)}>
                      <FaRegTimesCircle />
                    </button>
                    <button type="button" onClick={() => updateItem(id)}>
                      <FaRegEdit />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
