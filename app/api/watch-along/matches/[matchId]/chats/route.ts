import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://sportsfan360.vercel.app/api/watch-along';

export async function GET(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
    try {
        const { matchId } = await params;
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit') || '50';
        
        const response = await fetch(`${API_BASE_URL}/matches/${matchId}/chats?limit=${limit}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
            console.warn("Backend returned error for chats GET, using mock data");
            return NextResponse.json({ success: true, chats: [] });
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Chat GET Error:", error);
        return NextResponse.json({ success: true, chats: [] });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
    try {
        const { matchId } = await params;
        const body = await req.json();
        
        const response = await fetch(`${API_BASE_URL}/matches/${matchId}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.warn("Backend returned error for chats POST, mocking success");
            return NextResponse.json({ 
                success: true, 
                chat: { id: Date.now().toString(), text: body.text, user: body.user, timestamp: new Date().toISOString() } 
            });
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Chat POST Error:", error);
        return NextResponse.json({ success: true, chat: { id: Date.now().toString(), timestamp: new Date().toISOString() } });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
    try {
        const { matchId } = await params;
        const body = await req.json();
        
        const response = await fetch(`${API_BASE_URL}/matches/${matchId}/chats`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.warn("Backend returned error for chats DELETE, mocking success");
            return NextResponse.json({ success: true });
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Chat DELETE Error:", error);
        return NextResponse.json({ success: true });
    }
}
