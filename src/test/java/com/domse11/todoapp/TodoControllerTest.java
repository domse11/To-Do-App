package com.domse11.todoapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoRepository todoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnAllTodos() throws Exception {
        Todo todo1 = new Todo("Test 1", false);
        todo1.setId(1L);
        Todo todo2 = new Todo("Test 2", true);
        todo2.setId(2L);

        when(todoRepository.findAll()).thenReturn(Arrays.asList(todo1, todo2));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Test 1"))
                .andExpect(jsonPath("$[1].done").value(true));
    }

    @Test
    void shouldCreateTodo() throws Exception {
        Todo newTodo = new Todo("Neues Todo", false);
        Todo savedTodo = new Todo("Neues Todo", false);
        savedTodo.setId(1L);

        when(todoRepository.save(any(Todo.class))).thenReturn(savedTodo);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Neues Todo"))
                .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void shouldToggleTodo() throws Exception {
        Todo todo = new Todo("Toggle mich", false);
        todo.setId(1L);
        Todo toggled = new Todo("Toggle mich", true);
        toggled.setId(1L);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(toggled);

        mockMvc.perform(put("/api/todos/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.done").value(true));
    }

    @Test
    void shouldUpdateTodo() throws Exception {
        Todo existing = new Todo("Alt", false);
        existing.setId(1L);
        Todo updated = new Todo("Neu", true);
        updated.setId(1L);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(todoRepository.save(any(Todo.class))).thenReturn(updated);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Neu"))
                .andExpect(jsonPath("$.done").value(true));
    }

    @Test
    void shouldDeleteTodo() throws Exception {
        Todo todo = new Todo("Löschen", false);
        todo.setId(1L);
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        doNothing().when(todoRepository).delete(todo);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnEmptyListIfNoTodosExist() throws Exception {
        when(todoRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonExistingTodo() throws Exception {
        Todo updated = new Todo("Nicht vorhanden", true);
        updated.setVersion(0L);

        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/todos/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }


    @Test
    void shouldReturnConflictWhenVersionMismatchOnUpdate() throws Exception {
        Todo existing = new Todo("Alt", false);
        existing.setId(1L);
        existing.setVersion(1L);

        Todo updated = new Todo("Neu", true);
        updated.setId(1L);
        updated.setVersion(0L); // falsche Version!

        when(todoRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(todoRepository.save(any())).thenThrow(new OptimisticLockingFailureException("Version mismatch"));

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonExistingTodo() throws Exception {
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/todos/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnNotFoundWhenTogglingNonExistingTodo() throws Exception {
        when(todoRepository.findById(123L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/todos/123/toggle"))
                .andExpect(status().isNotFound());
    }

}
