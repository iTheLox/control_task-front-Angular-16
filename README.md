# 🚀 Task Manager - Aplicación Full-Stack de Gestión de Tareas

## 📋 Resumen del Proyecto

**Task Manager** es una aplicación web de gestión de tareas construida con una arquitectura *Full-Stack* y desplegada completamente mediante **Docker Compose**. Permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas personales a través de una interfaz moderna y responsiva.

| Estado | Desarrollador | Fecha | Licencia |
| :--- | :--- | :--- | :--- |
| **Implementado y Operativo** | Michael Q. | Octubre 2025 | MIT |

## 💡 Stack Tecnológico

El proyecto se basa en una arquitectura de tres capas containerizadas:

| Componente | Tecnología | Versión | Rol |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Angular** | 16 | Interfaz de Usuario, SPA, Rutas Protegidas |
| **Backend** | **Python (Flask)** | 3.12 | API RESTful, Lógica de Negocio, Autenticación |
| **Base de Datos** | **MariaDB (MySQL)** | 10.11 | Almacenamiento Relacional de Tareas y Usuarios |
| **Infraestructura**| **Docker Compose** | Latest | Containerización, Orquestación de Servicios |

## 🏗️ Arquitectura de Despliegue

La aplicación se ejecuta como un sistema de tres servicios aislados conectados a través de una red interna de Docker:

[Usuario: Navegador] --(HTTP/localhost:4200)--> [Frontend: Angular 16] [Frontend] --(HTTP/JSON API)--> [Backend: Flask Python] [Backend] --(SQL)--> [DB: MariaDB]


## ✨ Funcionalidades Clave

* **Autenticación Segura:** Registro, Login y Logout con *hashing* de contraseñas (`Werkzeug`).
* **Gestión de Tareas (CRUD):** Creación, visualización, edición (cambio de estado) y eliminación de tareas.
* **Seguridad:** Implementación de **Guards de Rutas** en Angular para proteger la navegación privada.
* **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

## ⚙️ Configuración y Ejecución (Docker)

El proyecto está diseñado para ser levantado con un solo comando en cualquier entorno con Docker y Docker Compose instalados.

### Prerrequisitos

* [Docker](https://www.docker.com/get-started/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Pasos de Despliegue

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/iTheLox/control_task-front-Angular-16.git](https://github.com/iTheLox/control_task-front-Angular-16.git)
    cd control_task-front-Angular-16
    ```

2.  **Configurar Variables de Entorno:**
    Asegúrate de tener un archivo `.env` en la carpeta **`backend/`** con las credenciales de la base de datos (estas deben coincidir con las definidas en el `docker-compose.yml`):
    ```env
    # backend/.env
    MYSQL_USER=taskuser
    MYSQL_PASSWORD=taskpass123
    MYSQL_DATABASE=task_manager
    ```

3.  **Construir y Levantar los Contenedores:**
    Utiliza Docker Compose para construir las imágenes y levantar los tres servicios (`db`, `backend`, `frontend`) en modo *detached* (segundo plano).
    ```bash
    docker-compose up --build -d
    ```

4.  **Acceder a la Aplicación:**
    Una vez que los contenedores estén operativos, accede a la aplicación a través de tu navegador:

    | Componente | URL de Acceso | Puerto |
    | :--- | :--- | :--- |
    | **Frontend** (App) | `http://localhost:4200` | 4200 |
    | **Backend** (API) | `http://localhost:5000` | 5000 |
    | **DB** | `localhost:3306` | 3306 |

---

## 🛠️ ENDPOINTS API REST (Backend Flask)

| Método | Ruta | Descripción | Parámetros (Body) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Registrar nuevo usuario. | `username`, `email`, `password` |
| `POST` | `/api/users/login` | Iniciar sesión y obtener token/sesión. | `username`, `password` |
| `GET` | `/api/tasks` | Obtener todas las tareas del usuario autenticado. | *Ninguno* |
| `POST` | `/api/tasks` | Crear una nueva tarea. | `title`, `description`, `owner_id` |
| `PUT` | `/api/tasks/<id>` | Actualizar una tarea específica. | `title`, `description`, `completed` |
| `DELETE` | `/api/tasks/<id>` | Eliminar una tarea específica. | *Ninguno* |

---

## 👨‍💻 Contribuciones

Si deseas contribuir o reportar *bugs*, por favor abre un *Issue* o envía un *Pull Request* al repositorio.
