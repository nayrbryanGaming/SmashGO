import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findMatch } from '@/lib/matchmaking';

export const dynamic = 'force-dynamic';

/**
 * SmashGo Matchmaking Cron Job
 * Run this every 1-2 minutes via Vercel Cron or GitHub Actions.
 * This job attempts to find matches for all users currently in the 'searching' state.
 */
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Get all active 'searching' entries ordered by oldest first
    const { data: queueEntries, error } = await supabase
      .from('matchmaking_queue')
      .select('id')
      .eq('status', 'searching')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!queueEntries || queueEntries.length === 0) {
      return NextResponse.json({ message: 'No entries in queue' });
    }

    console.log(`Processing matchmaking for ${queueEntries.length} entries...`);

    const results = [];
    
    // 2. Iterate through each entry and try to find a match
    // Note: We do this sequentially or in small batches to avoid race conditions 
    // where multiple matches are made for the same user.
    for (const entry of queueEntries) {
      const result = await findMatch(entry.id);
      results.push({ id: entry.id, ...result });
    }

    const matchedCount = results.filter(r => r.found).length;

    return NextResponse.json({
      processed: queueEntries.length,
      matched: matchedCount,
      details: results
    });
  } catch (err: any) {
    console.error('Matchmaking Cron Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
