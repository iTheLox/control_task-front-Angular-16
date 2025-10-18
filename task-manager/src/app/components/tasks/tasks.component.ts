import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const user = this.authService.currentUserValue;
    if (!user || !user.id) {
      this.error = 'Usuario no identificado';
      return;
    }
    this.taskService.getTasks(user.id).subscribe({
      next: (response) => {
        if (response.success && response.tasks) this.tasks = response.tasks;
        else this.error = response.message || 'Error al cargar tareas';
      },
      error: () => this.error = 'Error de conexión',
      complete: () => this.loading = false
    });
  }

  toggleTask(task: Task): void {
    if (!task.id) return;
    const completed = !task.completed;
    this.taskService.updateTask(task.id, { completed }).subscribe({
      next: (response) => {
        if (response.success) task.completed = completed;
      }
    });
  }

  deleteTask(id: number | undefined): void {
    if (!id || !confirm('¿Eliminar esta tarea?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        if (response.success) this.tasks = this.tasks.filter(t => t.id !== id);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreate(): void {
    this.router.navigate(['/tasks/create']);
  }
}
