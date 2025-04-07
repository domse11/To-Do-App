import TodoItem from "../TodoItem/TodoItem";
import { Todo } from "../../types/todo";

interface Props {
    todos: Todo[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
    filter: "all" | "open" | "done";
}

export default function TodoList({ todos, onToggle, onDelete, onEdit, filter }: Props) {
    const filteredTodos = todos.filter((todo) => {
        if (filter === "open") return !todo.done;
        if (filter === "done") return todo.done;
        return true;
    });

    if (filteredTodos.length === 0) {
        return <p style={{ color: "#888" }}>Keine Todos vorhanden.</p>;
    }

    return (
        <div>
            {filteredTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => onToggle(todo.id)}
                    onDelete={() => onDelete(todo.id)}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
