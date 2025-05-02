<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'
=======

import { supabase } from '../../lib/supabase'
>>>>>>> e3c8efc0c3f95e2c98b1d8eaaec910191cad91a3

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
