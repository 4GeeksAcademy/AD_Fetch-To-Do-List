import React, { useState, useEffect } from "react";
import "./styles.css";

const Home = () => {
  const [counter, setCounter] = useState(1);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [dbExist, setDbExist] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const handleInput = (evt) => {
    setTodo(evt.target.value);
  };

  const handleDelete = async () => {
    try {
      await fetch("https://playground.4geeks.com/apis/fake/todos/user/Diaz", {
        method: "DELETE",
      });
      setTodos([]);
      setTodo("");
    } catch (error) {
      console.error("Error deleting todos:", error);
      setError("Error deleting todos");
    }
  };

  const handleClick = async () => {
    try {
      const newTodo = {
        id: counter,
        done: false,
        label: todo,
      };

      setCounter(counter + 1);
      const newTodos = [...todos, newTodo];
      await fetch("https://playground.4geeks.com/apis/fake/todos/user/Diaz", {
        method: "PUT",
        body: JSON.stringify(newTodos),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTodos(newTodos);
      setTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Error adding todo");
    }
  };

  const handleDeleteTodo = (todoId) => async () => {
    try {
      const newTodos = todos.filter((data) => data.id !== todoId);
      await fetch("https://playground.4geeks.com/apis/fake/todos/user/Diaz", {
        method: "PUT",
        body: JSON.stringify(newTodos),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTodos(newTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Error deleting todo");
    }
  };

  useEffect(() => {
    const createDb = async () => {
      try {
        const res = await fetch(
          "https://playground.4geeks.com/apis/fake/todos/user/Diaz",
          {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (
          data.msg === "The user exist" ||
          data.msg === "The user has been deleted successfully"
        ) {
          setDbExist(true);
        }
      } catch (error) {
        console.error("Error creating database:", error);
        setError("Error creating database");
      } finally {
        setLoading(false);
      }
    };

    createDb();
  }, []);

  useEffect(() => {
    if (!dbExist && !error) {
      const getDb = async () => {
        try {
          const res = await fetch(
            "https://playground.4geeks.com/apis/fake/todos/user/Diaz"
          );
          const data = await res.json();
          console.log("DB DATA", data);
          setTodos(data);
        } catch (error) {
          console.error("Error fetching todos:", error);
          setError("Error fetching todos");
        }
      };
      getDb();
    }
  }, [dbExist, error]);

  const handleDone = (todoId) => async () => {
    try {
      const newTodos = todos.map((data) => {
        if (todoId === data.id) {
          return {
            ...data,
            done: true,
          };
        }
        return data;
      });

      await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/Diaz",
        {
          method: "PUT",
          body: JSON.stringify(newTodos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTodos(newTodos);
    } catch (error) {
      console.error("Error marking todo as done:", error);
      setError("Error marking todo as done");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    handleClick();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          <strong>Things To Do</strong>
        </h1>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            onChange={handleInput}
            value={todo}
          />
          <button type="submit">Add Task</button>
        </div>
      </form>
      <div className="tasks">
        {todos.map((data) => (
          <div key={data.id} className="task">
            <p className={data.done ? "done" : ""}>{data.label}</p>
            <button onClick={handleDone(data.id)}>Completed</button>
            <button onClick={handleDeleteTodo(data.id)}>Erase</button>
          </div>
        ))}
      </div>
      <div className="footer">
        <button onClick={handleDelete}>Erase All</button>
      </div>
    </div>
  );
};

export default Home;
