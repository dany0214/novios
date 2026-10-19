const fs = require('fs');
const path = require('path');
const db = require('./db');

const rutas = [
  path.join(__dirname, 'data.json'),
  path.join(__dirname, 'novios', 'data.json'),
];
const ruta = rutas.find((r) => fs.existsSync(r));

(async () => {
  try {
    if (!ruta) {
      console.log('No se encontró data.json, nada que migrar');
      return;
    }

    const planes = JSON.parse(fs.readFileSync(ruta, 'utf8'));

    for (const { id, titulo, descripcion, categoria, ...resto } of planes) {
      await db.query(
        'INSERT INTO planes (titulo, descripcion, categoria, extra) VALUES (?, ?, ?, ?)',
        [titulo ?? 'Sin título', descripcion ?? '', categoria ?? '', JSON.stringify(resto)]
      );
    }

    console.log(`Migrados ${planes.length} planes desde ${ruta}`);
  } catch (err) {
    console.error('Error al migrar:', err.message);
  } finally {
    await db.end();
  }
})();