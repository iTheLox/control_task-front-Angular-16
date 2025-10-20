import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://172.25.32.37:5000/api";

  constructor(private http: HttpClient) { }

  getTasks(userId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/tasks?owner_id=${userId}`);
  }

  getTask(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(task: CreateTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}/tasks/${id}`);
  }

  completeTask(id: number): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${id}`, { completed: true });
  }

  incompleteTask(id: number): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tasks/${id}`, { completed: false });
  }
}
