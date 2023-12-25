import YTDlpWrap from 'yt-dlp-wrap'

const validDomains = ['youtube.com', 'dailymotion.com', 'vimeo.com', 'pornhub.com', 'xvideos.com', 'xhamster.com']
const ytDlpWrap = new YTDlpWrap('/usr/local/bin/yt-dlp')

export async function getInfo(url: string) {
  const metadata = await ytDlpWrap.getVideoInfo(url)
  return metadata.title
}

export async function downloadVideo(url: string): Promise<string | null> {
  const metadata = await ytDlpWrap.getVideoInfo(url)
  if (!metadata.title) return null

  const filename = metadata.title + '.mp4'
  const readableStream = ytDlpWrap.execStream([url, '-f', 'best[ext=mp4]'])

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    readableStream.on('data', (chunk) => chunks.push(chunk))
    readableStream.on('end', () => {
      Bun.write(filename, Buffer.concat(chunks)).then(() => {
        resolve(filename) // Download concluído.
      }).catch((err) => {
        console.error('Erro ao salvar o vídeo:', err)
        reject(null)
      })
    })

    readableStream.on('error', (err) => {
      console.error('Erro ao baixar o vídeo:', err)
      reject(null)
    })
  })
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
