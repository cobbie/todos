import { Component, OnInit } from '@angular/core';

import { Todo } from '../shared/todo.model';
import { TodosService } from '../shared/todos.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodosService]
})
export class TodoComponent implements OnInit {
  todos: Todo[];
  selectedTodo: Todo;
  today = new Date();
  date = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate();

  constructor(private todosService: TodosService) { }

  ngOnInit() {
    this.getTodos();
  }

  getTodos(): void {
    this.todosService.getTodos().then(todos => this.todos = todos);
  }

  isInProgress(todo: Todo): void {
    if (todo.state == 'todo') {
      todo.state = 'inProgress';
    }
    this.todosService.update(todo, todo.id);
  }
  isDone(todo: Todo): void {
    todo.state = 'done';
    this.checkDate(todo);
    this.todosService.update(todo, todo.id);
  }

  checkDate(todo: Todo): void {
    if (new Date(todo.completeBy).getTime() < new Date(this.date).getTime()) {
      todo.completed = 'tooLate';
    } else if (new Date(todo.completeBy).getTime() > new Date(this.date).getTime()) {
      todo.completed = 'success';
    } else {
      todo.completed = 'onTime';
    }
  }

delete(todo: Todo, id: number): void {
  this.todosService
      .delete(todo,id)
      .then(() => {
        this.todos = this.todos.filter(t => t !== todo);
        if (this.selectedTodo === todo) { this.selectedTodo = null; }
      });
}

}
