const fs = require('fs');
const path = require('path');

// Read the JSON file
const sesionesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../sesiones/sesiones.json'), 'utf8'));

// Read the prompt text
const promptText = fs.readFileSync(path.join(__dirname, '../assets/prompt.txt'), 'utf8');

// HTML template function
function generateHTML(sesion) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${sesion.titulo} | Lyra</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <header class="sub-header">
    <div class="container">
      <a href="index.html" class="back-link">Volver a sesiones</a>
      <h1>${sesion.titulo}</h1>
    </div>
    <div class="circuit-line"></div>
  </header>

  <main class="container">
    <div class="session-meta">
      <div class="session-date">${sesion.fecha}</div>
      <div class="tension-level">${sesion.nivelTension}</div>
    </div>

    <section class="resumen">
      <h2>Resumen Breve</h2>
      <p>${sesion.resumen}</p>
      ${sesion.temasPrincipales ? `
      <h3>Temas Principales</h3>
      <ul>
        ${sesion.temasPrincipales.map(tema => `<li>${tema}</li>`).join('\n        ')}
      </ul>
      ` : ''}
    </section>

    <section class="puntos-clave">
      <h2>Principales Eventos y Decisiones</h2>
      <ul>
        ${sesion.decisionesClave.map(decision => `<li>${decision}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="sugerencias">
      <h2>Recomendaciones Accionables</h2>
      <ul>
        ${sesion.recomendaciones.map(recomendacion => `<li>${recomendacion}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="analisis-retorica">
      <h2>Análisis de la Retórica y la Dinámica de la Sesión</h2>
      <p>${sesion.analisisRetorica}</p>
    </section>
  </main>

  <footer>
    <p>Lyra v2.0 - Desarrollado para transparencia y claridad política</p>
  </footer>
</body>
</html>`;
}

// Function to generate a URL-friendly slug from text
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[áéíóúñü]/g, c => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ü: 'u' })[c])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to write file with proper line endings
function writeFileWithProperLineEndings(filePath, content) {
  // Replace all line endings with OS-specific ones
  const normalizedContent = content.replace(/\r?\n/g, process.platform === 'win32' ? '\r\n' : '\n');
  fs.writeFileSync(filePath, normalizedContent);
}

// Function to format date string to YYYY-MM-DD
function formatDate(fechaStr) {
  // Expecting format like "19 de marzo de 2025"
  const [dia, , mes, , año] = fechaStr.split(' ');
  
  // Map Spanish month names to numbers
  const meses = {
    'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
    'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
    'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };

  // Pad day with leading zero if needed
  const diaFormateado = dia.padStart(2, '0');
  const mesFormateado = meses[mes.toLowerCase()];
  
  return `${año}-${mesFormateado}-${diaFormateado}`;
}

// Generate HTML files for each session
sesionesData.forEach(sesion => {
  // Create filename with formatted date and clean slug
  const fechaFormateada = formatDate(sesion.fecha);
  const titleSlug = generateSlug(sesion.titulo);
  const filename = path.join(__dirname, '../sesiones', `${fechaFormateada}-${titleSlug}.html`);
  
  // Generate and write HTML
  const htmlContent = generateHTML(sesion);
  writeFileWithProperLineEndings(filename, htmlContent);
  console.log(`Generated: ${filename}`);
});

// Generate index file for sessions
const generateIndex = (sesiones) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sesiones | Lyra</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <header class="sub-header">
    <div class="container">
      <a href="../index.html" class="back-link">Inicio</a>
      <h1>SESIONES ANALIZADAS</h1>
    </div>
    <div class="circuit-line"></div>
  </header>

  <main class="container">
    <ul class="session-list">
      ${sesiones.map(sesion => {
        const fechaFormateada = formatDate(sesion.fecha);
        const titleSlug = generateSlug(sesion.titulo);
        return `
      <li class="session-item">
        <a href="${fechaFormateada}-${titleSlug}.html" class="session-link">
          <div class="session-date">
            ${sesion.fecha}
            <div class="status-indicator">Analizado</div>
          </div>
          <div class="session-meta">${sesion.titulo} | ${sesion.nivelTension}</div>
        </a>
      </li>`;
      }).join('\n')}
    </ul>
  </main>

  <footer>
    <p>Lyra v2.0 - Desarrollado para transparencia y claridad política</p>
  </footer>
</body>
</html>`;
};

// Generate main index file
const generateMainIndex = (sesiones) => {
  const latestSession = sesiones[0];
  const fechaFormateada = formatDate(latestSession.fecha);
  const titleSlug = generateSlug(latestSession.titulo);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Lyra - Análisis de Sesiones Parlamentarias</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="main-header">
    <div class="container">
      <div class="logo-container">
        <img src="assets/logo.png" alt="Lyra Logo" class="logo">
        <div class="logo-ring"></div>
      </div>
      <h1>LYRA</h1>
      <p>Análisis inteligente de sesiones parlamentarias</p>
    </div>
    <div class="circuit-line"></div>
  </header>

  <nav class="main-nav">
    <div class="container">
      <ul>
        <li><a href="sesiones/index.html">Sesiones Analizadas</a></li>
      </ul>
    </div>
  </nav>

  <main class="container">
    <div class="latest-session">
      <h2>Última Sesión Analizada</h2>
      <div class="session-highlight">
        <div class="session-data">
          <div class="data-point">
            <div class="label">Fecha</div>
            <div class="value">${latestSession.fecha}</div>
          </div>
          <div class="data-point">
            <div class="label">Título</div>
            <div class="value">${latestSession.titulo}</div>
          </div>
          <div class="data-point">
            <div class="label">Nivel de Tensión</div>
            <div class="value">${latestSession.nivelTension}</div>
          </div>
        </div>
        <div class="session-data">
          <div class="data-point">
            <div class="label">Resumen</div>
            <div class="value">${latestSession.resumen.substring(0, 200)}...</div>
          </div>
          <a href="sesiones/${fechaFormateada}-${titleSlug}.html" class="btn">Ver análisis completo</a>
        </div>
      </div>
    </div>

    <div class="prompt-box">${promptText.trim()}</div>
  </main>

  <footer>
    <p>Lyra v2.0 - Desarrollado para transparencia y claridad política</p>
  </footer>
</body>
</html>`;
};

// Write index file
writeFileWithProperLineEndings(
  path.join(__dirname, '../sesiones/index.html'),
  generateIndex(sesionesData)
);
console.log('Generated: sesiones/index.html');

// Write main index file
writeFileWithProperLineEndings(
  path.join(__dirname, '../index.html'),
  generateMainIndex(sesionesData)
);
console.log('Generated: index.html'); 