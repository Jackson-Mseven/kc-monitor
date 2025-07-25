import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

// 通用配置项
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
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        target: 'es2020',
        tsconfig: './tsconfig.json',
        sourceMap: true,
      }),
    ],
    external: [/node_modules/, '@kc-monitor/core'],
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
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        target: 'es2020',
        tsconfig: './tsconfig.json',
        sourceMap: true,
      }),
    ],
    external: [/node_modules/, '@kc-monitor/core'],
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
