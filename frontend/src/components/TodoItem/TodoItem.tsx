import {useState} from "react";
import {Todo} from "../../types/todo";
import "./TodoItem.css";

// Props, die die Komponente von außen bekommt
interface Props {
    todo: Todo;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: (todo: Todo) => void;
}

export default function TodoItem({todo, onToggle, onDelete, onEdit}: Props) {
    const [isEditing, setIsEditing] = useState(false); // Editiermodus?
    const [editTitle, setEditTitle] = useState(todo.title); // Temporärer Titel

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit({...todo, title: editTitle});
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditTitle(todo.title); // Reset bei ESC
    };

    return (
        <div className={`todo-item ${todo.done ? "done" : ""}`}>
            {isEditing ? (
                <>
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        autoFocus
                    />
                    <button onClick={handleSave}>💾</button>
                    <button onClick={handleCancel}>❌</button>
                </>
            ) : (
                <>
            <span onClick={onToggle} onDoubleClick={() => setIsEditing(true)}>
        {todo.title}
        </span>
                    <button onClick={onDelete}>🗑️</button>
                </>
            )}
        </div>
    );
}
