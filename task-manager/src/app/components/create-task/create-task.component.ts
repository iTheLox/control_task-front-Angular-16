import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  title: string = '';
  description: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.title.trim()) {
      this.error = 'Por favor ingresa un título para la tarea';
      return;
    }
    const user = this.authService.currentUserValue;
    if (!user || !user.id) {
      this.error = 'Usuario no identificado';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.taskService.createTask({
      title: this.title,
      description: this.description,
      owner_id: user.id
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Tarea creada exitosamente';
          setTimeout(() => this.router.navigate(['/tasks']), 1500);
        } else {
          this.error = response.message || 'Error al crear la tarea';
        }
      },
      error: () => this.error = 'Error de conexión',
      complete: () => this.loading = false
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
