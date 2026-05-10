import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: parseInt(process.env.PORT || '3000'),
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'react': path.resolve(__dirname, 'node_modules/react'),
          'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
          'react-native': 'react-native-web',
          '@expo/vector-icons': path.resolve(__dirname, 'components/taxpilot/_stubs/expoVectorIcons.tsx'),
          'expo-router': path.resolve(__dirname, 'components/taxpilot/_stubs/expoRouter.ts'),
          'expo-haptics': path.resolve(__dirname, 'components/taxpilot/_stubs/expoHaptics.ts'),
          'expo-linear-gradient': path.resolve(__dirname, 'components/taxpilot/_stubs/expoLinearGradient.tsx'),
          'react-native-safe-area-context': path.resolve(__dirname, 'components/taxpilot/_stubs/safeAreaContext.tsx'),
        },
        extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__DEV__': JSON.stringify(false),
      } as any
    };
});
