# Backend (Spring Boot)

This is the Spring Boot implementation of the Task Board backend.

## Prerequisites

- Java 21
- Maven
- PostgreSQL

## Configuration

Update `src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskboard
spring.datasource.username=taskuser
spring.datasource.password=your_password
```

## Running the Application

To build and run the application:

```bash
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:3001/api`.

## API Endpoints

- `GET /api/boards/{boardId}` - Get board details and tasks
- `POST /api/boards` - Create a new board
- `PUT /api/boards/{boardId}` - Update board details
- `DELETE /api/boards/{boardId}` - Delete a board
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{taskId}` - Update a task
- `DELETE /api/tasks/{taskId}` - Delete a task
