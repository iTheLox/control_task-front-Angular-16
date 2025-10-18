#!/bin/bash

echo "🐳 Task Manager - Docker Commands"
echo "=================================="
echo ""
echo "Comandos disponibles:"
echo ""
echo "1. INICIAR TODO"
echo "   ./docker-commands.sh up"
echo ""
echo "2. DETENER TODO"
echo "   ./docker-commands.sh down"
echo ""
echo "3. VER LOGS"
echo "   ./docker-commands.sh logs"
echo ""
echo "4. RECONSTRUIR IMÁGENES"
echo "   ./docker-commands.sh build"
echo ""
echo "5. ESTADO DE CONTENEDORES"
echo "   ./docker-commands.sh ps"
echo ""
echo "6. LIMPIAR TODO (CUIDADO: Borra datos)"
echo "   ./docker-commands.sh clean"
echo ""

case "$1" in
  up)
    echo "🚀 Levantando servicios..."
    docker-compose up -d
    echo "✅ Servicios levantados"
    echo "Frontend: http://localhost:4200"
    echo "Backend: http://localhost:5000"
    echo "MySQL: localhost:3306"
    ;;
  down)
    echo "⛔ Deteniendo servicios..."
    docker-compose down
    echo "✅ Servicios detenidos"
    ;;
  logs)
    docker-compose logs -f
    ;;
  build)
    echo "🔨 Reconstruyendo imágenes..."
    docker-compose build --no-cache
    echo "✅ Imágenes reconstruidas"
    ;;
  ps)
    docker-compose ps
    ;;
  clean)
    echo "⚠️  ADVERTENCIA: Se eliminarán todos los datos"
    read -p "¿Continuar? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
      docker-compose down -v
      echo "✅ Limpieza completa"
    fi
    ;;
  *)
    echo "Uso: ./docker-commands.sh {up|down|logs|build|ps|clean}"
    ;;
esac
