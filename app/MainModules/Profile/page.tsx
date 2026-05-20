"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit2, MapPin, Calendar,
  Link as LinkIcon, Globe, User,
  MessageSquare, ThumbsUp, Users, Radio,
  Camera, Check, Share2, MoreHorizontal,
} from "lucide-react";

/* ════════════════════════════════════════════
   TOKENS — matches the reference UI exactly
   • BG: very dark warm charcoal
   • CARD: barely-lighter surface, no hard borders
   • No blue tint anywhere
════════════════════════════════════════════ */

const BG    = "#070809";   // darker like reference
const CARD  = "#0B0C10";
const INNER = "#121317";
const TXT   = "#f3f3f7";
const SUB   = "#a1a1af";
const MUTED = "#676777";
const PINK  = "#e8437a";
const GRAD  = "linear-gradient(90deg,#e8437a,#f4732a)";
const R     = 14;

/* card: NO visible border — just bg contrast */
const card = (
 extra: React.CSSProperties={}
):React.CSSProperties=>({
 background:CARD,
 borderRadius:R,
 border:"1px solid rgba(255,255,255,0.015)",
 boxShadow:
"0 8px 24px rgba(0,0,0,0.28)",
 ...extra
});

const inputBase: React.CSSProperties = {
  background: INNER,
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 8, color: TXT, outline: "none",
  width: "100%", padding: "8px 12px",
  fontSize: 13, boxSizing: "border-box",
};

function deriveHandle(name: string): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g,"").replace(/[^a-z0-9]/g,"");
  return `@${slug||"user"}fan360`;
}

/* ── Avatar ── */
function Av({ src, name, sz = 38 }: { src:string; name:string; sz?:number }) {
  return (
    <div style={{
      width:sz, height:sz, borderRadius:"50%", flexShrink:0,
      overflow:"hidden", background:GRAD,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:sz*0.38, fontWeight:700, color:"#fff",
    }}>
      {src ? <img src={src} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ── Section heading with pink bar ── */
function SH({ title, right }: { title:string; right?:React.ReactNode }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:3,height:17,background:PINK,borderRadius:2}}/>
        <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{title}</span>
      </div>
      {right}
    </div>
  );
}

/* ── Social icons — inline SVG, zero imports ── */
function SocialIcon({ icon }:{ icon:string }) {
  const s:React.CSSProperties = {
    width:32,height:32,borderRadius:"50%",background:"#0F1014",
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
  };
  const ig = <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="#f4732a"/>
    <defs><linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
      <stop stopColor="#f4732a"/><stop offset="1" stopColor="#e8437a"/>
    </linearGradient></defs>
  </svg>;
  const xIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="#aaa">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>;
  const yt = <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4444">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.3 5 12 5 12 5s-4.3 0-6.9.1c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.3 0 6.9-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.7 2.8-5.7 2.7z"/>
  </svg>;
  return <div style={s}>{icon==="ig"?ig:icon==="x"?xIcon:yt}</div>;
}

/* ── ExternalLink icon ── */
const ExtLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function ProfilePage() {
  const [isEditing, setIsEditing]   = useState(false);
  const [activeTab, setActiveTab]   = useState("Posts");
  const [isMobile, setIsMobile]     = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [profile, setProfile] = useState({
    name:        "Rohit Sharma",
    handle:      "@rohitfan360",
    avatar:      "",
    subtitle:    "Sports lover | Cricket fanatic | Live to watch, live to react!",
    description: "Die-hard cricket fan who lives for the big moments! 🏏 Follow live matches, join watch rooms, react in real-time and connect with fans across the globe.",
    location:    "Mumbai, India",
    joinedDate:  "May 2024",
    website:     "sportsfan360.com",
    stats:       { following: 128, followers: "2.3K", following2: 186 },
    interests:   ["Cricket","Football","Tennis","F1","eSports"],
    favoriteTeams: [
      { name:"Mumbai Indians",    league:"IPL",      liked:true,  initial:"MI", color:"#0a4f8c" },
      { name:"India",             league:"Cricket",  liked:true,  initial:"IN", color:"#c47a1a" },
      { name:"Manchester United", league:"Football", liked:false, initial:"MU", color:"#9a1f1f" },
      { name:"Mercedes AMG",      league:"F1",       liked:false, initial:"M",  color:"#007a70" },
    ],
    socialLinks: [
      { platform:"Instagram", handle:"rohitfan360", icon:"ig" },
      { platform:"X",         handle:"rohitfan360", icon:"x"  },
      { platform:"YouTube",   handle:"RohitFan360", icon:"yt" },
    ],
  });

  const [editForm, setEditForm] = useState({...profile});
  const disp = isEditing ? editForm : profile;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const {name,value} = e.target;
    setEditForm(prev => {
      const u = {...prev,[name]:value};
      if (name==="name") {
        u.handle = deriveHandle(value);
        const slug = value.trim().toLowerCase().replace(/\s+/g,"").replace(/[^a-z0-9]/g,"")||"user";
        u.socialLinks = prev.socialLinks.map((l,i)=>({
          ...l,
          handle: i===2 ? slug.charAt(0).toUpperCase()+slug.slice(1)+"Fan360" : `${slug}fan360`,
        }));
      }
      return u;
    });
  };

  const save   = () => { setProfile({...editForm}); setIsEditing(false); };
  const cancel = () => { setEditForm({...profile}); setIsEditing(false); };
  const handleImg = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setEditForm(p=>({...p,avatar:URL.createObjectURL(f)}));
  };

  const tabs = ["Posts","Live Reactions","Comments","Following"];

  const chips = [
    {bg:"rgba(232,67,122,0.14)", color:"#e8437a", bdr:"rgba(232,67,122,0.28)"},
    {bg:"rgba(244,115,42,0.14)", color:"#f4732a", bdr:"rgba(244,115,42,0.28)"},
    {bg:"rgba(139,92,246,0.14)", color:"#9b7ef8", bdr:"rgba(139,92,246,0.28)"},
    {bg:"rgba(56,124,220,0.14)", color:"#5b9ae8", bdr:"rgba(56,124,220,0.28)"},
    {bg:"rgba(34,180,100,0.14)", color:"#38b46e", bdr:"rgba(34,180,100,0.28)"},
  ];

  const tabIcons: Record<string,React.ReactNode> = {
    "Posts":          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    "Live Reactions": <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.49-.01a6 6 0 0 1 0-8.49"/></svg>,
    "Comments":       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    "Following":      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  };

  /* ── responsive column widths ── */
  const col1 = isMobile ? "1fr" : "230px 1fr";
  const col2 = isMobile ? "1fr" : "1fr 264px";

  /* ── Sidebar content (shared between desktop sidebar + mobile stacked) ── */
  const Sidebar = () => (
    <div style={{
display:"flex",
flexDirection:"column",
gap:"8px"
}}>

      {/* INTERESTS */}
     <div
style={{
 ...card(),
 padding:"18px",
 display:"flex",
 flexDirection:"column"
}}
>
        <SH title="Interests"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {profile.interests.map((interest,i)=>{
            const c=chips[i%chips.length];
            return (
              <span key={interest} style={{
                padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:600,
                background:c.bg,color:c.color,boxShadow:`0 0 10px ${c.bg}`,
              }}>{interest}</span>
            );
          })}
        </div>
      </div>

      {/* FAVORITE TEAMS */}
      <div
style={{
...card(),
padding:"18px",
marginTop:"2px",
minHeight:"180px"
}}
>
        <SH title="Favorite Teams"
          right={<button style={{fontSize:12,color:PINK,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Edit</button>}
        />
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {profile.favoriteTeams.map((team,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:11}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:team.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>
                  {team.initial}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:TXT}}>{team.name}</div>
                  <div style={{fontSize:11,color:MUTED}}>{team.league}</div>
                </div>
              </div>
              <span style={{fontSize:16}}>{team.liked?"❤️":"🤍"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div style={{...card(),padding:18}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>Social Links</div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {profile.socialLinks.map((link,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <SocialIcon icon={link.icon}/>
                <span style={{fontSize:13,color:SUB,fontWeight:500}}>{link.handle}</span>
              </div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:MUTED,display:"flex"}}>
                <ExtLink/>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:BG,color:TXT,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",fontSize:14}}>

      {/* ── TOPBAR ── */}
      <div style={{position:"sticky",top:0,zIndex:50,background:BG,borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"12px 24px"}}>
        <Link href="/MainModules/HomePage" style={{display:"inline-flex",alignItems:"center",gap:7,color:"#9090a8",textDecoration:"none",fontSize:13,fontWeight:500}}>
          <ArrowLeft size={15}/> Back
        </Link>
      </div>

      {/* ── PAGE ── */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:isMobile?"16px 14px 60px":"24px 24px 72px"}}>

        {/* ══ ROW 1: Profile card  |  About + Fan Stats ══ */}
        <div style={{
          display:"grid",
          gridTemplateColumns:col1,
          gap:"18px",
alignItems:"stretch",
        }}>

          {/* LEFT — Profile identity */}
          <div style={{...card(),padding:"24px 18px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>

            {/* Avatar with gradient ring */}
            <div style={{position:"relative",marginBottom:14}}>
              <div style={{width:104,height:104,borderRadius:"50%",padding:2.5,background:GRAD}}>
                <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",background:CARD}}>
                  <Av src={disp.avatar} name={disp.name} sz={99}/>
                </div>
              </div>
              {!isEditing ? (
                <button onClick={()=>setIsEditing(true)} style={{position:"absolute",bottom:2,right:2,width:28,height:28,borderRadius:"50%",background:PINK,border:`2.5px solid ${BG}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <Edit2 size={11} color="#fff"/>
                </button>
              ):(
                <button onClick={()=>fileInputRef.current?.click()} style={{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(0,0,0,0.55)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer"}}>
                  <Camera size={19} color={PINK}/>
                  <span style={{fontSize:8,color:"#fff",marginTop:3,textTransform:"uppercase",letterSpacing:1}}>Change</span>
                  <input type="file" ref={fileInputRef} style={{display:"none"}} accept="image/*" onChange={handleImg}/>
                </button>
              )}
            </div>

            {/* Name */}
            {isEditing
              ? <input name="name" value={editForm.name} onChange={handleChange} style={{...inputBase,textAlign:"center",fontWeight:700,fontSize:15,marginBottom:5}}/>
              : <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:3,letterSpacing:0.2}}>{profile.name}</div>
            }

            {/* Handle */}
            <div style={{fontSize:12,color:MUTED,marginBottom:8}}>{disp.handle}</div>

            {/* Subtitle */}
            {isEditing
              ? <input name="subtitle" value={editForm.subtitle} onChange={handleChange} style={{...inputBase,textAlign:"center",fontSize:12,marginBottom:14}}/>
              : <div style={{fontSize:12,color:"#6e6e82",lineHeight:1.6,marginBottom:16}}>{profile.subtitle}</div>
            }

            {/* Stats */}
            <div style={{display:"flex",justifyContent:"space-around",width:"100%",marginBottom:16,paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              {[
                {v:profile.stats.following, l:"Following"},
                {v:profile.stats.followers, l:"Followers"},
                {v:profile.stats.following2,l:"Following"},
              ].map((s,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#fff",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:10,color:MUTED,marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            {isEditing ? (
              <div style={{display:"flex",gap:8,width:"100%"}}>
                <button onClick={cancel} style={{flex:1,padding:"8px 0",borderRadius:50,fontSize:12,fontWeight:600,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:SUB,cursor:"pointer"}}>Cancel</button>
                <button onClick={save} style={{flex:1,padding:"8px 0",borderRadius:50,fontSize:12,fontWeight:700,background:GRAD,border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <Check size={12}/> Save
                </button>
              </div>
            ):(
              <button onClick={()=>setIsEditing(true)} style={{width:"100%",padding:"9px 0",borderRadius:50,fontSize:13,fontWeight:700,background:GRAD,border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <Edit2 size={13}/> Edit Profile
              </button>
            )}
          </div>

          {/* RIGHT — About + Fan Stats */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* ABOUT */}
            <div style={{...card(),padding:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:17,background:PINK,borderRadius:2}}/>
                  <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>About</span>
                </div>
                <User size={14} color={PINK}/>
              </div>

              {isEditing ? (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div>
                    <label style={{fontSize:10,color:MUTED,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>Description</label>
                    <textarea name="description" value={editForm.description} onChange={handleChange} rows={3}
                      style={{...inputBase,resize:"none",lineHeight:1.6}}
                      onFocus={e=>(e.target.style.borderColor=PINK)}
                      onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.07)")}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[
                      {name:"location",Icon:MapPin,   val:editForm.location,  label:"Location"},
                      {name:"website", Icon:LinkIcon, val:editForm.website,   label:"Website"},
                    ].map(({name,Icon,val,label})=>(
                      <div key={name}>
                        <label style={{fontSize:10,color:MUTED,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>{label}</label>
                        <div style={{position:"relative"}}>
                          <Icon size={12} color={MUTED} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                          <input name={name} value={val} onChange={handleChange}
                            style={{...inputBase,paddingLeft:28}}
                            onFocus={e=>(e.target.style.borderColor=PINK)}
                            onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.07)")}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ):(
                <>
                  <p style={{fontSize:13,color:SUB,lineHeight:1.7,marginBottom:16}}>{profile.description}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 28px"}}>
                    {[
                      {Icon:MapPin,   text:profile.location},
                      {Icon:Calendar, text:`Joined ${profile.joinedDate}`},
                      {Icon:LinkIcon, text:profile.website},
                      {Icon:Globe,    text:"Public Profile"},
                    ].map(({Icon,text},i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:SUB}}>
                        <Icon size={12} color={PINK} style={{flexShrink:0}}/> {text}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FAN STATS */}
            <div style={{...card(),padding:20}}>
              <SH title="Fan Stats"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {[
                  {Icon:MessageSquare, val:"340",  lbl:"Comments",      c:"#8b5cf6"},
                  {Icon:ThumbsUp,      val:"1.2K", lbl:"Reactions",     c:"#d97706"},
                  {Icon:Users,         val:"56",   lbl:"Rooms Joined",  c:"#3b82f6"},
                  {Icon:Radio,         val:"78",   lbl:"Live Sessions", c:PINK},
                ].map(({Icon,val,lbl,c},i)=>(
                  <div key={i} style={{background:"#0F1014",borderRadius:10,padding:"14px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <Icon size={17} color={c}/>
                    <span style={{fontSize:19,fontWeight:800,color:"#fff",lineHeight:1}}>{val}</span>
                    <span style={{fontSize:10,color:MUTED,textAlign:"center",lineHeight:1.3}}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>{/* end Row 1 */}

        {/* ══ ROW 2: Posts feed  |  Sidebar ══
            Sidebar contains Interests + Teams + Social — no gap issues
        ════════════════════════════════════════════════ */}
       <div style={{
display:"grid",
gridTemplateColumns:col2,
gap:"18px",
alignItems:"stretch"
}}>

          {/* LEFT — Posts + Tabs */}
          <div style={{
display:"flex",
flexDirection:"column",
gap:"10px"
}}>

            {/* TABS — plain bar, no card border, just a bottom line */}
            <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:0}}>
              {tabs.map(tab=>(
                <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                  display:"flex",alignItems:"center",gap:5,
                  padding:"11px 14px",fontSize:12,fontWeight:600,
                  background:"none",border:"none",cursor:"pointer",
                  color:activeTab===tab?PINK:MUTED,
                  position:"relative",transition:"color .15s",
                  whiteSpace:"nowrap",
                }}>
                  <span style={{opacity: activeTab===tab?1:0.5}}>{tabIcons[tab]}</span>
                  {tab}
                  {activeTab===tab && <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:PINK,borderRadius:"2px 2px 0 0"}}/>}
                </button>
              ))}
            </div>

            {/* POST 1 */}
            <div style={{...card(),padding:18}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{position:"relative"}}>
                    <Av src={profile.avatar} name={profile.name} sz={40}/>
                    <div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:"#22c55e",border:`2px solid ${CARD}`}}/>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:TXT}}>{profile.name}</div>
                    <div style={{fontSize:11,color:MUTED}}>{profile.handle} · 2h ago</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:"rgba(232,67,122,0.12)",color:PINK,border:"1px solid rgba(232,67,122,0.22)"}}>📌 Pinned</span>
                  <button style={{background:"none",border:"none",cursor:"pointer",color:MUTED,display:"flex"}}><MoreHorizontal size={15}/></button>
                </div>
              </div>
              <p style={{fontSize:13,color:SUB,lineHeight:1.65,marginBottom:13}}>
                What a match! India showed pure class under pressure. 💙<br/>This is why we love cricket! 🏏🔥
              </p>
              {/* Match card */}
              <div style={{background:"#0F1014",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"#0f3e7a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🇮🇳</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:800,color:TXT}}>IND 198/7</div>
                    <div style={{fontSize:10,color:MUTED}}>20 Overs</div>
                  </div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:"rgba(232,67,122,0.13)",color:PINK,border:"1px solid rgba(232,67,122,0.26)",display:"inline-block",marginBottom:4}}>LIVE</div>
                  <div style={{fontSize:10,color:"#6e6e82"}}>India won by 7 runs</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:9,flexDirection:"row-reverse"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"#1a4d28",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🇦🇺</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:800,color:TXT}}>AUS 191/9</div>
                    <div style={{fontSize:10,color:MUTED}}>20 Overs</div>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:18,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                {[{Icon:ThumbsUp,n:256},{Icon:MessageSquare,n:48},{Icon:Share2,n:12}].map(({Icon,n},i)=>(
                  <button key={i} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:MUTED,fontSize:12,fontWeight:500}}>
                    <Icon size={13}/> {n}
                  </button>
                ))}
              </div>
            </div>

            {/* POST 2 */}
            <div style={{...card(),padding:18}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Av src={profile.avatar} name={profile.name} sz={40}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:TXT}}>{profile.name}</div>
                    <div style={{fontSize:11,color:MUTED}}>{profile.handle} · 1d ago</div>
                  </div>
                </div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:MUTED,display:"flex"}}><MoreHorizontal size={15}/></button>
              </div>
              <p style={{fontSize:13,color:SUB,lineHeight:1.65,marginBottom:13}}>
                RCB all the way! ❤️🖤<br/>Ee Sala Cup Namde! 🏆
              </p>
              <div style={{borderRadius:10,overflow:"hidden",marginBottom:13,height:190,background:"linear-gradient(145deg,#4a0808,#8c1212,#b81a1a)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 60%,rgba(200,30,30,0.25) 0%,transparent 65%)"}}/>
                <span style={{fontSize:48,opacity:0.45}}>🏏</span>
              </div>
              <div style={{display:"flex",gap:18,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                {[{Icon:ThumbsUp,n:189},{Icon:MessageSquare,n:36},{Icon:Share2,n:8}].map(({Icon,n},i)=>(
                  <button key={i} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:MUTED,fontSize:12,fontWeight:500}}>
                    <Icon size={13}/> {n}
                  </button>
                ))}
              </div>
            </div>

          </div>{/* end posts */}

          {/* RIGHT — Sidebar (desktop only; mobile shows below) */}
          {!isMobile && (
  <div>
    <Sidebar/>
  </div>
)}

        </div>{/* end Row 2 */}

        {/* Mobile: show sidebar below posts */}
        {isMobile && <div style={{marginTop:14}}><Sidebar/></div>}

        {/* ── INVITE YOUR FRIENDS ── flush below, no extra gap ── */}
        <div style={{
          marginTop:14,
          ...card(),
          padding:"18px 22px",
          display:"flex",alignItems:"center",gap:16,
        }}>
          <div style={{
            width:44,height:44,borderRadius:"50%",
            background:"rgba(232,67,122,0.08)",
            border:"1px solid rgba(232,67,122,0.16)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            <Users size={19} color={PINK}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:TXT,marginBottom:3}}>Invite Your Friends</div>
            <div style={{fontSize:12,color:MUTED,lineHeight:1.5}}>Invite your friends to join live rooms and enjoy the game together!</div>
          </div>
          <button style={{
            padding:"9px 20px",borderRadius:50,fontSize:12,fontWeight:700,
            background:GRAD,border:"none",color:"#fff",cursor:"pointer",
            display:"flex",alignItems:"center",gap:6,flexShrink:0,
          }}>
            <Share2 size={12}/> Invite Friends
          </button>
        </div>

      </div>
    </div>
  );
}
