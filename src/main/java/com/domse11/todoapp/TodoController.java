package com.domse11.todoapp;

import org.hibernate.StaleObjectStateException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Port 3000 wo mein React läuft
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository repo;

    public TodoController(TodoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Todo> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return repo.save(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Todo todo) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setTitle(todo.getTitle());
                    existing.setDone(todo.isDone());
                    existing.setVersion(todo.getVersion());
                    try {
                        Todo updated = repo.save(existing);
                        return ResponseEntity.ok(updated);
                    } catch (OptimisticLockingFailureException | StaleObjectStateException e) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Konflikt: Todo wurde zwischenzeitlich verändert.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setDone(!existing.isDone());
                    existing.setVersion(todo.getVersion());
                    try {
                        Todo updated = repo.save(existing);
                        return ResponseEntity.ok(updated);
                    } catch (OptimisticLockingFailureException | StaleObjectStateException e) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Konflikt: Todo wurde zwischenzeitlich verändert.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        return repo.findById(id)
                .map(todo -> {
                    try {
                        repo.delete(todo);
                        return ResponseEntity.noContent().build();
                    } catch (OptimisticLockingFailureException | StaleObjectStateException e) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Konflikt: Todo wurde zwischenzeitlich verändert.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
