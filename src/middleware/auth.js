require('dotenv').config();

module.exports = function (req, res, next) {
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['authorization'];

  if (!apiKeyHeader) {
    return res.status(401).json({ message: 'No autorizado: falta la clave de acceso' });
  }

  // Soporta `x-api-key: <KEY>` o `Authorization: Bearer <KEY>`
  const token = apiKeyHeader.startsWith('Bearer ')
    ? apiKeyHeader.split(' ')[1]
    : apiKeyHeader;

  if (!process.env.API_KEY) {
    console.error('API_KEY no configurada en .env');
    return res.status(500).json({ message: 'Server misconfigured' });
  }

  if (token !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Acceso denegado: clave inválida' });
  }

  next();
};
