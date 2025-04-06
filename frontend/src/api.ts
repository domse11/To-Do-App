import axios from "axios";

const API_BASE = "http://localhost:8080/api/todos";

// Holt alle Todos vom Backend
export const getTodos = () => axios.get(API_BASE);

// Sendet ein neues Todo an das Backend
export const addTodo = (todo: { title: string; done: boolean }) =>
    axios.post(API_BASE, todo);

// Löscht ein Todo mit gegebener ID
export const deleteTodo = (id: number) =>
    axios.delete(`${API_BASE}/${id}`);
