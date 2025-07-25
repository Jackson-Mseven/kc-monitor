import fs from 'fs'
import path from 'path'

function writeDistPackageJson() {
  // 你的包根目录，假设当前执行目录是包根
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found!')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  const version = pkg.version || '0.0.0'

  const distDirs = [
    { dir: 'dist/esm', type: 'module' },
    { dir: 'dist/cjs', type: 'commonjs' },
  ]

  distDirs.forEach(({ dir, type }) => {
    const targetPath = path.resolve(process.cwd(), dir)
    if (!fs.existsSync(targetPath)) {
      console.warn(`${dir} does not exist, skipping`)
      return
    }
    const content = {
      type,
      version,
      sideEffects: false,
    }
    fs.writeFileSync(
      path.join(targetPath, 'package.json'),
      JSON.stringify(content, null, 2) + '\n',
      'utf-8'
    )
    console.log(`Wrote ${dir}/package.json`)
  })
}

writeDistPackageJson()
