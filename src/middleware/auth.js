// No usar dotenv en producción; confiar en `process.env` provisto por Vercel.
// Buscar varios nombres comunes de variable por compatibilidad.
const POSSIBLE_KEYS = ['API_KEY', 'APIKEY', 'VERCEL_API_KEY', 'NEXT_PUBLIC_API_KEY'];
const serverKey = POSSIBLE_KEYS.map(k => process.env[k]).find(v => v && v.length > 0);

module.exports = function (req, res, next) {
  // En producción y en general, requerimos que la clave del servidor esté configurada.
  if (!serverKey) {
    return res.status(500).json({ message: 'Server misconfigured: API_KEY no está definida en el entorno' });
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
