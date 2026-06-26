/**
 * RoomPostDetailsOverlay — DiscussionRoom variant.
 * Uses position:absolute; inset:0 to fill the roar-inner container exactly.
 * roar-inner is already sized to the visible room area, so no header
 * measurement is needed. Do NOT use this from HomeFeed.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "./AvatarWithBadge";
import { SplitBar } from "./shared";
import { clamp, formatTimeAgo } from "../utils";
import { ChevronLeft, Trash2, X, User, Loader2 } from "lucide-react";

interface Props {
    post: any;
    onClose: (replyCount?: number) => void;
    onToast: (m: string) => void;
    onVote: (id: string, vote: "agree" | "disagree" | null) => void;
    onDeletePost?: (id: string, roomId?: string) => void;
    currentUsername?: string;
    currentAvatarUrl?: string;
    onFanProfileClick?: (fan: any) => void;
}

interface MentionUser {
    userId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    avatarUrl?: string;
    email?: string;
}

export default function RoomPostDetailsOverlay({
    post,
    onClose,
    onToast,
    onVote,
    onDeletePost,
    currentUsername,
    currentAvatarUrl,
    onFanProfileClick,
}: Props) {
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userUsername, setUserUsername] = useState("RoarUser");
    const activeUsername = currentUsername || userUsername;
    const [userBadge, setUserBadge] = useState("RISING_FAN");
    const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
    const [votes, setVotes] = useState<Record<string, boolean | null>>(() =>
        post.userVote ? { [post.id]: post.userVote === "agree" } : {},
    );
    const [pct, setPct] = useState(post.agreePercent ?? 50);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
    const [showMentionPopup, setShowMentionPopup] = useState(false);
    const [mentionIndex, setMentionIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [allUsers, setAllUsers] = useState<MentionUser[]>([]);

    const hasUnderscore = (u: any) => {
        const n = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
        return n.includes("_") || (u.email || "").split("@")[0].includes("_");
    };

    useEffect(() => {
        axios.get("/api/users", { withCredentials: true }).then(res => {
            if (!res.data?.users) return;
            const seen = new Set<string>();
            setAllUsers(res.data.users
                .filter((u: any) => {
                    const n = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
                    return n !== activeUsername && !hasUnderscore(u);
                })
                .map((u: any) => ({ userId: u.userId || u.id, username: u.username, firstName: u.firstName, lastName: u.lastName, name: u.name, avatarUrl: u.avatarUrl || u.avatar, email: u.email }))
                .filter((u: MentionUser) => {
                    const key = u.userId || u.username;
                    if (!key || seen.has(key)) return false;
                    const dn = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
                    if (dn.includes("_")) return false;
                    seen.add(key); return true;
                }));
        }).catch(() => { });
    }, [activeUsername]);

    useEffect(() => {
        try {
            setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
            setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
            setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
        } catch { }
    }, [currentAvatarUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const cur = e.target.selectionStart || 0;
        setCommentText(value); setCursorPosition(cur);
        const before = value.slice(0, cur);
        const at = before.lastIndexOf("@");
        if (at !== -1) {
            const afterAt = before.slice(at + 1);
            if (!afterAt.includes(" ")) {
                const filtered = afterAt.trim() === ""
                    ? allUsers.slice(0, 8)
                    : allUsers.filter(u => `${u.username || ""} ${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`.toLowerCase().includes(afterAt.toLowerCase())).slice(0, 8);
                setMentionUsers(filtered); setShowMentionPopup(filtered.length > 0); setMentionIndex(0); return;
            }
        }
        setShowMentionPopup(false); setMentionUsers([]);
    };

    const insertMention = (user: MentionUser) => {
        const dn = user.username || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email?.split("@")[0] || "user";
        const mt = `@${dn} `;
        const before = commentText.slice(0, cursorPosition);
        const at = before.lastIndexOf("@");
        setCommentText(`${commentText.slice(0, at)}${mt}${commentText.slice(cursorPosition)}`);
        setShowMentionPopup(false); setMentionUsers([]);
        setTimeout(() => { if (inputRef.current) { const p = at + mt.length; inputRef.current.focus(); inputRef.current.setSelectionRange(p, p); } }, 10);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showMentionPopup && mentionUsers.length > 0) {
            if (e.key === "ArrowDown") { e.preventDefault(); setMentionIndex(p => (p + 1) % mentionUsers.length); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setMentionIndex(p => (p - 1 + mentionUsers.length) % mentionUsers.length); }
            else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); if (mentionUsers[mentionIndex]) insertMention(mentionUsers[mentionIndex]); }
            else if (e.key === "Escape") { setShowMentionPopup(false); setMentionUsers([]); }
        } else if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(); }
    };
    console.log("post.roomId:", post.roomId);

    const fetchComments = useCallback(async () => {
        if (!post?.id) return;
        try {
            // const res = await axios.get(`/api/roar/posts/${post.id}/comments`, { params: { roomId: post.roomId } });
            const res = await axios.get(`/api/roar/rooms/${post.roomId}/messages/${post.id}/comments`);
            if (res.data?.success) setComments(res.data.comments);
        } catch { }
    }, [post]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const submitComment = async () => {
        const fullText = replyTo ? `@${replyTo} ${commentText.trim()}` : commentText.trim();
        if (!fullText) return;
        try {
            setLoading(true);
            // const res = await axios.post(`/api/roar/posts/${post.id}/comments`, { text: fullText, roomId: post.roomId });
            const res = await axios.post(`/api/roar/rooms/${post.roomId}/messages/${post.id}/comments`, { text: fullText });
            if (res.data?.success) {
                setCommentText(""); setReplyTo(null); fetchComments(); onToast("Comment posted!");
                setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 400);
            }
        } catch { onToast("Error posting comment"); }
        finally { setLoading(false); }
    };

    const reactToComment = async (commentId: string) => {
        try {
            const res = await axios.post(`/api/roar/posts/${post.id}/comments/${commentId}/react`);
            if (res.data?.success) setComments(p => p.map(c => c.commentId === commentId ? { ...c, heartCount: res.data.heartCount } : c));
        } catch { }
    };

    const userVote = votes[post.id];
    const handleVoteClick = (agree: boolean) => {
        const prev = votes[post.id]; let nextVote: boolean | null = agree;
        if (prev === agree) nextVote = null;
        setVotes(v => ({ ...v, [post.id]: nextVote }));
        let delta = 0;
        if (post.userVote === "agree") delta = nextVote === true ? 0 : nextVote === false ? -8 : -4;
        else if (post.userVote === "disagree") delta = nextVote === true ? 8 : nextVote === false ? 0 : 4;
        else delta = nextVote === true ? 4 : nextVote === false ? -4 : 0;
        setPct(clamp(post.agreePercent + delta, 1, 99));
        onVote(post.id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
    };

    const canSubmit = commentText.trim().length > 0;

    return (
        <AnimatePresence>
            {/*
        Room variant: position:absolute fills the roar-inner container which
        is already the correct size (header hidden, full height for the room).
        No header/nav measurement needed at all.
      */}
            <div className="absolute inset-0 z-[1000] flex flex-col overflow-hidden pointer-events-auto bg-[#050508]">
                {/* Header */}
                <div className="flex items-center gap-[14px] px-5 py-4 border-b border-[#252538] bg-[rgba(5,5,8,0.97)] backdrop-blur-[10px] shrink-0">
                    <button onClick={() => onClose(comments.length)} className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center min-w-9 min-h-9">
                        <ChevronLeft size={22} />
                    </button>
                    <div className="flex flex-col flex-1 min-w-0">
                        <h2 className="text-[12px] font-bold text-white m-0 uppercase tracking-[0.03em]">Post</h2>
                        <p className="text-[9px] text-[#9494AD] mt-0.5 mb-0">
                            Posted by {post.fan?.username || post.authorUsername} • {formatTimeAgo(post.createdAt)} • {comments.length} comments
                        </p>
                    </div>
                </div>

                {/* Scrollable content */}
                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] px-5 pt-4 pb-4 bg-gradient-to-b from-[#050508] to-[#0b0b12]">
                    <div className="p-4 mb-5 bg-white/[0.03] border border-white/[0.06] rounded-[20px]">
                        <div 
                            className="flex gap-2.5 items-center mb-3"
                            style={{ cursor: onFanProfileClick ? "pointer" : "default" }}
                            onClick={(e) => {
                                if (onFanProfileClick) {
                                    e.stopPropagation();
                                    onFanProfileClick(
                                        post.fan || { username: post.authorUsername, badge: post.authorBadge, avatarUrl: post.authorAvatarUrl || post.avatarUrl }
                                    );
                                }
                            }}
                        >
                            <AvatarWithBadge
                                username={post.fan?.username || post.authorUsername}
                                badge={post.fan?.badge || post.authorBadge}
                                size="sm"
                                avatarUrl={post.fan?.avatarUrl || post.authorAvatarUrl || post.avatarUrl || ((post.fan?.username || post.authorUsername) === activeUsername ? userAvatarUrl : undefined)}
                            />
                            <div>
                                <p className="font-bold text-[13px] text-white m-0 flex items-center gap-1">
                                    {post.fan?.username || post.authorUsername}
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block" />
                                </p>
                                <p className="text-[10px] text-[#9494AD] m-0">{formatTimeAgo(post.createdAt)}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-[15px] leading-[1.5] mb-3 text-white">{post.text}</p>
                        {post.type === "debate" && (post.sideA || post.sideB) && (() => {
                            const sideA = post.sideA || "Side A";
                            const sideB = post.sideB || "Side B";
                            const hasVoted = post.userVote === "agree" || post.userVote === "disagree";
                            const votedA = post.userVote === "agree";
                            const votedB = post.userVote === "disagree";

                            return (
                                <div className="mb-3">
                                    <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
                                        {[
                                            { label: sideA, voted: votedA, color: "#E91E8C", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", vote: "agree" as const },
                                            { label: sideB, voted: votedB, color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", vote: "disagree" as const },
                                        ].map(({ label, voted, color, bg, border, vote }, idx) => (
                                            <>
                                                {idx === 1 && (
                                                    <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
                                                        <span className="font-display" style={{ fontSize: 16, color: "#4A4A62" }}>VS</span>
                                                    </div>
                                                )}
                                                <button
                                                    key={vote}
                                                    disabled={hasVoted}
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (hasVoted) return;
                                                        try {
                                                            await axios.post(
                                                                `/api/roar/rooms/${post.roomId}/messages/${post.id}/vote`,
                                                                { vote },
                                                            );
                                                            onVote(post.id, vote);
                                                        } catch { onToast("Failed to submit vote"); }
                                                    }}
                                                    style={{
                                                        flex: 1, padding: "12px", borderRadius: 14, textAlign: "center",
                                                        background: voted ? color : bg,
                                                        border: `2px solid ${voted ? color : border}`,
                                                        color: voted ? "white" : "var(--text-primary)",
                                                        cursor: hasVoted ? "not-allowed" : "pointer",
                                                        transition: "all 0.2s",
                                                        opacity: hasVoted && !voted ? 0.35 : 1,
                                                    }}
                                                >
                                                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
                                                        {voted ? "✓ " : ""}{label}
                                                    </p>
                                                </button>
                                            </>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: 11, marginBottom: 0,
                                        fontWeight: hasVoted ? 600 : 400,
                                        color: hasVoted ? "#E91E8C" : "#4A4A62",
                                        fontStyle: hasVoted ? "normal" : "italic",
                                    }}>
                                        {hasVoted ? "🗳️ You've already voted!" : "Tap a side to vote"}
                                    </p>
                                </div>
                            );
                        })()}
                        {post.mediaUrls?.length > 0 && (
                            <div className="flex flex-col gap-2 mb-3">
                                {post.mediaUrls.map((url: string, idx: number) =>
                                    url.endsWith(".mp4") || url.includes("/video/upload/")
                                        ? <video key={idx} src={url} controls className="w-full max-h-[300px] rounded-xl object-cover" />
                                        : <img key={idx} src={url} alt="" className="w-full max-h-[300px] rounded-xl object-cover" />
                                )}
                            </div>
                        )}
                        {post.type === "hot_take" && (
                            <>
                                <div className="mb-2.5"><SplitBar left={pct} /></div>
                                <div className="flex gap-2 mt-3">
                                    {[{ agree: true, label: "Agree", active: userVote === true, color: "#E91E8C" }, { agree: false, label: "Disagree", active: userVote === false, color: "#FF6B35" }].map(({ agree, label, active, color }) => (
                                        <button key={label} onClick={() => handleVoteClick(agree)} className="flex-1 py-3 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-[220ms] border-[2.5px]"
                                            style={{ borderColor: color, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color }}>
                                            {active ? `✓ ${label}d` : label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex items-center mt-4 border-t border-white/[0.06] pt-3">
                            {(post.fan?.username === activeUsername || post.authorUsername === activeUsername) && (
                                <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Delete this post?")) { onDeletePost?.(post.id, post.roomId); onClose(); } }}
                                    className="flex items-center justify-center bg-transparent border-none cursor-pointer text-[#f87171] ml-auto p-1 rounded-full">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-extrabold text-white tracking-[0.06em] uppercase">Comments</span>
                        <span className="text-[10px] text-[#9494AD]">{comments.length} total</span>
                    </div>

                    <div className="flex flex-col gap-3 pb-2">
                        {comments.length === 0 ? (
                            <p className="text-[13px] text-[#4A4A62] text-center py-5">No comments yet. Be the first!</p>
                        ) : comments.map((comment) => {
                            const isReply = comment.text.trim().startsWith("@");
                            return (
                                <div key={comment.commentId} className={`relative p-3 px-[14px] rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-1.5 ${isReply ? "ml-6" : "ml-0"}`}>
                                    {isReply && <div className="absolute -left-[14px] top-[-12px] bottom-1/2 w-3 border-l-[1.5px] border-b-[1.5px] border-white/[0.12] rounded-bl-lg pointer-events-none" />}
                                    <div className="flex justify-between items-center">
                                        <div 
                                            className="flex gap-2 items-center"
                                            style={{ cursor: onFanProfileClick ? "pointer" : "default" }}
                                            onClick={(e) => {
                                                if (onFanProfileClick) {
                                                    e.stopPropagation();
                                                    onFanProfileClick({
                                                        username: comment.authorUsername,
                                                        badge: comment.authorBadge,
                                                        avatarUrl: comment.authorAvatarUrl || comment.avatarUrl,
                                                    });
                                                }
                                            }}
                                        >
                                            <AvatarWithBadge username={comment.authorUsername} badge={comment.authorBadge} size="sm" avatarUrl={comment.authorAvatarUrl || comment.avatarUrl || (comment.authorUsername === activeUsername ? userAvatarUrl : undefined)} />
                                            <p className="font-bold text-[12px] text-white m-0">{comment.authorUsername}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-[#4A4A62]">{formatTimeAgo(comment.createdAt)}</span>
                                            {comment.authorUsername === activeUsername && (
                                                <button onClick={async (e) => { e.stopPropagation(); if (window.confirm("Delete comment?")) { try { await axios.delete(`/api/roar/posts/${post.id}/comments/${comment.commentId}`); onToast("Deleted"); fetchComments(); } catch { onToast("Failed"); } } }}
                                                    className="bg-transparent border-none text-[#f87171] cursor-pointer flex items-center p-0.5"><Trash2 size={12} /></button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-[#F5F5FA] leading-[1.4] my-1">{comment.text}</p>
                                    <div className="flex gap-[14px] items-center mt-1">
                                        <button onClick={() => reactToComment(comment.commentId)} className={`bg-transparent border-none cursor-pointer flex items-center gap-1 text-[12px] p-0 ${comment.heartCount > 0 ? "text-white" : "text-[#4A4A62]"}`}>
                                            🤍 {comment.heartCount ?? 0}
                                        </button>
                                        <button onClick={() => { setReplyTo(comment.authorUsername); setCommentText(""); setTimeout(() => inputRef.current?.focus(), 50); }}
                                            className="bg-transparent border-none cursor-pointer text-[11px] text-[#4A4A62] font-semibold p-0">Reply</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Composer */}
                <div className="shrink-0 bg-[rgba(5,5,8,0.97)] border-t border-[#252538] relative z-10 pb-2">
                    {replyTo && (
                        <div className="flex items-center gap-1.5 px-4 pt-1.5">
                            <span className="text-[11px] text-[#9494AD]">Replying to</span>
                            <span className="inline-flex items-center gap-1 bg-[rgba(233,30,140,0.15)] border border-[rgba(233,30,140,0.35)] rounded-full py-0.5 pl-1.5 pr-2 text-[12px] font-bold text-[#E91E8C] max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
                                @{replyTo}
                                <button onClick={() => { setReplyTo(null); setCommentText(""); }} className="bg-transparent border-none p-0 cursor-pointer text-[#E91E8C] flex items-center ml-0.5 shrink-0"><X size={11} /></button>
                            </span>
                        </div>
                    )}
                    {showMentionPopup && mentionUsers.length > 0 && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#181c24] rounded-2xl border border-[rgba(200,112,90,0.2)] overflow-hidden z-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[300px] overflow-y-auto">
                            {mentionUsers.map((user, idx) => {
                                const dn = user.username || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email?.split("@")[0] || "user";
                                return (
                                    <button key={user.userId} onClick={() => insertMention(user)} onMouseEnter={() => setMentionIndex(idx)}
                                        className={`flex items-center gap-3 px-4 py-2.5 w-full border-none cursor-pointer transition-colors duration-150 ${idx === mentionIndex ? "bg-[rgba(200,112,90,0.15)]" : "bg-transparent"}`}>
                                        <AvatarWithBadge username={dn} badge="RISING_FAN" size="sm" avatarUrl={user.avatarUrl} />
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-[13px] text-white m-0">{dn}</p>
                                            {user.email && <p className="text-[10px] text-[#7a6a65] m-0">{user.email}</p>}
                                        </div>
                                        <User size={14} className="text-[#c8705a]" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    <p className="px-5 pt-2 pb-0 m-0 text-[10px] text-[#7a6a65]">Type @ to mention someone</p>
                    <div className="flex gap-2 items-center px-4 pt-1.5 pb-1">
                        <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" avatarUrl={userAvatarUrl} />
                        <div className="flex-1">
                            <input ref={inputRef} type="text" placeholder={replyTo ? "Write your reply…" : "Share your opinion..."} value={commentText}
                                onChange={handleInputChange} onKeyDown={handleKeyDown}
                                className="w-full h-10 rounded-full bg-[#0E0E14] border border-[#252538] pl-4 pr-4 text-white text-[16px] outline-none" />
                        </div>
                        <button onClick={submitComment} disabled={loading || !canSubmit}
                            className={`w-[38px] h-[38px] rounded-full bg-[#E91E8C] border-none text-white flex items-center justify-center shrink-0 transition-opacity duration-200 ${canSubmit ? "cursor-pointer opacity-100" : "cursor-default opacity-50"}`}>
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "↑"}
                        </button>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}