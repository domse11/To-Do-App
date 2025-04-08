package com.domse11.todoapp;
import jakarta.persistence.*;

@Entity
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private boolean done;

    @Version
    private Long version;

    public Todo() {}

    public Todo(String title, boolean done) {
        this.title = title;
        this.done = done;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isDone() {
        return done;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
