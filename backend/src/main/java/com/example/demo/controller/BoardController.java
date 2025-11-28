package com.example.demo.controller;

import com.example.demo.entity.Board;
import com.example.demo.entity.Task;
import com.example.demo.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    @GetMapping("/{boardId}")
    public ResponseEntity<?> getBoard(@PathVariable String boardId) {
        return boardRepository.findById(java.util.Objects.requireNonNull(boardId))
                .map(board -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("board", board);
                    response.put("tasks", board.getTasks());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Board> createBoard() {
        String boardId = UUID.randomUUID().toString();
        Board board = new Board();
        board.setId(boardId);
        board.setName("My Task Board");
        board.setDescription("Tasks to keep organised");

        List<Task> defaultTasks = new ArrayList<>();
        defaultTasks.add(createTask(boardId, "Task in Progress", "in-progress", "⏰", "This is a task in progress.", 0));
        defaultTasks.add(createTask(boardId, "Task Completed", "completed", "🏋️‍♂️", "This is a completed task.", 1));
        defaultTasks.add(createTask(boardId, "Task Won't Do", "wont-do", "☕", "This is a task that won't be done.", 2));
        defaultTasks.add(createTask(boardId, "Task To Do", "to-do", "📚", "Work on a Challenge on devChallenges.io, learn TypeScript.", 3));

        board.setTasks(defaultTasks);
        
        for(Task t : defaultTasks) {
            t.setBoard(board);
        }

        Board savedBoard = boardRepository.save(board);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBoard);
    }

    private Task createTask(String boardId, String name, String statusName, String icon, String content, int order) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setBoardId(boardId);
        task.setName(name);
        task.setStatusName(statusName);
        task.setIcon(icon);
        task.setContent(content);
        task.setTaskOrder(order);
        return task;
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateBoard(@PathVariable String boardId, @RequestBody Map<String, String> updates) {
        return boardRepository.findById(java.util.Objects.requireNonNull(boardId))
                .map(board -> {
                    if (updates.containsKey("name")) board.setName(updates.get("name"));
                    if (updates.containsKey("description")) board.setDescription(updates.get("description"));
                    boardRepository.save(java.util.Objects.requireNonNull(board));
                    return ResponseEntity.ok(Map.of("message", "Board updated"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable String boardId) {
        if (boardRepository.existsById(java.util.Objects.requireNonNull(boardId))) {
            boardRepository.deleteById(java.util.Objects.requireNonNull(boardId));
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
