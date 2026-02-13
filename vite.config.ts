import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga todas las variables de entorno desde .env y el sistema.
  // El tercer parámetro '' asegura que se carguen TODAS las variables, 
  // no solo las que empiezan por VITE_, necesario para process.env.API_KEY.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Reemplaza process.env en el código cliente con el objeto de variables cargado
      'process.env': JSON.stringify(env)
    },
    build: {
      outDir: 'dist',
    },
  };
});