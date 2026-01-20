// Cargar .env solo en desarrollo para permitir pruebas locales
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    /* ignorar si dotenv no está instalado */
  }
}

// En producción solo aceptar la variable `API_KEY` exactamente.
const serverKey = process.env.API_KEY;

// Diagnostic logging para deployment: mostrar si la variable existe y claves relacionadas
{
  const hasKey = !!serverKey;
  const interesting = Object.keys(process.env).filter(k => /API|VERCEL|NODE_ENV|PORT/i.test(k));
  if (hasKey) {
    console.log('auth: API_KEY presente en process.env (longitud=' + String(process.env.API_KEY ? process.env.API_KEY.length : 0) + ')');
  } else {
    console.error('auth: API_KEY ausente en process.env. Variables relevantes: ' + interesting.join(', '));
  }
}

module.exports = function (req, res, next) {
  if (!serverKey) {
    console.error('auth: API_KEY no configurada en el entorno. Falla de servidor.');
    return res.status(500).json({ message: 'Server misconfigured: API_KEY missing' });
  }

  const apiKeyHeader = req.headers['x-api-key'] || req.headers['authorization'];

  if (!apiKeyHeader) {
    return res.status(401).json({ message: 'No autorizado: falta la clave de acceso' });
  }

  // Soporta `x-api-key: <KEY>` o `Authorization: Bearer <KEY>`
  let token = apiKeyHeader;
  if ((apiKeyHeader || '').toLowerCase().startsWith('bearer ')) {
    token = apiKeyHeader.split(' ')[1];
  }

  token = (token || '').trim();

  if (token !== serverKey) {
    return res.status(403).json({ message: 'Acceso denegado: clave inválida' });
  }

  next();
};
