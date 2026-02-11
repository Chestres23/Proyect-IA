# Guia de Dockerizacion - Proyecto IA

## Requisitos

- Docker Desktop instalado y en ejecucion
- LM Studio corriendo en http://localhost:1234 (solo para chatbot)

## Ubicacion de Docker Compose

El archivo docker-compose.yml esta en:

Proyecto IA/Back Apis

## Inicio rapido

```bash
# Desde la carpeta Back Apis
cd "c:\Users\AV5\Desktop\Chris\IA\Proyecto IA\Back Apis"

docker-compose up --build
```

Para correr en segundo plano:

```bash
docker-compose up -d --build
```

## Detener servicios

```bash
docker-compose down
```

## Importar base de datos inicial

El archivo SQL esta en:
Proyecto IA/personal_postgres.sql

En PowerShell:

```powershell
Get-Content "c:\Users\AV5\Desktop\Chris\IA\Proyecto IA\personal_postgres.sql" | docker exec -i postgres-personal psql -U postgres -d personal
```

## Servicios y puertos

- Personal API: http://localhost:3001
- Firma API: http://localhost:3002
- Chatbot API: http://localhost:3005
- Recesos API: http://localhost:3006
- Turnos API: http://localhost:3007
- Pausas Visitas API: http://localhost:5173
- Pausas Activas API: http://localhost:5174
- Postgres: localhost:5432

## Variables de entorno del frontend

Archivo:
Proyect-IA/frontend/.env

Valores recomendados:

```env
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api
REACT_APP_FIRMA_API_URL=http://localhost:3002
REACT_APP_PAUSAS_VISITAS_API_URL=http://localhost:5173/api
REACT_APP_PAUSAS_ACTIVAS_API_URL=http://localhost:5174/api
REACT_APP_CHATBOT_API_URL=http://localhost:3005
REACT_APP_RECESOS_API_URL=http://localhost:3006/api
REACT_APP_TURNOS_API_URL=http://localhost:3007/api
```

## LM Studio (chatbot)

El chatbot necesita LM Studio con el servidor local activo en:
http://localhost:1234

Si LM Studio no esta activo, el chatbot no respondera.

## Ver logs

```bash
docker-compose logs -f
```

Para un servicio puntual:

```bash
docker-compose logs -f turnos-api
```

## Solucion rapida

Si un servicio no levanta, reconstruye:

```bash
docker-compose up -d --build nombre-servicio
```
