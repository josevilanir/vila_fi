import { defineConfig } from 'prisma/config'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Prisma v7 não carrega .env automaticamente — fazemos aqui para o CLI
function loadEnvFile(filename: string) {
  try {
    readFileSync(join(process.cwd(), filename), 'utf8')
      .split('\n')
      .forEach((line) => {
        const m = line.match(/^([^=#\s][^=]*)=["']?([^"'\n]+)["']?\s*$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
      })
  } catch {
    // file may not exist — ignore
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
})
