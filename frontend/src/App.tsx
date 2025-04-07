import { useEffect, useState } from "react";
import "./App.css";
import { Todo } from "./types/todo";
import { getTodos, addTodo, deleteTodo, toggleTodo, updateTodo } from "./api/todos";
import TodoList from "./components/TodoList/TodoList";

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [filter, setFilter] = useState<"all" | "open" | "done">("all");

    useEffect(() => {
        getTodos().then((res) => setTodos(res.data));
    }, []);

    const handleAdd = () => {
        if (!newTodo.trim()) return;
        addTodo({ title: newTodo, done: false }).then((res) => {
            setTodos([...todos, res.data]);
            setNewTodo("");
        });
    };

    const handleToggle = (id: number) => {
        toggleTodo(id).then((res) => {
            setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
        });
    };

    const handleDelete = (id: number) => {
        deleteTodo(id).then(() => {
            setTodos(todos.filter((todo) => todo.id !== id));
        });
    };

    const handleEdit = (updated: Todo) => {
        updateTodo(updated).then((res) => {
            setTodos(todos.map((todo) => (todo.id === res.data.id ? res.data : todo)));
        });
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === "open") return !todo.done;
        if (filter === "done") return todo.done;
        return true;
    });

    return (
        <div className="App">
            <h1>📝 ToDo App</h1>
            <div className="todo-input">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Neues Todo..."
                />
                <button className="add-btn" onClick={handleAdd} title="Todo hinzufügen">
                    +
                </button>
            </div>

            <p className="hint">🖱️ Doppelklick auf ein Todo, um es zu bearbeiten</p>

            <div className="filter-buttons">
                <button onClick={() => setFilter("all")} disabled={filter === "all"}>🔵 Alle</button>
                <button onClick={() => setFilter("open")} disabled={filter === "open"}>⚪ Offen</button>
                <button onClick={() => setFilter("done")} disabled={filter === "done"}>✅ Erledigt</button>
            </div>

            <TodoList
                todos={filteredTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
                filter={filter}
            />
        </div>
    );
}
