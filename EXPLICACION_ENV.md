# 📘 Guía Completa del Archivo `.env`

## 🎯 ¿Qué es el archivo `.env`?

El archivo `.env` (environment = ambiente) es un archivo de **configuración** que permite cambiar el comportamiento de tu aplicación **sin modificar código**.

### **Ventajas:**
✅ Cambiar URLs sin tocar código JavaScript  
✅ Diferentes configuraciones para desarrollo/producción  
✅ Mantener datos sensibles fuera del código (no se sube a Git)  
✅ Personalizar por desarrollador o ambiente  

---

## 📁 Ubicación y Estructura

```
Proyecto_ia/
└── frontend/
    ├── .env          ← Archivo REAL (NO se sube a Git)
    ├── .env.example  ← Plantilla documentada (SÍ se sube a Git)
    └── src/
```

### **Diferencia entre `.env` y `.env.example`:**

| Archivo | Propósito | Se sube a Git |
|---------|-----------|---------------|
| `.env` | Configuración real con tus URLs locales | ❌ NO (está en .gitignore) |
| `.env.example` | Plantilla de ejemplo para otros desarrolladores | ✅ SÍ (documentación) |

---

## 🔧 Tu Archivo `.env` Actual

### **Contenido:**

```dotenv
# ============================================================================
# URLs DE APIs POR SERVICIO
# ============================================================================

# API General (Pausas, Turnos, Recesos) - Puerto 3000
REACT_APP_API_URL=http://localhost:3000/api

# API de Personal/Empleados/Clientes - Puerto 3001
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api
```

### **Explicación línea por línea:**

```dotenv
# ← Líneas que empiezan con # son COMENTARIOS (ignoradas, solo para humanos)

REACT_APP_API_URL=http://localhost:3000/api
↑                 ↑
NOMBRE            VALOR
Variable          URL que se usa
```

---

## 🌐 Mapeo de Variables a APIs

Tu proyecto consume **5 APIs diferentes** que corren en **2 puertos**:

| API | Puerto | Variable que usa | URL Final |
|-----|--------|------------------|-----------|
| **Pausas** | 3000 | `REACT_APP_API_URL` | `http://localhost:3000/api` |
| **Turnos** | 3000 | `REACT_APP_API_URL` | `http://localhost:3000/api` |
| **Recesos** | 3000 | `REACT_APP_API_URL` | `http://localhost:3000/api` |
| **Personal/Empleados** | 3001 | `REACT_APP_PERSONAL_API_URL` | `http://localhost:3001/api` |
| **Clientes** | 3001 | `REACT_APP_PERSONAL_API_URL` | `http://localhost:3001/api` |

---

## 💻 ¿Cómo se Usan en el Código?

### **1. En `api.js` (APIs del puerto 3000):**

```javascript
// Leer variable de entorno
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
//                   ↑                               ↑
//                   Lee del .env                    Valor por defecto

// Se usa para construir URLs:
await api.get('/turnos')
// Resultado: http://localhost:3000/api/turnos
```

### **2. En `empleadoService.js` (API del puerto 3001):**

```javascript
const PERSONAL_API_URL = process.env.REACT_APP_PERSONAL_API_URL || 'http://localhost:3001/api';

await personalApi.get('/empleados')
// Resultado: http://localhost:3001/api/empleados
```

### **3. En `clienteApi.js` (API del puerto 3001):**

```javascript
const CLIENTES_API_URL = process.env.REACT_APP_PERSONAL_API_URL || 'http://localhost:3001/api';

await clientesApi.get('/clientes')
// Resultado: http://localhost:3001/api/clientes
```

---

## 🔄 Flujo Completo

```
1. React lee frontend/.env al iniciar

2. Encuentra:
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_PERSONAL_API_URL=http://localhost:3001/api

3. JavaScript puede accederlas con:
   process.env.REACT_APP_API_URL
   process.env.REACT_APP_PERSONAL_API_URL

4. Servicios construyen URLs:
   turnoService    → http://localhost:3000/api/turnos
   empleadoService → http://localhost:3001/api/empleados
   clienteApi      → http://localhost:3001/api/clientes

5. Fetch hace peticiones HTTP a esas URLs
```

---

## ⚙️ Configuración por Ambiente

### **Desarrollo Local (actual):**

```dotenv
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api
```

### **Si las APIs están en otra máquina:**

```dotenv
REACT_APP_API_URL=http://192.168.1.100:3000/api
REACT_APP_PERSONAL_API_URL=http://192.168.1.100:3001/api
```

### **Producción (ejemplo):**

```dotenv
REACT_APP_API_URL=https://api.miempresa.com/api
REACT_APP_PERSONAL_API_URL=https://personal-api.miempresa.com/api
```

---

## ⚠️ Problema que Solucionamos

### **ANTES (Incorrecto):**

```dotenv
# Solo una URL para todo
REACT_APP_API_URL=http://localhost:3000/api
```

**Resultado:**
- ✅ Pausas/Turnos/Recesos funcionaban (puerto 3000 correcto)
- ❌ Personal/Empleados/Clientes **fallaban** (intentaban conectar a puerto 3000 en vez de 3001)

### **AHORA (Correcto):**

```dotenv
# URLs separadas por puerto
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_PERSONAL_API_URL=http://localhost:3001/api
```

**Resultado:**
- ✅ Pausas/Turnos/Recesos van a puerto 3000
- ✅ Personal/Empleados/Clientes van a puerto 3001

---

## 🧪 Cómo Verificar que Funciona

### **1. Ver qué variables están configuradas:**

Añade temporalmente en cualquier componente:

```javascript
console.log('API URLs:', {
  general: process.env.REACT_APP_API_URL,
  personal: process.env.REACT_APP_PERSONAL_API_URL
});
```

**Output esperado:**
```
API URLs: {
  general: "http://localhost:3000/api",
  personal: "http://localhost:3001/api"
}
```

### **2. Probar cada API manualmente:**

```bash
# API de Turnos (puerto 3000)
curl http://localhost:3000/api/turnos

# API de Empleados (puerto 3001)
curl http://localhost:3001/api/empleados

# API de Clientes (puerto 3001)
curl http://localhost:3001/api/clientes
```

**Todos deberían responder con datos (no error).**

### **3. Ver peticiones en DevTools:**

1. Abre tu aplicación en el navegador
2. F12 → Pestaña **Network**
3. Navega a "Personal" o "Turnos"
4. Verifica que las peticiones van a los puertos correctos:
   - Turnos: `http://localhost:3000/api/turnos`
   - Personal: `http://localhost:3001/api/empleados`

---

## 🚨 Errores Comunes

### **Error 1: Variables no reconocidas**

**Síntoma:**
```javascript
console.log(process.env.REACT_APP_API_URL); // undefined
```

**Solución:**
- ✅ Reiniciar servidor React (`Ctrl+C` y `npm start`)
- ✅ Verificar que el archivo se llama exactamente `.env` (sin espacios)
- ✅ Verificar que las variables empiezan con `REACT_APP_`

### **Error 2: Cambios en .env no aplican**

**Problema:** React solo lee `.env` al **iniciar**.

**Solución:**
```bash
# Detener servidor (Ctrl+C)
npm start  # Iniciar nuevamente
```

### **Error 3: CORS al conectar a APIs**

**Síntoma:**
```
Access to fetch at 'http://localhost:3001/api/empleados' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solución:** Las APIs externas deben tener CORS habilitado. Contactar a los grupos responsables.

---

## 📋 Checklist de Configuración

Antes de ejecutar tu proyecto:

- [ ] Archivo `.env` existe en `frontend/`
- [ ] Contiene `REACT_APP_API_URL=...`
- [ ] Contiene `REACT_APP_PERSONAL_API_URL=...`
- [ ] URLs apuntan a los puertos correctos (3000 y 3001)
- [ ] APIs externas están corriendo
- [ ] Servidor React reiniciado después de editar `.env`

---

## 🎓 Conceptos Clave

### **Variables de Entorno en React:**

En React (Create React App), solo las variables que empiezan con `REACT_APP_` son accesibles:

```dotenv
# ✅ Funciona
REACT_APP_API_URL=http://localhost:3000/api

# ❌ NO funciona (React lo ignora)
API_URL=http://localhost:3000/api
```

### **Por qué se llama `.env`:**

- **Punto (`.`)** al inicio = Archivo oculto en Linux/Mac
- **env** = Abreviatura de "environment" (ambiente)

### **Seguridad:**

```gitignore
# En .gitignore
.env          ← NO se sube (puede tener passwords, URLs privadas)
.env.example  ← SÍ se sube (plantilla sin datos sensibles)
```

---

## 🔧 Comandos Útiles

```bash
# Ver contenido del .env
cat frontend/.env

# Editar .env
code frontend/.env  # En VS Code

# Copiar .env.example a .env (primera vez)
cp frontend/.env.example frontend/.env

# Verificar que Node lee las variables
npm start  # Debe mostrar las URLs en consola (si agregaste console.log)
```

---

## 📞 Soporte

Si las APIs no responden:

| API | Responsable | Puerto |
|-----|-------------|--------|
| Personal/Empleados/Clientes | Grupo 1 | 3001 |
| Pausas | Grupo 2 | 3000 |
| Turnos/Recesos | Grupo 3 | 3000 |

---

## ✅ Resumen

- **`.env`** guarda URLs de APIs que pueden cambiar
- **Comentarios** (líneas con `#`) son solo documentación
- **Dos variables principales:**
  - `REACT_APP_API_URL` → Puerto 3000 (Pausas, Turnos, Recesos)
  - `REACT_APP_PERSONAL_API_URL` → Puerto 3001 (Personal, Clientes)
- **Reiniciar** servidor React después de editar `.env`
- **Nunca** subir `.env` a Git (datos sensibles)
