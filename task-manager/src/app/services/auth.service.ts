import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials)
        .subscribe(
          response => {
            if (response.success && response.user) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              if (response.token) {
                localStorage.setItem('authToken', response.token);
              }
              this.currentUserSubject.next(response.user);
            }
            observer.next(response);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
