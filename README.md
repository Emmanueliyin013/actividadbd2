# Práctica: API REST con Node.js, Express y Supabase (PostgreSQL)

Este proyecto consiste en el diseño, implementación y despliegue de una base de datos relacional alojada en **Supabase** (PostgreSQL) con tres tablas relacionadas (`usuarios`, `productos`, `pedidos`), consumida a través de un backend en **Node.js** con **Express.js** que expone una **API REST** funcional con operaciones CRUD completas.

---

##  Stack Tecnológico

* **Backend Framework:** Node.js + Express.js (ES Modules)
* **Base de Datos Cloud:** Supabase (PostgreSQL)
* **Cliente de BD:** `@supabase/supabase-js`
* **Seguridad & Entorno:** `dotenv`
* **Cliente de Pruebas API:** Postman / Thunder Client

---

## Estructura de base de datos

El modelo de datos cuenta con **3 tablas relacionadas** mediante llaves foráneas (`1:N`), aplicando la regla de integridad referencial `ON DELETE CASCADE`.

### Detalle de las Tablas:
1. **`usuarios`**: Contiene la información básica de los usuarios registrados en el sistema.
   * `id`: BIGINT, PK, Autoincrementable.
   * `nombre`: VARCHAR(100), Requerido.
   * `email`: VARCHAR(150), Único y Requerido.
   * `creado_en`: TIMESTAMP.
2. **`productos`**: Catálogo de productos disponibles.
   * `id`: BIGINT, PK, Autoincrementable.
   * `nombre`: VARCHAR(100), Requerido.
   * `precio`: DECIMAL(10,2), Requerido.
   * `stock`: INT, Requerido.
   * `creado_en`: TIMESTAMP.
3. **`pedidos`**: Tabla relacional que vincula las compras realizadas.
   * `id`: BIGINT, PK, Autoincrementable.
   * `usuario_id`: BIGINT, FK -> `usuarios(id)`.
   * `producto_id`: BIGINT, FK -> `productos(id)`.
   * `cantidad`: INT.
   * `total`: DECIMAL(10,2).
   * `creado_en`: TIMESTAMP.


```sql
-- Tablas
CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pedidos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    total DECIMAL(10, 2) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Datos Iniciales (Seed Data)
INSERT INTO usuarios (nombre, email) VALUES
('Ana Gómez', 'ana@example.com'),
('Carlos López', 'carlos@example.com');

INSERT INTO productos (nombre, precio, stock) VALUES
('Laptop Pro 15', 1200.50, 10),
('Mouse Inalámbrico', 25.00, 50);

INSERT INTO pedidos (usuario_id, producto_id, cantidad, total) VALUES
(1, 1, 1, 1200.50),
(2, 2, 2, 50.00);
```

### 5. Inicia el Servidor
```bash
npm start
```
El servidor estará corriendo en: `http://localhost:3000`

---

## Documentación de Endpoints de la API

| Verbo | Ruta | Descripción | Código Éxito |
| :--- | :--- | :--- | :--- |
| **GET** | `/pedidos` | Obtiene la lista completa de pedidos con datos del usuario y producto | `200 OK` |
| **GET** | `/pedidos/:id` | Obtiene el detalle de un pedido específico por ID | `200 OK` / `404 Not Found` |
| **POST** | `/pedidos` | Crea un nuevo pedido registrando sus relaciones | `201 Created` / `400 Bad Request` |
| **PUT** | `/pedidos/:id` | Actualiza la cantidad o total de un pedido existente | `200 OK` / `404 Not Found` |
| **DELETE**| `/pedidos/:id` | Elimina un pedido garantizando integridad referencial | `200 OK` / `404 Not Found` |

### Ejemplos de Peticiones JSON

#### **POST /pedidos**
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "usuario_id": 1,
  "producto_id": 2,
  "cantidad": 3,
  "total": 75.00
}
```

#### **PUT /pedidos/1**
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "cantidad": 5,
  "total": 125.00
}
```

---



## Autor: Emmanuel Sanchez Peralta
* **Materia:** Bases de Datos en la Nube
