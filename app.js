const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db-config');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/productos', (req, res) => {
  const { nombre, cantidad, precio, descripcion, imagen_url } = req.body;
  const sql = 'INSERT INTO productos (nombre, cantidad, precio, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, cantidad, precio, descripcion, imagen_url], (err, result) => {
    if (err) return res.status(400).json({ error: 'Error al agregar el producto.' });
    res.status(201).json({ id: result.insertId, nombre, cantidad, precio, descripcion, imagen_url });
  });
});

app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos.' });
    res.json(results);
  });
});


app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, precio, descripcion, imagen_url } = req.body;
  const sql = 'UPDATE productos SET nombre = ?, cantidad = ?, precio = ?, descripcion = ?, imagen_url = ? WHERE id = ?';
  db.query(sql, [nombre, cantidad, precio, descripcion, imagen_url, id], (err) => {
    if (err) return res.status(400).json({ error: 'Error al actualizar el producto.' });
    res.json({ mensaje: 'Producto actualizado.' });
  });
});

app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
    if (err) return res.status(400).json({ error: 'Error al eliminar el producto.' });
    res.json({ mensaje: 'Producto eliminado.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
