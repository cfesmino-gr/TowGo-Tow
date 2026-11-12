import { supabase } from './supabaseClient'

export type TowgoRow = Record<string, unknown>

export async function fetchTowgoRows(): Promise<TowgoRow[]> {
  const { data, error } = await supabase.from('Towgo App').select('*')
  if (error) throw error
  return (data ?? []) as TowgoRow[]
}
