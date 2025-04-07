# 🛒 Panel de Administración para E-commerce

Este proyecto es una **página web de administración** para un e-commerce, diseñada para permitir al administrador gestionar productos directamente desde el navegador.

## 🔐 Autenticación y permisos

- Usa **Firebase Authentication** para iniciar sesión con:
  - Google
  - Email/contraseña
- Solo los **usuarios autenticados con rol de administrador** pueden:
  - Añadir productos
  - Editar productos existentes
  - Eliminar productos del catálogo

## ☁️ Base de datos

- Se conecta a **Firestore** (Firebase) desde JavaScript puro.
- Permite leer y escribir datos en tiempo real.
- Cada producto contiene:
  - Imagen
  - Descripción corta y larga
  - Categoría
  - Enlace externo
  - ID
  - Precio

## ✨ Características

- Autenticación y control de permisos
- Añadir, editar y eliminar productos visualmente
- Filtro dinámico de productos por descripción, categoría o ID
- Validación de datos antes de subir
- Imágenes por defecto si no se carga una

## 🧠 Tecnologías usadas

- HTML + CSS
- JavaScript
- Firebase Authentication
- Firestore Database


## 🚀 Cómo iniciar

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/yasi6969/Administrar-Productos-De-Base-de-datos.git
   cd Administrar-Productos-De-Base-de-datos
2. **Instala las dependencias:**

   ```bash
   npm install

3. **Configura Firebase:**

   - Crea un archivo llamado `firebaseConfig.js` en tu carpeta `scripts/`.

Añade tu configuración de Firebase:


```js
// scripts/firebaseConfig.js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
```

4. **Habilita Firebase:**

   - En tu consola de Firebase, activa:

   - Authentication (Google y Email/Password)
   - Cloud Firestore

5. **Inicia el servidor local:**

   ```bash
   npm run start
   ```

6. **Abre el navegador en:**

   ```
   http://localhost:3000
   ```

7. **Haz login como administrador para acceder al panel.**

📌 Notas

- La estructura de los productos debe coincidir con la de Firestore.

- El buscador filtra por descripción, categoría e ID directamente en el DOM.


## 🧑‍💻 Autor
Desarrollado por Santiago Cardona

