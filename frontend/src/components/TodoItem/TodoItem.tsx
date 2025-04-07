import {useState} from "react";
import {Todo} from "../../types/todo";
import "./TodoItem.css";

interface Props {
    todo: Todo;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: (todo: Todo) => void;
}

export default function TodoItem({todo, onToggle, onDelete, onEdit}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit({...todo, title: editTitle});
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setIsEditing(false);
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
                    <div>
                        <button onClick={handleSave} title="Speichern">💾</button>
                        <button onClick={handleCancel} title="Abbrechen">❌</button>
                    </div>
                </>
            ) : (
                <>

                    <span
                        onClick={onToggle}
                        onDoubleClick={() => setIsEditing(true)}
                        title="Klicken zum Erledigen, Doppelklick zum Bearbeiten"
                        style={{flex: 1, textAlign: "left", cursor: "pointer"}}
                    >
            {todo.title}
          </span>

                    <div>
                        <button onClick={onDelete} title="Löschen">🗑️</button>
                    </div>
                </>
            )}
        </div>
    );
}
