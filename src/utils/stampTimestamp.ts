// Bangkok UTC+7 format: DD/MM/YYYY HH:MM
function formatBangkokDateTime(date: Date): string {
  const offsetMs = 7 * 60 * 60 * 1000
  const bangkokDate = new Date(date.getTime() + offsetMs)
  const dd = String(bangkokDate.getUTCDate()).padStart(2, '0')
  const mm = String(bangkokDate.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = bangkokDate.getUTCFullYear()
  const hh = String(bangkokDate.getUTCHours()).padStart(2, '0')
  const min = String(bangkokDate.getUTCMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function drawTimestampText(ctx: CanvasRenderingContext2D, text: string, width: number, height: number): void {
  const PADDING = 12
  ctx.font = 'bold 28px Arial'
  const textWidth = ctx.measureText(text).width
  const x = (width - textWidth) / 2
  const y = height - PADDING - 4 // baseline near bottom

  // Black stroke for visibility on light backgrounds
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(0,0,0,0.8)'
  ctx.strokeText(text, x, y)

  // White fill on top
  ctx.fillStyle = 'white'
  ctx.fillText(text, x, y)
}

function blobToFile(blob: Blob): File {
  return new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
}

export async function stampTimestamp(imageBlob: Blob, dateTime: Date): Promise<File> {
  const bitmap = await createImageBitmap(imageBlob)

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const label = formatBangkokDateTime(dateTime)
  drawTimestampText(ctx, label, canvas.width, canvas.height)

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('Canvas toBlob failed')); return }
        resolve(blobToFile(blob))
      },
      'image/jpeg',
      0.9,
    )
  })
}
