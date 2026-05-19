"use client";

import { useState, useRef, useEffect } from "react";
import { 
    ChevronLeft, Plus, UserPlus, Users, Camera, X, MoreVertical, Mic, 
    CheckCheck, Flag, LogOut, Reply, Edit2, Trash2, 
    Search, ImagePlus, ImageOff, BadgeCheck, TrendingUp, Globe, Lock, Radio, Crown, MessageCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- INTERFACES ---
interface User { 
    id: number; 
    name: string; 
    avatar: string; 
}

interface Message { 
    id: number; 
    text: string; 
    sender: "me" | "other"; 
    timestamp: Date;
    reactions?: string[];
    replyToText?: string;
    replyToSender?: string;
}

interface ChatItem {
    id: number;
    name: string;
    avatar: string | null;
    isGroup: boolean;
    hasJoined?: boolean; 
    description?: string;
    members?: number;
    memberList?: User[]; 
    headerImage?: string | null; 
    messages: Message[];
    
    // UI Metadata for New Layouts
    unreadCount?: number;
    isVerified?: boolean;
    isTrending?: boolean;
    privacy?: "Public" | "Closed" | "Private" | "Announcement" | "Exclusive";
    timeAgo?: string;
    communityTheme?: string; 
}

type TabType = "My Chats" | "Discover Groups" | "Communities";
type ImageEditType = "cover" | "avatar" | null;

// --- DUMMY DATA ---
const DUMMY_MEMBERS: User[] = [
    { id: 101, name: "Mithlesh", avatar: "/images/kl-rahul.jpg" },
    { id: 102, name: "Krishna", avatar: "/images/virat.jpg" },
    { id: 103, name: "Ayush", avatar: "/images/dhoni.jpg" },
    { id: 104, name: "Rohit", avatar: "/images/rohit.jpg" },
];

const AVAILABLE_USERS_TO_ADD: User[] = [
    { id: 201, name: "KL Rahul", avatar: "/images/kl-rahul.jpg" },
    { id: 202, name: "Virat Kohli", avatar: "/images/virat.jpg" },
    { id: 203, name: "MS Dhoni", avatar: "/images/dhoni.jpg" },
];

const INITIAL_CHATS: ChatItem[] = [
    // My Chats
    { id: 1, name: "Rohit Sharma", avatar: null, isGroup: false, hasJoined: true, messages: [{ id: 1, text: "Thanks for the support! 🏏", sender: "other", timestamp: new Date() }], isVerified: true, timeAgo: "2m", unreadCount: 2, communityTheme: "bg-[#2a1a1f]" },
    { id: 2, name: "MI Fans United", avatar: null, isGroup: true, hasJoined: true, members: 4500, messages: [{ id: 1, text: "Who's excited for tomorrow's match?", sender: "other", timestamp: new Date() }], timeAgo: "15m", unreadCount: 5, communityTheme: "bg-[#1a1c2a]" },
    { id: 3, name: "Team KKR", avatar: "/images/kkr-logo.png", isGroup: true, hasJoined: true, members: 7, messages: [{ id: 1, text: "Same here, everything's good. Have you made any plans for dinner yet?", sender: "other", timestamp: new Date() }], description: "All things about KKR and its team, All things about KKR and its team.", memberList: DUMMY_MEMBERS, headerImage: null, timeAgo: "1h" },
    { id: 4, name: "Virat Kohli", avatar: null, isGroup: false, hasJoined: true, messages: [{ id: 1, text: "See you at the stadium!", sender: "other", timestamp: new Date() }], isVerified: true, timeAgo: "3h", unreadCount: 1, communityTheme: "bg-[#2a1e1a]" },
    
    // Discover Groups
    { id: 5, name: "Mumbai Indians Official", avatar: null, isGroup: true, hasJoined: false, members: 125000, messages: [], description: "Match day! Let's go MI! 💙⚡", isTrending: true, privacy: "Announcement", timeAgo: "5m ago" },
    { id: 6, name: "IPL 2025 Predictions", avatar: null, isGroup: true, hasJoined: false, members: 45000, messages: [], description: "Who will win the trophy this year?", isTrending: true, privacy: "Public", timeAgo: "12m ago" },
    { id: 7, name: "RCB Forever", avatar: null, isGroup: true, hasJoined: false, members: 89000, messages: [], description: "Request to join and show your support.", privacy: "Closed", timeAgo: "20m ago" },
    { id: 8, name: "Rohit Sharma Fan Club", avatar: null, isGroup: true, hasJoined: false, members: 12000, messages: [], description: "Exclusive updates from Hitman himself.", privacy: "Private", timeAgo: "1h ago" },
    
    // Communities
    { id: 9, name: "IPL Fans Worldwide", avatar: null, isGroup: true, hasJoined: false, members: 2500000, messages: [], isTrending: true, privacy: "Public", timeAgo: "Active now" },
    { id: 10, name: "Fantasy Cricket Masters", avatar: null, isGroup: true, hasJoined: false, members: 890000, messages: [], description: "Share tips, strategies and squad predictions", isTrending: true, privacy: "Public", timeAgo: "2m ago" },
];

const EMOJIS = ["🤣", "🥳", "🤩", "😡", "😔"];

// --- EXTRACTED AVATAR COMPONENT ---
const ChatAvatar = ({ src, name, size = "w-12 h-12", className = "", fallbackTheme = "bg-[#2a1a1f]" }: { src: string | null; name: string; size?: string; className?: string; fallbackTheme?: string }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <div className={`${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold ${!src || imgError ? fallbackTheme : 'bg-[#151515]'} border border-white/5 ${className}`}>
            {src && !imgError ? (
                <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
                <span className="text-xl opacity-80">{name.charAt(0)}</span>
            )}
        </div>
    );
};

export default function ChatComponent() {
    const router = useRouter();
    
    // --- APP STATE ---
    const [view, setView] = useState<"list" | "create_group" | "chat_room" | "group_profile">("list");
    const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
    const [activeTab, setActiveTab] = useState<TabType>("My Chats");
    const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
    const [followedUsers, setFollowedUsers] = useState<number[]>([]);

    // --- CREATE GROUP STATE ---
    const [showAddMenu, setShowAddMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [showCreateMembersSheet, setShowCreateMembersSheet] = useState(false);

    // --- CHAT ROOM STATE ---
    const [messageInput, setMessageInput] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showGroupMenu, setShowGroupMenu] = useState(false);
    const groupMenuRef = useRef<HTMLDivElement | null>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // --- MESSAGE & GROUP EDIT STATE ---
    const [activeMessageMenu, setActiveMessageMenu] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
    const [showAddExistingMembersSheet, setShowAddExistingMembersSheet] = useState(false);
    const [showImageEditMenu, setShowImageEditMenu] = useState<ImageEditType>(null);

    // --- EFFECT HOOKS ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowAddMenu(false);
            if (groupMenuRef.current && !groupMenuRef.current.contains(event.target as Node)) setShowGroupMenu(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }, [activeChat?.messages, view]);

    // --- ACTIONS ---
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleChatClick = (chat: ChatItem) => {
        setActiveChat(chat);
        if (chat.isGroup && !chat.hasJoined) {
            setView("group_profile");
        } else {
            setView("chat_room");
        }
    };

    // --- GROUP MANAGEMENT ---
    const handleJoinGroup = () => {
        if (!activeChat) return;
        const updatedChat = { ...activeChat, hasJoined: true };
        setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
        setActiveChat(updatedChat);
        setView("chat_room");
        showToast("Group Joined!");
    };

    const handleLeaveGroup = () => {
        if (!activeChat) return;
        setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, hasJoined: false } : c));
        setShowGroupMenu(false);
        setView("list");
        setActiveTab("Discover Groups");
    };

    const handleDeleteGroup = () => {
        if (!activeChat) return;
        setChats(prev => prev.filter(c => c.id !== activeChat.id));
        setActiveChat(null);
        setView("list");
        showToast("Group deleted.");
    };

    const handleAddNewMember = (user: User) => {
        if (!activeChat) return;
        
        const isAlreadyMember = activeChat.memberList?.some(m => m.id === user.id);
        if (isAlreadyMember) return showToast("User is already a member");

        const updatedMembers = [...(activeChat.memberList || []), user];
        const updatedChat = { ...activeChat, memberList: updatedMembers, members: updatedMembers.length };

        setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
        setActiveChat(updatedChat);
        showToast(`${user.name} added to the group`);
    };

    const handleUpdateImage = (action: 'add' | 'remove') => {
        if (!activeChat || !showImageEditMenu) return;
        
        let newUrl: string | null = null;
        if (action === 'add') {
            // Mocking an image upload by selecting a dummy path based on type
            newUrl = showImageEditMenu === 'cover' ? "/images/stadium-dummy.jpg" : "/images/kkr-logo.png";
        }

        const updatedChat = { 
            ...activeChat, 
            [showImageEditMenu === 'cover' ? 'headerImage' : 'avatar']: newUrl 
        };

        setActiveChat(updatedChat);
        setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
        setShowImageEditMenu(null);
        showToast(`${showImageEditMenu === 'cover' ? 'Cover' : 'Profile'} image updated`);
    };

    // --- MESSAGE ACTIONS ---
    const handleSendMessage = (text: string) => {
        if (!text.trim() || !activeChat) return;

        let updatedMessages = [...activeChat.messages];

        if (editingMessage) {
            updatedMessages = updatedMessages.map(msg => msg.id === editingMessage.id ? { ...msg, text: text } : msg);
            setEditingMessage(null);
        } else {
            const newMessage: Message = { 
                id: Date.now(), 
                text: text, 
                sender: "me", 
                timestamp: new Date(),
                ...(replyingTo && { replyToText: replyingTo.text, replyToSender: replyingTo.sender === "me" ? "You" : "Someone" })
            };
            updatedMessages.push(newMessage);
            setReplyingTo(null);
        }

        const updatedChat = { ...activeChat, messages: updatedMessages };
        setActiveChat(updatedChat);
        setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
        setMessageInput("");
    };

    const handleReactToMessage = (messageId: number, emoji: string) => {
        if (!activeChat) return;
        const updatedMessages = activeChat.messages.map(msg => {
            if (msg.id === messageId) {
                const currentReactions = msg.reactions || [];
                return { ...msg, reactions: [...currentReactions, emoji] };
            }
            return msg;
        });
        updateActiveChatMessages(updatedMessages);
        setActiveMessageMenu(null);
    };

    const confirmDeleteMessage = () => {
        if (!activeChat || deletingMessageId === null) return;
        const updatedMessages = activeChat.messages.filter(msg => msg.id !== deletingMessageId);
        updateActiveChatMessages(updatedMessages);
        setDeletingMessageId(null);
        setActiveMessageMenu(null);
    };

    const updateActiveChatMessages = (updatedMessages: Message[]) => {
        if (!activeChat) return;
        const updatedChat = { ...activeChat, messages: updatedMessages };
        setActiveChat(updatedChat);
        setChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    };


    // --- RENDER VIEWS ---

    // 1. GROUP PROFILE / SETTINGS VIEW
   // --- RENDER VIEWS ---

// 1. CREATE GROUP VIEW (New implementation)
if (view === "create_group") {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setView("list")}><ChevronLeft size={24} /></button>
                <h1 className="text-xl font-bold">Create Group</h1>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 cursor-pointer">
                        <Camera size={24} className="text-gray-500" />
                    </div>
                </div>
                
                <input 
                    className="w-full bg-[#111] p-4 rounded-xl border border-white/10" 
                    placeholder="Group name" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <input 
                    className="w-full bg-[#111] p-4 rounded-xl border border-white/10" 
                    placeholder="Enter group description" 
                    value={groupDesc}
                    onChange={(e) => setGroupDesc(e.target.value)}
                />

                <button 
                    onClick={() => setShowCreateMembersSheet(true)}
                    className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-pink-500/20 text-left flex justify-between items-center"
                >
                    <span className="text-gray-400">Add members</span>
                    <span className="text-pink-500 font-bold">{selectedMemberIds.length} selected</span>
                </button>

                <button 
                    onClick={() => {
                        const newGroup: ChatItem = {
                            id: Date.now(),
                            name: groupName || "New Group",
                            avatar: null,
                            isGroup: true,
                            hasJoined: true,
                            description: groupDesc,
                            messages: [{ id: Date.now(), text: "Group created!", sender: "other", timestamp: new Date() }],
                            memberList: AVAILABLE_USERS_TO_ADD.filter(u => selectedMemberIds.includes(u.id))
                        };
                        setChats([newGroup, ...chats]);
                        setActiveChat(newGroup);
                        setView("chat_room");
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-bold mt-4"
                >
                    Create
                </button>
            </div>

            {/* Member Selection Sheet */}
            {showCreateMembersSheet && (
                <div className="absolute inset-0 bg-black z-50 p-6">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-xl font-bold">Add Members</h2>
                        <button onClick={() => setShowCreateMembersSheet(false)}><X /></button>
                    </div>
                    {AVAILABLE_USERS_TO_ADD.map(user => (
                        <div key={user.id} className="flex justify-between items-center p-4 border-b border-white/5">
                            <span>{user.name}</span>
                            <button 
                                onClick={() => setSelectedMemberIds(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                                className={`px-4 py-2 rounded-lg ${selectedMemberIds.includes(user.id) ? 'bg-pink-500' : 'bg-white/10'}`}
                            >
                                {selectedMemberIds.includes(user.id) ? "Remove" : "Add"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 2. CHAT ROOM VIEW
if (view === "chat_room" && activeChat) {
    // ... (Keep your existing chat_room implementation)
}

// 3. MAIN LIST VIEW
// ... (Keep your existing list view implementation)

    // 2. CHAT ROOM VIEW
    if (view === "chat_room" && activeChat) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#111] border-b border-white/5 relative z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView("list")} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                        <div onClick={() => setView("group_profile")} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 -ml-1 rounded-xl transition">
                            <ChatAvatar src={activeChat.avatar} name={activeChat.name} size="w-10 h-10" />
                            <div className="flex flex-col">
                                <h1 className="text-[16px] font-bold flex items-center gap-1">{activeChat.name} {activeChat.isVerified && <BadgeCheck size={14} className="text-blue-500" />}</h1>
                                {activeChat.isGroup && <span className="text-xs text-gray-400">{activeChat.members || activeChat.memberList?.length || 0} members</span>}
                            </div>
                        </div>
                    </div>
                    
                    {activeChat.isGroup && (
                        <div className="relative" ref={groupMenuRef}>
                            <button onClick={() => setShowGroupMenu(!showGroupMenu)} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
                                <MoreVertical size={20} className="text-white" />
                            </button>
                            {showGroupMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200">
                                        <Flag size={16} /> Report group
                                    </button>
                                    <button onClick={handleLeaveGroup} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-red-500">
                                        <LogOut size={16} /> Leave group
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={chatScrollRef} onClick={() => setActiveMessageMenu(null)}>
                    
                    {toastMessage && (
                        <div className="flex justify-center my-2 sticky top-4 z-10">
                            <div className="bg-[#222]/90 backdrop-blur-md text-gray-200 px-6 py-2.5 rounded-full flex items-center gap-2 text-sm shadow-xl border border-white/10">
                                <Users size={16} className="text-pink-500" /> {toastMessage}
                            </div>
                        </div>
                    )}

                    {activeChat.messages.map((msg) => {
                        const isMe = msg.sender === "me";
                        const showMenu = activeMessageMenu === msg.id;

                        return (
                            <div key={msg.id} className={`flex items-end gap-2 relative ${isMe ? "justify-end" : "justify-start"}`}>
                                {!isMe && activeChat.isGroup && activeChat.memberList && (
                                    <ChatAvatar src={null} name="User" size="w-8 h-8" className="mb-1" />
                                )}
                                
                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%] relative`}>
                                    {msg.replyToText && (
                                        <div className={`text-xs p-2 rounded-t-xl opacity-70 mb-[-10px] w-full ${isMe ? 'bg-blue-800/50 text-blue-100 text-right' : 'bg-gray-800/50 text-gray-300 text-left'}`}>
                                            Replying to {msg.replyToSender}: {msg.replyToText.slice(0, 30)}...
                                        </div>
                                    )}

                                    <div 
                                        onClick={(e) => { e.stopPropagation(); setActiveMessageMenu(showMenu ? null : msg.id); }}
                                        className={`px-4 py-2.5 text-[15px] shadow-sm cursor-pointer transition-opacity ${showMenu ? 'opacity-80' : 'opacity-100'} ${
                                            isMe ? "bg-[#e91e63] text-white rounded-2xl rounded-br-sm z-10" : "bg-[#222] text-white rounded-2xl rounded-bl-sm z-10"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    
                                    {msg.reactions && msg.reactions.length > 0 && (
                                        <div className={`absolute bottom-[-12px] bg-[#1a1a1a] rounded-full px-1.5 py-0.5 text-xs border border-white/10 flex gap-1 z-20 ${isMe ? 'right-4' : 'left-4'}`}>
                                            {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[10px] text-gray-500">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        {isMe && <CheckCheck size={14} className="text-[#e91e63]" />}
                                    </div>

                                    {/* MESSAGE MENU */}
                                    {showMenu && (
                                        <div className={`absolute top-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col ${isMe ? 'right-full mr-2' : 'left-full ml-2'}`}>
                                            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-[#222]">
                                                {EMOJIS.map(emoji => (
                                                    <button key={emoji} onClick={(e) => { e.stopPropagation(); handleReactToMessage(msg.id, emoji); }} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
                                                ))}
                                            </div>
                                            <div className="flex flex-col py-1">
                                                <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setActiveMessageMenu(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200">
                                                    <Reply size={16} /> Reply
                                                </button>
                                                {isMe && (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingMessage(msg); setMessageInput(msg.text); setActiveMessageMenu(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200">
                                                            <Edit2 size={16} /> Edit
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); setDeletingMessageId(msg.id); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-red-500">
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0a0a0a] border-t border-white/5 relative z-20">
                    {(replyingTo || editingMessage) && (
                        <div className="bg-[#151515] rounded-t-xl p-3 flex items-center justify-between border border-white/10 border-b-0 mb-[-10px] pb-4 px-4 z-0">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#e91e63]">{editingMessage ? 'Editing message' : `Replying to ${replyingTo?.sender === 'me' ? 'yourself' : 'someone'}`}</span>
                                <span className="text-xs text-gray-400 truncate max-w-[250px]">{editingMessage ? editingMessage.text : replyingTo?.text}</span>
                            </div>
                            <button onClick={() => { setReplyingTo(null); setEditingMessage(null); setMessageInput(""); }} className="p-1 bg-white/10 rounded-full hover:bg-white/20"><X size={14} /></button>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-full px-4 py-3 border border-white/10 relative z-10">
                        <input 
                            type="text" 
                            value={messageInput} 
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder={editingMessage ? "Edit your message..." : "Write a message..."}
                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(messageInput)}
                        />
                        {messageInput.trim() ? (
                            <button onClick={() => handleSendMessage(messageInput)} className="text-[#e91e63] font-semibold text-sm">Send</button>
                        ) : (
                            <button className="text-gray-400 hover:text-white transition"><Mic size={20} /></button>
                        )}
                    </div>
                </div>

                {/* DELETE MESSAGE CONFIRMATION */}
                {deletingMessageId && (
                    <div className="absolute inset-0 z- flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Delete</h3>
                                <button onClick={() => setDeletingMessageId(null)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <p className="text-gray-300 text-sm mb-6">Are you sure you would like to delete this message?</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setDeletingMessageId(null)} className="px-5 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition">Back</button>
                                <button onClick={confirmDeleteMessage} className="px-5 py-2 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-600/20">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. MAIN LIST VIEW
    const displayedChats = chats.filter(chat => {
        if (activeTab === "My Chats") return chat.hasJoined === true;
        if (activeTab === "Discover Groups") return chat.isGroup && !chat.hasJoined && chat.id < 9; // Simple mock filter
        if (activeTab === "Communities") return chat.isGroup && !chat.hasJoined && chat.id >= 9; // Simple mock filter
        return false;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans flex flex-col">
            <div className="max-w-2xl mx-auto w-full relative z-10 flex flex-col h-screen">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                        <h1 className="text-2xl font-bold text-white tracking-wide">Messages</h1>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-br from-pink-500 to-orange-500 hover:opacity-90 transition shadow-lg shadow-pink-500/20">
                            <Plus size={22} className="text-white" />
                        </button>
                        {showAddMenu && (
                            <div className="absolute right-0 top-full mt-3 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                                <button onClick={() => setShowAddMenu(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200">
                                    <UserPlus size={18} className="text-gray-400" /> New chat
                                </button>
                                <button onClick={() => { setShowAddMenu(false); setView("create_group"); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200">
                                    <Users size={18} className="text-gray-400" /> Create group
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-4">
                    <div className="flex items-center gap-3 bg-[#151515] rounded-xl px-4 py-3 border border-white/5 focus-within:border-pink-500/50 transition">
                        <Search size={18} className="text-gray-500" />
                        <input type="text" placeholder="Search chats & groups..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500" />
                    </div>
                </div>

                {/* New Tabs Design */}
                <div className="flex px-4 mb-4">
                    <button 
                        onClick={() => setActiveTab("My Chats")} 
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "My Chats" ? "bg-[#e91e63] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"}`}
                    >
                        My Chats
                    </button>
                    <button 
                        onClick={() => setActiveTab("Discover Groups")} 
                        className={`flex-1 py-3 text-sm font-bold border-x border-black transition-colors ${activeTab === "Discover Groups" ? "bg-[#e91e63] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"}`}
                    >
                        Discover Groups
                    </button>
                    <button 
                        onClick={() => setActiveTab("Communities")} 
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "Communities" ? "bg-[#e91e63] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"}`}
                    >
                        Communities
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {displayedChats.map((chat) => (
                        <div key={chat.id} onClick={() => handleChatClick(chat)} className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors relative group">
                            
                            {/* Rendering different Layouts based on Active Tab */}
                            {activeTab === "My Chats" ? (
                                <>
                                    <div className="relative">
                                        <ChatAvatar src={chat.avatar} name={chat.name} fallbackTheme={chat.communityTheme} size="w-14 h-14" />
                                        {chat.unreadCount && chat.unreadCount > 0 && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111]"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h2 className="text-white font-bold text-[16px] truncate flex items-center gap-1.5">
                                                {chat.name} {chat.isVerified && <BadgeCheck size={16} className="text-blue-500" />}
                                            </h2>
                                            <span className="text-xs text-gray-500 font-medium">{chat.timeAgo}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-400 truncate pr-4">
                                                {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Tap to chat"}
                                            </p>
                                            {chat.unreadCount && chat.unreadCount > 0 && (
                                                <div className="bg-[#e91e63] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20">{chat.unreadCount}</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Discover & Communities Layout */}
                                    <div className="w-14 h-14 rounded-lg bg-[#2a1a1f] border border-pink-500/10 flex items-center justify-center flex-shrink-0">
                                        <Users size={24} className="text-[#e91e63]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h2 className="text-white font-bold text-[16px] truncate pr-2">{chat.name}</h2>
                                            {chat.isTrending && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#e91e63] text-[10px] font-bold uppercase tracking-wider">
                                                    <TrendingUp size={10} /> Trending
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate mb-2">{chat.description || "Join the conversation"}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                            {chat.privacy === "Public" && <span className="flex items-center gap-1 text-blue-400"><Globe size={12}/> Public</span>}
                                            {chat.privacy === "Closed" && <span className="flex items-center gap-1 text-yellow-500"><Lock size={12}/> Closed</span>}
                                            {chat.privacy === "Private" && <span className="flex items-center gap-1 text-orange-500"><Lock size={12}/> Private</span>}
                                            {chat.privacy === "Announcement" && <span className="flex items-center gap-1 text-pink-500"><Radio size={12}/> Announcement</span>}
                                            {chat.privacy === "Exclusive" && <span className="flex items-center gap-1 text-purple-400"><Crown size={12}/> Exclusive</span>}
                                            
                                            <span className="flex items-center gap-1"><Users size={12}/> {chat.members?.toLocaleString()}</span>
                                            <span className="list-disc ml-1 list-inside">• {chat.timeAgo}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {displayedChats.length === 0 && <p className="text-gray-500 text-center mt-10">No chats found in this category.</p>}
                </div>

                {/* Floating Chat Icon (Reflecting the new glowing pink bubble requested) */}
                {/* {activeTab === "My Chats" && (
                    <div className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full border border-pink-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(233,30,99,0.3)] cursor-pointer hover:scale-105 transition z-40">
                        <MessageCircle size={26} className="text-[#e91e63]" fill="#e91e63" />
                    </div>
                )} */}
            </div>
        </div>
    );
}
