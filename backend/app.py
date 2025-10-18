from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "taskuser"),
    "password": os.getenv("MYSQL_PASSWORD", "taskpass123"),
    "database": os.getenv("MYSQL_DATABASE", "task_manager"),
}

def get_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Error de conexión: {e}")
        return None

@app.route('/api/users/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            return jsonify({"success": False, "message": "Faltan campos"}), 400

        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Usuario o email ya existe"}), 400

        hashed_pw = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s)",
            (username, email, hashed_pw)
        )
        conn.commit()

        cursor.execute("SELECT id, username, email FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Usuario registrado exitosamente",
            "user": {
                "id": user[0],
                "username": user[1],
                "email": user[2]
            }
        }), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/users/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"success": False, "message": "Usuario y contraseña requeridos"}), 400

        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, hashed_password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user[3], password):
            cursor.close()
            conn.close()
            return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Login exitoso",
            "user": {
                "id": user[0],
                "username": user[1],
                "email": user[2]
            }
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        owner_id = request.args.get('owner_id')
        
        if not owner_id:
            return jsonify({"success": False, "message": "owner_id requerido"}), 400

        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, title, description, completed, owner_id, created_at, completed_at FROM tasks WHERE owner_id = %s ORDER BY created_at DESC",
            (owner_id,)
        )
        tasks = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "tasks": tasks
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description', '')
        owner_id = data.get('owner_id')

        if not title or not owner_id:
            return jsonify({"success": False, "message": "Título y owner_id requeridos"}), 400

        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO tasks (title, description, completed, owner_id) VALUES (%s, %s, FALSE, %s)",
            (title, description, owner_id)
        )
        conn.commit()
        task_id = cursor.lastrowid

        cursor.execute("SELECT id, title, description, completed, owner_id, created_at, completed_at FROM tasks WHERE id = %s", (task_id,))
        task = cursor.fetchone()
        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Tarea creada exitosamente",
            "task": {
                "id": task[0],
                "title": task[1],
                "description": task[2],
                "completed": task[3],
                "owner_id": task[4],
                "created_at": str(task[5]),
                "completed_at": str(task[6]) if task[6] else None
            }
        }), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        completed = data.get('completed')

        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor()

        if completed is not None:
            cursor.execute("UPDATE tasks SET completed = %s WHERE id = %s", (completed, task_id))
            conn.commit()

        cursor.execute("SELECT id, title, description, completed, owner_id, created_at, completed_at FROM tasks WHERE id = %s", (task_id,))
        task = cursor.fetchone()
        cursor.close()
        conn.close()

        if not task:
            return jsonify({"success": False, "message": "Tarea no encontrada"}), 404

        return jsonify({
            "success": True,
            "task": {
                "id": task[0],
                "title": task[1],
                "description": task[2],
                "completed": task[3],
                "owner_id": task[4],
                "created_at": str(task[5]),
                "completed_at": str(task[6]) if task[6] else None
            }
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        conn = get_db()
        if not conn:
            return jsonify({"success": False, "message": "Error de BD"}), 500

        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Tarea eliminada"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Backend iniciando en http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
