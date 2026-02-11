import { createClient } from '@supabase/supabase-js'

// 🔐 Pegando variáveis do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🚨 Segurança básica
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing.')
}

// 🚀 Criando cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("URL:", supabaseUrl)
console.log("KEY:", supabaseAnonKey)

