# Pendências

## Infraestrutura

### Cloudflare R2 — bucket de backgrounds (Fase 6)

- [ ] Criar bucket `vilafi-backgrounds` no dashboard da Cloudflare R2
- [ ] Habilitar acesso público no bucket (Public R2 Dev URL ou domínio customizado)
- [ ] Configurar CORS no bucket para permitir PUT do browser:
  ```json
  [
    {
      "AllowedOrigins": ["https://vilafi.com", "http://localhost:3000"],
      "AllowedMethods": ["PUT"],
      "AllowedHeaders": ["Content-Type"],
      "MaxAgeSeconds": 3600
    }
  ]
  ```
- [ ] Gerar API Token com permissão de escrita no bucket (R2 → Manage R2 API Tokens)
- [ ] Adicionar ao `.env.local` (e no painel do Vercel em produção):
  ```env
  R2_ACCOUNT_ID=<account id da Cloudflare>
  R2_ACCESS_KEY_ID=<access key do token>
  R2_SECRET_ACCESS_KEY=<secret key do token>
  R2_BUCKET_NAME=vilafi-backgrounds
  R2_PUBLIC_URL=https://pub-xxx.r2.dev
  ```
- [ ] Rodar os comandos pendentes da Fase 6:
  ```bash
  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
  npx prisma migrate dev --name add_custom_background
  ```

---

## Assets

- [ ] `public/videos/forest-day.mp4`
- [ ] `public/videos/beach-sunset.mp4`
- [ ] `public/videos/storm-night.mp4`
- [ ] `public/audio/sfx/bell.mp3` (notificação Pomodoro)
