import express from 'express';
import { supabase } from './supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON en el cuerpo de las peticiones
app.use(express.json());


// 1. READ (GET) - Obtener todos los pedidos con datos relacionados
app.get('/pedidos', async (req, res) => {
  try {
    // La sintaxis de Supabase nos permite traer los datos del pedido juntando Usuarios y Productos
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, usuarios(nombre, email), productos(nombre, precio)');

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. READ (GET BY ID) - Obtener un pedido específico por ID
app.get('/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pedidos')
      .select('*, usuarios(nombre, email), productos(nombre, precio)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. CREATE (POST) - Insertar un nuevo pedido
app.post('/pedidos', async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad, total } = req.body;

    // Validar campos obligatorios
    if (!usuario_id || !producto_id || !cantidad || !total) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const { data, error } = await supabase
      .from('pedidos')
      .insert([{ usuario_id, producto_id, cantidad, total }])
      .select();

    if (error) throw error;

    return res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: data[0]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE (PUT) - Actualizar un pedido existente
app.put('/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, total } = req.body;

    const { data, error } = await supabase
      .from('pedidos')
      .update({ cantidad, total })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado para actualizar' });
    }

    return res.status(200).json({
      mensaje: 'Pedido actualizado correctamente',
      pedido: data[0]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// 5. DELETE - Eliminar un pedido por ID
app.delete('/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado para eliminar' });
    }

    return res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});