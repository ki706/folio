import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Attempt to query the table list using a raw RPC or a known table
    const { data: tables, error } = await supabase
      .from('EmittoSettings')
      .select('count')
      .limit(1);

    const { data: allItems, error: listError } = await supabase.rpc('get_tables'); 
    // Usually get_tables doesn't exist, so we'll try a generic query to see schema info if allowed

    return NextResponse.json({
      checking: 'EmittoSettings',
      success: !error,
      error: error ? {
        message: error.message,
        code: error.code
      } : null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
