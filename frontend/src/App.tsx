import React, { useEffect, useState } from "react";
import { getTodos, addTodo, deleteTodo } from "./api";

type Todo = {
    id: number;
    title: string;
    done: boolean;
};

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");

    // Todos vom Backend laden
    useEffect(() => {
        getTodos()
            .then((res: { data: Todo[] }) => setTodos(res.data))
            .catch((err) => console.error("Fehler beim Laden der Todos:", err));
    }, []);

    // Neues Todo hinzufügen
    const handleAdd = () => {
        if (!newTodo.trim()) return;

        addTodo({ title: newTodo, done: false })
            .then((res: { data: Todo }) => {
                setTodos([...todos, res.data]);
                setNewTodo("");
            })
            .catch((err) => console.error("Fehler beim Hinzufügen:", err));
    };

    // Todo löschen
    const handleDelete = (id: number) => {
        deleteTodo(id)
            .then(() => {
                setTodos(todos.filter((todo) => todo.id !== id));
            })
            .catch((err) => console.error("Fehler beim Löschen:", err));
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>To-Do App</h1>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Neues Todo eingeben"
                    style={{ padding: "0.5rem", width: "70%" }}
                />
                <button onClick={handleAdd} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
                    Hinzufügen
                </button>
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            background: "#f0f0f0",
                            marginBottom: "0.5rem",
                            padding: "0.75rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "5px"
                        }}
                    >
                        <span>{todo.title}</span>
                        <button onClick={() => handleDelete(todo.id)} style={{ color: "red" }}>
                            Löschen
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
