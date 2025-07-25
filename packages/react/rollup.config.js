import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'

const input = 'src/index.ts'
const preserveModulesRoot = 'src'

export default defineConfig([
  // ESM 构建
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot,
      entryFileNames: '[name].js',
    },
    external: [/node_modules/, '@kc-monitor/core', '@kc-monitor/browser'],
    plugins: [
      peerDepsExternal(), // 自动外置 peerDeps
      resolve({
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      }),
      commonjs(),
      esbuild({
        target: 'es2020',
        tsconfig: './tsconfig.json',
        sourceMap: true,
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        jsx: 'automatic',
      }),
    ],
  },

  // CJS 构建
  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot,
      entryFileNames: '[name].js',
    },
    external: [/node_modules/, '@kc-monitor/core', '@kc-monitor/browser'],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      }),
      commonjs(),
      esbuild({
        target: 'es2020',
        tsconfig: './tsconfig.json',
        sourceMap: true,
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        jsx: 'automatic',
      }),
    ],
  },

  // 类型声明构建
  {
    input,
    output: {
      dir: 'dist/types',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot,
    },
    plugins: [dts()],
  },
])
