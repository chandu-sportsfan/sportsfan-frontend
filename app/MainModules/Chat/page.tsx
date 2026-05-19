// Navigate up 3 levels (Chat -> MainModules -> app -> root) then into src/components
import ChatComponent from "../../../src/components/ChatComponent";
import { Metadata } from "next";

// Optional: Add metadata for SEO and browser tabs
export const metadata: Metadata = {
    title: "Chat | SportsFan360",
    description: "Connect with players and groups",
};

export default function ChatPage() {
    return (
        <main>
            <ChatComponent />
        </main>
    );
}