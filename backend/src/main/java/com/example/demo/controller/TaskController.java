package com.example.demo.controller;

import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String boardId = payload.get("board_id");
        String statusName = payload.get("status_name");
        String icon = payload.get("icon");
        String content = payload.get("content");

        if (name == null || boardId == null || statusName == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields: name, board_id, status_name"));
        }

        long count = taskRepository.countByBoardId(boardId);

        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setBoardId(boardId);
        task.setName(name);
        task.setStatusName(statusName);
        task.setIcon(icon != null ? icon : "");
        task.setContent(content != null ? content : "");
        task.setTaskOrder((int) count);

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable String taskId, @RequestBody Map<String, String> updates) {
        return taskRepository.findById(java.util.Objects.requireNonNull(taskId))
                .map(task -> {
                    if (updates.containsKey("name")) task.setName(updates.get("name"));
                    if (updates.containsKey("content")) task.setContent(updates.get("content"));
                    if (updates.containsKey("icon")) task.setIcon(updates.get("icon"));
                    if (updates.containsKey("status_name")) task.setStatusName(updates.get("status_name"));
                    
                    Task updatedTask = taskRepository.save(java.util.Objects.requireNonNull(task));
                    return ResponseEntity.ok(updatedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        if (taskRepository.existsById(java.util.Objects.requireNonNull(taskId))) {
            taskRepository.deleteById(java.util.Objects.requireNonNull(taskId));
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
