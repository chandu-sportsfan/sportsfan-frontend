import { NextResponse } from 'next/server';

type BattleRecord = {
  id: string;
  name: string;
  type: 'players' | 'clubs';
  players: string[];
  teams: string[];
  createdAt: string;
};

const battles: BattleRecord[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, players, teams } = body;
    if (!name || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newBattle: BattleRecord = {
      id: `b_${Date.now()}`,
      name,
      type,
      players: players || [],
      teams: teams || [],
      createdAt: new Date().toISOString(),
    };

    battles.push(newBattle);

    return NextResponse.json({ ok: true, data: newBattle });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ data: battles });
}
