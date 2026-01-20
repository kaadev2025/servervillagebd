// No usar dotenv en producción; confiar en `process.env` provisto por Vercel.
// Buscar varios nombres comunes de variable por compatibilidad.
const POSSIBLE_KEYS = ['API_KEY', 'APIKEY', 'VERCEL_API_KEY', 'NEXT_PUBLIC_API_KEY'];
const serverKey = POSSIBLE_KEYS.map(k => process.env[k]).find(v => v && v.length > 0);

module.exports = function (req, res, next) {
  // Si no hay clave configurada en el entorno, no provocar 500 en producción.
  // En su lugar, permitir la petición y emitir una advertencia para que el deploy
  // sea corregido (más seguro: definir `API_KEY` en Vercel).
  if (!serverKey) {
    console.warn('auth: ninguna API key del servidor configurada. Requests serán permitidos hasta configurar API_KEY.');
    return next();
  }

  const apiKeyHeader = req.headers['x-api-key'] || req.headers['authorization'];

  if (!apiKeyHeader) {
    return res.status(401).json({ message: 'No autorizado: falta la clave de acceso' });
  }

  // Soporta `x-api-key: <KEY>` o `Authorization: Bearer <KEY>`
  const token = (apiKeyHeader || '').startsWith('Bearer ')
    ? apiKeyHeader.split(' ')[1]
    : apiKeyHeader;

  if (token !== serverKey) {
    return res.status(403).json({ message: 'Acceso denegado: clave inválida' });
  }

  next();
};
