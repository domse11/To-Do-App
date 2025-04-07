import { useState } from "react";
import { Todo } from "../../types/todo";
import "./TodoItem.css";

interface Props {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: () => void;
    onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit({ ...todo, title: editTitle });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setIsEditing(false);
    };

    return (
        <div
            className={`todo-item ${todo.done ? "done" : ""}`}
            onClick={() => !isEditing && onToggle(todo)}
            onDoubleClick={() => !isEditing && setIsEditing(true)}
        >
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
                    <div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave();
                            }}
                            title="Speichern"
                        >
                            💾
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancel();
                            }}
                            title="Abbrechen"
                        >
                            ❌
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <span className="status-icon" title="Status">
                        {todo.done ? "✅" : "🔵"}
                    </span>

                    <span
                        style={{ flex: 1, textAlign: "left", cursor: "pointer" }}
                        title="Doppelklick zum Bearbeiten"
                    >
                        {todo.title}
                    </span>

                    <div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            title="Löschen"
                        >
                            🗑️
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
