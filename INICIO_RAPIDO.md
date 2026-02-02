# 🚀 Inicio Rápido - Proyecto IA

## ⚡ Configuración en 3 Pasos

### 1️⃣ Instalar Dependencias

**Importante:** El proyecto es Frontend-Only. El `package.json` está solo en `/frontend`.

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install
```

### 2️⃣ Configurar URLs de APIs

Editar `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api
```

**Importante:** Asegúrate de que las APIs externas estén corriendo:
- API Personal/Empleados/Clientes: puerto 3001
- API Pausas/Turnos/Recesos: puerto 3000

### 3️⃣ Iniciar la Aplicación

**⚠️ IMPORTANTE:** Ejecutar desde la carpeta `frontend/`

```bash
# Si ya estás en frontend/
npm start

# Si estás en la raíz del proyecto
cd frontend && npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

---

## 📋 Checklist Pre-Inicio

Antes de iniciar el frontend, verificar:

- [ ] Node.js 16+ instalado (`node --version`)
- [ ] APIs externas ejecutándose (consultar `/APIS IA/`)
- [ ] Archivo `frontend/.env` configurado correctamente
- [ ] Puerto 3000 disponible para React

---

## 🔍 Solución de Problemas

### Error: "npm error code ENOENT... package.json"

**Causa:** Estás ejecutando `npm start` desde la raíz del proyecto.

**Solución:** 
```bash
cd frontend
npm start
```

### Error: "Cannot connect to API"

**Solución:** Verificar que las APIs externas estén corriendo:

```bash
# Verificar API en puerto 3000
curl http://localhost:3000/api/turnos

# Verificar API en puerto 3001
curl http://localhost:3001/api/empleados
```

### Error: "Port 3000 is already in use"

**Solución:** Usar otro puerto para React:

```bash
PORT=3001 npm start
```

O detener el proceso en el puerto 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Las APIs externas no responden

**Solución:** 
1. Verificar que los servidores de las APIs estén iniciados
2. Revisar las colecciones Postman en `/APIS IA/` para confirmar endpoints
3. Contactar a los grupos responsables de cada API

---

## 📚 Documentación Completa

Para información detallada, consultar:

- **README.md** - Documentación general del proyecto
- **REFACTORIZACION.md** - Detalles de la refactorización
- **APIS IA/** - Documentación de las APIs externas

---

## 🎯 Módulos Disponibles

Una vez iniciada la aplicación, podrás acceder a:

✅ **Personal** - Gestión de empleados
✅ **Turnos** - Configuración de horarios
✅ **Recesos** - Breaks y almuerzos
✅ **Tiempos Fuera** - Pausas y permisos
✅ **Clientes** - Gestión de clientes
✅ **Reportes** - Jornadas y pausas
✅ **Time Tracker** - Seguimiento de tiempo

---

## 📞 Contacto

Para soporte con las APIs externas:
- API Personal/Empleados: Grupo 1
- API Pausas: Grupo 2  
- API Turnos/Recesos: Grupo 3
