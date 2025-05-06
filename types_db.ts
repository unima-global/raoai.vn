export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: { id: string; title: string; content: string; user_id: string }
        Insert: { title: string; content: string; user_id: string }
        Update: Partial<{ title: string; content: string }>
      }
      images: {
        Row: { id: string; url: string }
        Insert: { url: string }
        Update: Partial<{ url: string }>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
