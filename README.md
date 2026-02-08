# Proyecto IA - Sistema Frontend para Gestion de Personal

## 📋 Descripción

**Sistema completamente refactorizado a Frontend-Only** para la gestion de empleados, turnos, recesos, pausas y firmas.

Este proyecto consume **APIs externas** desarrolladas por otros grupos. No tiene backend propio ni base de datos local.
Incluye un **gate de verificación facial** antes de entrar y un **chatbot** flotante de soporte en toda la app.

## ⚠️ Arquitectura: Frontend-Only

```
┌─────────────────────────┐
│   TU APLICACIÓN         │
│   (Frontend React)      │
└────────┬────────────────┘
         │ HTTP (fetch)
         ↓
┌──────────────────────────────────────┐
│  APIs EXTERNAS (Otros Grupos)        │
├──────────────────────────────────────┤
│ • API Empleados    (puerto 3001)     │
│ • API Pausas       (puerto 3000)     │
│ • API Turnos       (puerto 3000)     │
│ • API Recesos      (puerto 3000)     │
│ • API Clientes     (puerto 3001)     │
│ • API Firma        (puerto 3001)     │
│ • API ChatBot      (puerto 3005)     │
└──────────────────────────────────────┘
```

## 🌐 APIs Externas Consumidas

| API | Puerto | Base URL | Documentacion |
|-----|--------|----------|---|
| **Empleados** | 3001 | `http://localhost:3001/api/empleados` | Documentacion del equipo de Personal |
| **Clientes** | 3001 | `http://localhost:3001/api/clientes` | Documentacion del equipo de Personal |
| **Firma** | 3001 | `http://localhost:3001/api/firmas` | Swagger del equipo de Firma |
| **Pausas** | 3000 | `http://localhost:3000/api/pausas` | Postman del equipo de Pausas |
| **Turnos** | 3000 | `http://localhost:3000/api/turnos` | Postman del equipo de Turnos |
| **Recesos** | 3000 | `http://localhost:3000/api/breaks` | Postman del equipo de Recesos |
| **ChatBot** | 3005 | `http://localhost:3005/api/chat` | Postman del equipo de ChatBot |

## 🚀 Tecnologías

- **React 18.2.0** - Framework UI
- **React Scripts 5.0.1** - Build y desarrollo
- **Fetch API** - Cliente HTTP nativo (sin axios)
- **CSS3** - Estilos
- **Arquitectura de Servicios** - Capa centralizada de APIs

## 📁 Estructura del Proyecto

```
Proyect-IA/
├── frontend/                          # ✅ APLICACION PRINCIPAL
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   │   ├── Personal.js           # ✅ CRUD empleados
│   │   │   ├── Turnos.js             # ✅ Gestion turnos
│   │   │   ├── Recesos.js            # ✅ Gestion recesos
│   │   │   ├── TiemposFuera.js       # ✅ Gestion pausas
│   │   │   ├── Clientes.js           # ✅ CRUD clientes
│   │   │   ├── FaceGate.js           # ✅ Verificacion facial + Firma
│   │   │   ├── ChatBotWidget.js      # ✅ Chatbot flotante
│   │   │   ├── ReporteJornada.js     # Reportes
│   │   │   ├── ReportePausas.js      # Reportes
│   │   │   ├── TimeTracker.js        # Seguimiento tiempo
│   │   │   ├── Chronometer.js        # Cronometro
│   │   │   ├── Signature.js          # Firma digital
│   │   │   ├── Modal.js              # Componente modal reutilizable
│   │   │   ├── Navbar.js             # Navegacion
│   │   │   ├── PageContainer.js      # Contenedor de pagina
│   │   │   ├── CompanyData.js        # Datos empresa
│   │   │   └── Welcome.js            # Pantalla bienvenida
│   │   │
│   │   ├── services/                 # ⭐ CAPA DE SERVICIOS
│   │   │   ├── api.js                # ✅ Cliente HTTP base (fetch)
│   │   │   ├── empleadoService.js    # ✅ Servicio API Empleados
│   │   │   ├── pausaService.js       # ✅ Servicio API Pausas
│   │   │   ├── turnoService.js       # ✅ Servicio API Turnos
│   │   │   ├── recesoService.js      # ✅ Servicio API Recesos
│   │   │   ├── clienteApi.js         # ✅ Servicio API Clientes
│   │   │   ├── firmaService.js       # ✅ Servicio API Firma
│   │   │   └── chatbotService.js     # ✅ Servicio API ChatBot
│   │   │
│   │   ├── App.js                    # Aplicacion principal
│   │   ├── App.css                   # Estilos globales
│   │   ├── index.js                  # Punto de entrada
│   │   ├── index.css                 # Estilos base
│   │
│   ├── .env                          # ⭐ CONFIGURACION (URL de API)
│   ├── .env.example                  # Ejemplo de .env
│   ├── package.json
│   └── .gitignore
│
├── INICIO_RAPIDO.md                  # Guia de inicio rapido
├── EXPLICACION_ENV.md                # Guia de variables de entorno
├── README.md                         # Este archivo
```

## ⚙️ Configuración

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar URLs de APIs

**Archivo: `frontend/.env`**

```env
# API General (Pausas, Turnos, Recesos)
REACT_APP_API_URL=http://localhost:3000/api

# API Personal (Empleados/Clientes)
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api

# API Firma
REACT_APP_FIRMA_API_URL=http://localhost:3001

# API ChatBot
REACT_APP_CHATBOT_API_URL=http://localhost:3005
```

Estas URLs se usan como base para cada servicio. Ajusta según donde corran tus APIs.

### 3. Iniciar Aplicación

```bash
npm start
```

Se abrirá en `http://localhost:3000`

## 🔧 Capa de Servicios

Toda la comunicación con APIs externas pasa por la capa de servicios:

### Estructura de un Servicio

```javascript
// Patrón: services/miService.js

import api from './api';

const miService = {
  async listar() {
    const response = await api.get('/endpoint');
    return response.data || [];
  },
  
  async obtener(id) {
    const response = await api.get(`/endpoint/${id}`);
    return response.data;
  },
  
  async crear(data) {
    const response = await api.post('/endpoint', data);
    return response.data;
  },
  
  async actualizar(id, data) {
    const response = await api.put(`/endpoint/${id}`, data);
    return response.data;
  },
  
  async eliminar(id) {
    await api.delete(`/endpoint/${id}`);
  }
};

export default miService;
```

### Cliente HTTP Base: `api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = {
  get: (endpoint) => fetch(API_BASE_URL + endpoint),
  post: (endpoint, data) => fetch(API_BASE_URL + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => fetch(API_BASE_URL + endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetch(API_BASE_URL + endpoint, {
    method: 'DELETE'
  })
};

export default api;
```

### Servicios Disponibles

#### `empleadoService.js`
- `listar()` - Obtener todos los empleados
- `obtener(ci)` - Obtener por cédula
- `crear(data)` - Crear empleado
- `actualizar(ci, data)` - Actualizar empleado
- `eliminar(ci)` - Eliminar empleado

#### `turnoService.js`
- `listar()` - Obtener todos los turnos
- `obtener(id)` - Obtener por ID
- `crear(data)` - Crear turno
- `actualizar(id, data)` - Actualizar turno
- `eliminar(id)` - Eliminar turno

#### `recesoService.js`
- `listar()` - Obtener todos los recesos
- `obtener(id)` - Obtener por ID
- `crear(data)` - Crear receso
- `actualizar(id, data)` - Actualizar receso
- `eliminar(id)` - Eliminar receso
- `obtenerPorTurno(idTurno)` - Filtrar por turno

#### `pausaService.js`
- `listarEmpleados()` - Obtener empleados
- `registrarVisita(data)` - Pausa individual
- `registrarActivas(data)` - Pausas grupales
- `actualizar(id, data)` - Actualizar pausa

#### `clienteApi.js`
- `listar()` - Obtener todos los clientes
- `obtener(id)` - Obtener por ID
- `crear(data)` - Crear cliente
- `actualizar(id, data)` - Actualizar cliente
- `eliminar(id)` - Eliminar cliente
- `buscar(termino)` - Buscar clientes

#### `firmaService.js`
- `validarEmpleado(ci)` - Validar empleado por CI
- `registrar(ci)` - Registrar evento de firma del día
- `obtener(ci, fecha)` - Consultar firma por CI y fecha

#### `chatbotService.js`
- `chat(message)` - Enviar mensaje al chatbot

## 📡 Endpoints de APIs Externas

### API de Empleados (Puerto 3001)

```
GET    /api/empleados              → Listar todos
GET    /api/empleados/:ci          → Obtener por cédula
POST   /api/empleados              → Crear
PUT    /api/empleados/:ci          → Actualizar
DELETE /api/empleados/:ci          → Eliminar
```

### API de Turnos (Puerto 3000)

```
GET    /api/turnos                 → Listar todos
GET    /api/turnos/:id             → Obtener por ID
POST   /api/turnos                 → Crear
PUT    /api/turnos/:id             → Actualizar
DELETE /api/turnos/:id             → Eliminar
```

### API de Recesos (Puerto 3000)

```
GET    /api/breaks                 → Listar todos
GET    /api/breaks/:id             → Obtener por ID
POST   /api/breaks                 → Crear
PUT    /api/breaks/:id             → Actualizar
DELETE /api/breaks/:id             → Eliminar
```

### API de Pausas (Puerto 3000)

```
GET    /api/empleados              → Listar empleados disponibles
POST   /api/pausas/visita          → Pausa individual
POST   /api/pausas/activas         → Pausas grupales
PUT    /api/pausas/:id             → Actualizar
```

### API de Clientes (Puerto 3001)

```
GET    /api/clientes               → Listar todos
GET    /api/clientes/:id           → Obtener por ID
POST   /api/clientes               → Crear
PUT    /api/clientes/:id           → Actualizar
DELETE /api/clientes/:id           → Eliminar
GET    /api/clientes/buscar?...    → Buscar
```

### API de Firma (Puerto 3001)

```
POST   /api/firmas/registrar       → Registrar evento del día
POST   /api/firmas/cargar-ausentes → Auto completar ausentes
GET    /api/firmas/:ci             → Consultar firma (fecha opcional)
GET    /api/empleados/:ci          → Validar empleado
```

### API de ChatBot (Puerto 3005)

```
POST   /api/chat                   → Respuesta de asistente
```

## 🎯 Flujo de Datos en Componentes

```
┌─────────────────────┐
│ Componente React    │
│  (Turnos.js)        │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────┐
│ Service (turnoService.js)   │
│ await turnoService.listar() │
└──────────┬──────────────────┘
           │
           ↓
┌──────────────────────────┐
│ api.js (fetch base)      │
│ await api.get('/turnos') │
└──────────┬───────────────┘
           │
           ↓
┌───────────────────────────────┐
│ HTTP GET Request              │
│ http://localhost:3000/api/... │
└───────────────────────────────┘
```

## 💡 Ejemplo de Uso en un Componente

```javascript
import React, { useState, useEffect } from 'react';
import turnoService from '../services/turnoService';

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    cargarTurnos();
  }, []);
  
  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await turnoService.listar();
      setTurnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCrear = async (formData) => {
    try {
      await turnoService.crear(formData);
      await cargarTurnos();
      alert('Turno creado');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Turnos</h2>
      {turnos.map(turno => (
        <div key={turno.id_t}>{turno.nombre_t}</div>
      ))}
    </div>
  );
}

export default Turnos;
```

## 🎨 Componentes Principales
### **FaceGate** - Verificación Facial + Firma
- ✅ Bloquea el acceso hasta detectar rostro
- ✅ Panel de firma y validación
- ✅ Registro de firma con API externa

### **ChatBot** - Asistente Flotante
- ✅ Visible en toda la app (excepto FaceGate)
- ✅ Respuesta en tiempo real vía API
- ✅ Botón flotante con icono
### **Personal** - Gestión de Empleados
- ✅ Listar empleados
- ✅ Búsqueda en tiempo real
- ✅ Crear empleado
- ✅ Actualizar empleado
- ✅ Eliminar empleado
- ✅ Validación de campos

### **Turnos** - Gestión de Horarios
- ✅ Listar turnos
- ✅ Crear turno
- ✅ Actualizar turno
- ✅ Cálculo automático de horas
- ✅ Tipos: NORMAL, ESPECIAL, NOCTURNO

### **Recesos** - Breaks y Almuerzos
- ✅ Listar recesos
- ✅ Crear receso
- ✅ Asociar a turnos
- ✅ Tipos: BREAK, ALMUERZO
- ✅ Actualizar recesos

### **TiemposFuera** - Pausas y Permisos
- ✅ Registro de pausas individuales
- ✅ Registro de pausas grupales
- ✅ Selección múltiple de empleados
- ✅ Tipos: PERMISO, REUNION, CAPACITACION, VISITA, OTRO
- ✅ Formulario con validaciones

### **Clientes** - CRUD de Clientes
- ✅ Listar clientes
- ✅ Crear cliente
- ✅ Actualizar cliente
- ✅ Eliminar cliente
- ✅ Buscar clientes
- ✅ Campos extendidos (empresa, dirección, etc.)

## 🔍 Solución de Problemas

### Error: "Cannot GET /api/empleados"
```
✓ Verificar que la API externa esté corriendo en puerto 3001
✓ Probar manualmente: curl http://localhost:3001/api/empleados
✓ Revisar que REACT_APP_API_URL sea correcto en .env
```

### Error: "Failed to fetch"
```
✓ Verificar conexión a Internet/red
✓ Confirmar IP del servidor API es accesible
✓ Revisar puertos en uso: netstat -ano | findstr :3000
✓ Revisar CORS en API externa
```
### Error: "No se pudo iniciar la camara"
```
✓ Verificar permisos de cámara del navegador
✓ En producción usar HTTPS (la cámara no funciona en HTTP)
✓ Probar en localhost primero
```

### Error: "Error en el chat"
```
✓ Verificar que la API ChatBot esté corriendo
✓ Confirmar REACT_APP_CHATBOT_API_URL en .env
```

### El puerto 3000 ya está en uso
```bash
# Liberar puerto en Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm start
```

### Componente no carga datos
```javascript
// Revisar:
1. useEffect está siendo ejecutado
2. Servicio retorna datos correctamente
3. setData() actualiza estado
4. Rendering condicional maneja loading/error

// Debuggear con:
console.log('Datos:', data);
console.error('Error:', error);
```

## 📚 Documentación de APIs Externas

La documentación (Postman o Swagger) debe ser provista por cada grupo dueño de su API.
Importa las colecciones en Postman o abre Swagger para probar los endpoints.

## 🚀 Próximos Pasos

1. **Levantar APIs externas** en los puertos correctos
2. **Configurar `.env`** con URL correcta
3. **Ejecutar**: `npm start` en la carpeta frontend
4. **Probar funcionalidad** de cada módulo
5. **Contactar grupos** responsables si hay errores

## 📞 Contacto y Soporte

**Responsables de cada API:**
- API Personal/Empleados/Clientes: Grupo 1
- API Pausas: Grupo 2
- API Turnos/Recesos: Grupo 3

## 📅 Información del Proyecto

- **Versión**: 2.0.0
- **Tipo**: Frontend-Only
- **Fecha Refactorización**: 2 de Febrero 2026
- **Estado**: ✅ Producción Ready
- **Última Actualización**: 8 de Febrero 2026
