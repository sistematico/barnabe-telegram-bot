import YTDlpWrap from 'yt-dlp-wrap'

const validDomains = ['youtube.com', 'dailymotion.com', 'vimeo.com', 'pornhub.com', 'xvideos.com', 'xhamster.com']
const ytDlpWrap = new YTDlpWrap('/usr/local/bin/yt-dlp')

export async function getInfo(url: string) {
  const metadata = await ytDlpWrap.getVideoInfo(url)
  return metadata.title
}

export async function downloadVideo(url: string): Promise<string | null> {
  try {
    const metadata = await ytDlpWrap.getVideoInfo(url)
    if (!metadata.title) return null

    const filename = metadata.title + '.mp4'
    const readableStream = ytDlpWrap.execStream([url, '-c', '--no-part', '-f', 'best[ext=mp4]'])

    const chunks: Buffer[] = []
    return new Promise((resolve, reject) => {
      readableStream.on('data', chunk => chunks.push(chunk))

      readableStream.on('end', async () => {
        try {
          await Bun.write(filename, Buffer.concat(chunks)) // Download concluído.
          resolve(filename)
        } catch (err) {
          console.error('Erro ao salvar o vídeo:', err)
          reject(null)
        }
      })

      readableStream.on('error', err => {
        console.error('Erro ao baixar o vídeo:', err)
        reject(null)
      })

      // Configurar um tempo limite para o download
      const timeout = 60000 // 60 segundos, ajuste conforme necessário
      setTimeout(() => {
        if (chunks.length === 0) {
          // Se nenhum dado foi recebido
          console.error('Download excedeu o tempo limite.')
          reject(null)
        }
      }, timeout)
    })
  } catch (error) {
    console.error('Erro durante o download:', error)
    return null
  }
}

function validDomain(url: string): boolean {
  try {
    const domain = new URL(url).hostname
    return validDomains.some(validDomain => domain === validDomain || domain.endsWith('.' + validDomain))
  } catch (e) {
    return false
  }
}

export function validateUrl(url: string): string | null {
  const urlRegex = /https?:\/\/[^\s]+/g
  const found = url.match(urlRegex)

  if (found && found.length > 0) {
    try {
      new URL(found[0])

      if (!validDomain(found[0])) return null

      return found[0]
    } catch (e) {
      // console.error("URL inválida:", e);
      return null
    }
  }

  return null
}
