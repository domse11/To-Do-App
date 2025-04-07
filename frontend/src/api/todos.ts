import axios from "axios";
import {Todo} from "../types/todo";

// Base-URL der API
const API_BASE = "http://localhost:8080/api/todos";

// Alle Todo's laden
export const getTodos = () => axios.get<Todo[]>(API_BASE);

// Neues Todo erstellen
export const addTodo = (todo: Partial<Todo>) => axios.post(API_BASE, todo);

// Todo erledigt/unerledigt toggeln
export const toggleTodo = (id: number) => axios.put(`${API_BASE}/${id}/toggle`);

// Todo bearbeiten
export const updateTodo = (todo: Todo) => axios.put(`${API_BASE}/${todo.id}`, todo);

// Todo löschen
export const deleteTodo = (id: number) => axios.delete(`${API_BASE}/${id}`);
