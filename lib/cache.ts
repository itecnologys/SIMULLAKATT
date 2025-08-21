// Sistema de cache simples para melhorar performance
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 30000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

export const cacheManager = new CacheManager()

// Hook para usar cache em componentes
export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl: number = 30000): T | null {
  const cached = cacheManager.get(key)
  if (cached) return cached

  // Se não há cache, executa o fetcher e armazena
  fetcher().then(data => {
    cacheManager.set(key, data, ttl)
  })

  return null
}
