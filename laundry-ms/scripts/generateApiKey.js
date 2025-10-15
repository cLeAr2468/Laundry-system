import { v4 as uuidv4 } from "uuid";
import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate API key
const apiKey = uuidv4();

// Create or update .env file
const envPath = join(__dirname, '..', '.env');
const envContent = `VITE_API_KEY=${apiKey}
VITE_API_URL=http://localhost:3000`;

writeFileSync(envPath, envContent);

console.log('New API key generated:', apiKey);
console.log('API key has been saved to .env file');