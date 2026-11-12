import { useEffect } from 'react'
import { fetchTowgoRows } from './supabaseData'

export function useSupabaseConnection() {
  useEffect(() => {
    let cancelled = false

    fetchTowgoRows()
      .then((rows) => {
        if (cancelled) return
        console.info(
          `[Supabase] connected — ${rows.length} row(s) fetched from "Towgo App"`,
          rows,
        )
      })
      .catch((error: unknown) => {
        if (cancelled) return
        console.error('[Supabase] connection failed:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])
}
