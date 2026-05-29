'use client'

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { isPremium } from '@/lib/planFeatures'
import { UpgradeBanner } from '@/components/Upgrade/UpgradeBanner'

interface Props {
  onClose: () => void
}

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4'
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
const IMAGE_MAX = 10 * 1024 * 1024
const VIDEO_MAX = 50 * 1024 * 1024
const IMAGE_EXT = /\.(jpe?g|png|webp)(\?.*)?$/i

export function BackgroundUploader({ onClose }: Props) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)
  const setCustomBackground = useAuthStore((s) => s.setCustomBackground)

  const premium = isPremium(subscription)
  const currentBackground = user?.customBackgroundUrl ?? null

  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Tipo não suportado. Use JPG, PNG, WebP ou MP4.')
        return
      }
      const isVideo = file.type === 'video/mp4'
      if (file.size > (isVideo ? VIDEO_MAX : IMAGE_MAX)) {
        setError(`Arquivo muito grande. Máximo: ${isVideo ? '50MB' : '10MB'}`)
        return
      }

      setUploading(true)
      setProgress(0)

      try {
        const presignRes = await fetch('/api/v1/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size }),
        })
        const presignJson = await presignRes.json()
        if (presignJson.error) throw new Error(presignJson.error.message)
        const { uploadUrl, publicUrl } = presignJson.data

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
          }
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload falhou'))
          xhr.onerror = () => reject(new Error('Erro de rede'))
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)
        })

        const confirmRes = await fetch('/api/v1/upload/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ publicUrl }),
        })
        const confirmJson = await confirmRes.json()
        if (confirmJson.error) throw new Error(confirmJson.error.message)

        setCustomBackground(publicUrl)
        setProgress(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro no upload')
        setProgress(null)
      } finally {
        setUploading(false)
      }
    },
    [token, setCustomBackground],
  )

  async function handleRemove() {
    setError(null)
    try {
      const res = await fetch('/api/v1/upload/background', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      setCustomBackground(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao remover')
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ''
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-end bg-black/30 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        className="relative h-full w-full max-w-xs bg-black/80 border-l border-white/10 backdrop-blur-xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
          <div>
            <h2 className="text-sm font-semibold text-white/80">Background</h2>
            <p className="text-xs text-white/30">Personalize o fundo do hub</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {!premium ? (
            <UpgradeBanner onClose={onClose} />
          ) : (
            <>
              {currentBackground && (
                <div className="rounded-xl overflow-hidden border border-white/10 relative">
                  {IMAGE_EXT.test(currentBackground) ? (
                    <img src={currentBackground} alt="Background atual" className="w-full h-32 object-cover" />
                  ) : (
                    <video src={currentBackground} className="w-full h-32 object-cover" muted playsInline />
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-3 flex items-center justify-between">
                    <span className="text-xs text-white/50">Background atual</span>
                    <button
                      onClick={handleRemove}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-3 py-10 px-4 text-center ${
                  uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'
                } ${
                  dragging
                    ? 'border-violet-400/60 bg-violet-500/10'
                    : 'border-white/15 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-white/60">
                    {dragging ? 'Solte o arquivo aqui' : 'Arraste ou clique para enviar'}
                  </p>
                  <p className="text-xs text-white/30 mt-1">JPG, PNG, WebP até 10MB · MP4 até 50MB</p>
                </div>

                {progress !== null && (
                  <div className="w-full mt-1">
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-violet-400 transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/35 mt-1.5">{progress}% enviado</p>
                  </div>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={onFileChange}
              />

              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
