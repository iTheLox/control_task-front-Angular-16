import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Por favor completa todos los campos';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({ 
      username: this.username, 
      email: this.email, 
      password: this.password 
    }).subscribe({
      next: (response) => {
        if (response.success) this.router.navigate(['/login']);
        else this.error = response.message || 'Error al registrarse';
      },
      error: () => this.error = 'Error de conexión',
      complete: () => this.loading = false
    });
  }
}
