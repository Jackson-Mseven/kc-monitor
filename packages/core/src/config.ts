import { MonitorConfig } from './types'

export async function loadConfig(): Promise<MonitorConfig> {
  try {
    const mod = await import(`${process.cwd()}/kcmonitor.config.ts`)
    return mod.default
  } catch (e) {
    console.warn('[kc-monitor] Failed to load config', e)
    return { dsn: '' }
  }
}
