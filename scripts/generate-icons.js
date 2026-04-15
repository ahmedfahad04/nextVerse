const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const input = path.join(__dirname, '..', 'public', 'logo.png');
const outDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(input)) {
  console.error('Input logo.png not found at', input);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [192, 512];

Promise.all(
  sizes.map((s) =>
    sharp(input)
      .resize(s, s, { fit: 'cover' })
      .png()
      .toFile(path.join(outDir, `icon-${s}x${s}.png`))
  )
)
  .then(() => {
    console.log('Generated icons:', sizes.map((s) => `public/icons/icon-${s}x${s}.png`).join(', '));
  })
  .catch((err) => {
    console.error('Failed to generate icons:', err);
    process.exit(2);
  });
