"use client";

import { useEffect, useRef } from 'react';

export default function CircleCricketGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the HTML content dynamically
    if (containerRef.current) {
      // Create a style element for the game
      const style = document.createElement('style');
      style.textContent = `
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;user-select:none}
        :root{
          --bg:#05080f;--bg3:#0d1324;
          --green:#22c55e;--amber:#f59e0b;--red:#ef4444;--blue:#3b82f6;
          --text:#f1f5f9;--muted:#475569;--border:#1e293b;
        }
        html,body{background:var(--bg);height:100%;overflow-x:hidden;overscroll-behavior:none}
        body{font-family:'Rajdhani',sans-serif;color:var(--text);display:flex;flex-direction:column;align-items:center}

        /* ── TOSS SCREEN ── */
        #tossScreen{width:100%;max-width:500px;display:flex;flex-direction:column;align-items:center;padding:20px 16px;gap:14px}
        #tossLogo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:4px;color:var(--green);text-align:center;line-height:1}
        #tossLogo small{display:block;font-size:11px;font-family:'Rajdhani',sans-serif;letter-spacing:4px;color:var(--muted);font-weight:500}
        #tossSub{font-size:13px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase}
        #tossCards{display:flex;gap:12px;width:100%}
        .tcard{flex:1;background:var(--bg3);border:2px solid var(--border);border-radius:16px;padding:20px 12px;text-align:center;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .tcard:hover,.tcard:active{transform:translateY(-3px)}
        .tcard.bat{border-color:#d97706}
        .tcard.bat:hover{background:#1c1108;box-shadow:0 0 24px rgba(217,119,6,0.3)}
        .tcard.chase{border-color:#3b82f6}
        .tcard.chase:hover{background:#080e1c;box-shadow:0 0 24px rgba(59,130,246,0.3)}
        .tcard-icon{font-size:44px;margin-bottom:10px}
        .tcard-title{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;line-height:1;margin-bottom:6px}
        .tcard.bat .tcard-title{color:#f59e0b}
        .tcard.chase .tcard-title{color:#60a5fa}
        .tcard-desc{font-size:11px;color:#94a3b8;line-height:1.6;font-weight:500}
        .tcard-badge{position:absolute;top:10px;right:10px;font-size:8px;letter-spacing:1px;font-weight:700;padding:3px 7px;border-radius:4px}
        .tcard.bat .tcard-badge{background:#78350f;color:#fcd34d}
        .tcard.chase .tcard-badge{background:#1e3a8a;color:#93c5fd}
        #tossInfo{font-size:11px;color:#64748b;letter-spacing:1px;text-align:center;line-height:1.7}
        #tossFoot{font-size:9px;color:#475569;letter-spacing:2px}
        .toss-section{width:100%;display:flex;flex-direction:column;gap:6px}
        .toss-section-lbl{font-size:9px;color:#64748b;letter-spacing:3px;font-weight:700;text-transform:uppercase}
        .pill-row{display:flex;gap:6px}
        .pill{flex:1;padding:8px 4px;border:1.5px solid #1e293b;border-radius:8px;background:#0d1324;text-align:center;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;color:#64748b;transition:border-color .18s,background .18s,color .18s;line-height:1.3}
        .pill-sub{font-family:'Rajdhani',sans-serif;font-size:8px;font-weight:600;letter-spacing:1px;opacity:.7;display:block;margin-top:2px}

        /* ── GAME SCREEN ── */
        #gameScreen{display:none;width:100%;flex-direction:column;align-items:center}
        #header{width:100%;max-width:500px;display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px 4px}
        #logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:var(--green);line-height:1}
        #logo small{display:block;font-family:'Rajdhani',sans-serif;font-size:8px;color:#64748b;letter-spacing:3px;font-weight:500}
        #modeBadge{font-size:9px;font-weight:700;letter-spacing:2px;padding:3px 9px;border-radius:5px}
        #modeBadge.bat{background:#78350f;color:#fcd34d}
        #modeBadge.chase{background:#1e3a8a;color:#93c5fd}
        #chaseBar{display:none;width:100%;max-width:500px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:8px 14px;margin:0 10px 4px;position:relative;overflow:hidden}
        #chaseBarFill{position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,#1e3a8a,#3b82f6);border-radius:10px;transition:width .5s;opacity:0.35}
        #chaseBarContent{position:relative;display:flex;justify-content:space-between;align-items:center}
        #chaseTarget{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:#93c5fd}
        #chaseNeed{font-size:11px;color:#60a5fa;font-weight:700;letter-spacing:1px}
        #chaseRR{font-size:10px;color:#94a3b8;font-weight:600}
        #board{width:100%;max-width:500px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:0 10px 5px}
        .sc{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:6px 4px;text-align:center}
        .sc-v{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;display:block;line-height:1}
        .sc-l{font-size:8px;color:#94a3b8;letter-spacing:2px;font-weight:700}
        #wrap{position:relative;width:min(96vw,460px);height:min(96vw,460px);touch-action:none}
        #gc{width:100%;height:100%;display:block;touch-action:none}
        #cdBox{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;z-index:20}
        #cdNum{font-family:'Bebas Neue',sans-serif;font-size:110px;letter-spacing:2px;color:#fff;line-height:1;opacity:0;transition:opacity 0.15s;text-shadow:0 0 60px rgba(34,197,94,0.7)}
        #cdSub{font-size:11px;letter-spacing:4px;color:var(--muted);margin-top:-4px;font-weight:700;opacity:0}
        #popBox{position:absolute;top:16%;left:50%;transform:translateX(-50%);pointer-events:none;z-index:15;display:none;text-align:center}
        #popScore{font-family:'Bebas Neue',sans-serif;font-size:46px;letter-spacing:2px;line-height:1}
        #popLabel{font-size:10px;letter-spacing:3px;font-weight:700;margin-top:2px}
        #matchOver{position:absolute;inset:0;display:none;align-items:center;justify-content:center;z-index:25;pointer-events:none;background:rgba(5,8,15,0.8)}
        #moCard{background:var(--bg3);border-radius:20px;padding:22px 30px;text-align:center;min-width:240px}
        #moCard .mo-lbl{font-size:9px;letter-spacing:4px;color:#94a3b8;font-weight:700}
        #moCard .mo-big{font-family:'Bebas Neue',sans-serif;font-size:72px;line-height:1}
        #moCard .mo-sub{font-size:12px;color:#94a3b8;letter-spacing:1px;margin-top:2px}
        #moCard .mo-extra{font-family:'Bebas Neue',sans-serif;font-size:18px;margin-top:8px;letter-spacing:1px}
        #tracker{width:100%;max-width:500px;padding:5px 10px 3px;display:flex;align-items:center;gap:6px}
        #tlbl{font-size:9px;color:#94a3b8;letter-spacing:2px;font-weight:700;white-space:nowrap}
        #bRow{display:flex;gap:3px;flex-wrap:wrap;flex:1}
        .bb{width:26px;height:26px;border-radius:50%;border:1.5px solid var(--border);background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#64748b;font-family:'Bebas Neue',sans-serif;transition:all .25s}
        .bb.now{border-color:var(--green);background:#052e16;animation:bbp .8s infinite alternate}
        @keyframes bbp{from{box-shadow:0 0 4px rgba(34,197,94,0.3)}to{box-shadow:0 0 14px rgba(34,197,94,0.6)}}
        .bb.dot{background:var(--bg3);color:#334155;border-color:#0f172a}
        .bb.r1{background:#164e63;color:#67e8f9;border-color:#0891b2}
        .bb.r2{background:#78350f;color:#fcd34d;border-color:#d97706}
        .bb.r3{background:#4c1d95;color:#c4b5fd;border-color:#7c3aed}
        .bb.r4{background:#1e3a8a;color:#93c5fd;border-color:#2563eb}
        .bb.r6{background:#14532d;color:#86efac;border-color:#16a34a}
        .bb.wkt{background:#7f1d1d;color:#fca5a5;border-color:#dc2626}
        #msgRow{width:100%;max-width:500px;padding:3px 12px;text-align:center;min-height:20px}
        #msgTxt{font-size:12px;color:#cbd5e1;letter-spacing:.4px;font-weight:600}
        #btns{display:flex;gap:6px;padding:5px 10px;width:100%;max-width:500px}
        .btn{flex:1;padding:9px 0;border:none;border-radius:9px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;letter-spacing:2px;cursor:pointer;transition:transform .1s,opacity .1s}
        .btn:active{opacity:.8;transform:scale(.97)}
        #btnR{background:var(--green);color:#fff}
        #btnT{background:var(--bg3);color:#94a3b8;border:1px solid var(--border)}
        #btnH{background:var(--bg3);color:#94a3b8;border:1px solid var(--border)}
        #howBox{display:none;width:100%;max-width:500px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;margin:0 0 6px;font-size:11px;line-height:1.9;color:#cbd5e1}
        #howBox h3{font-family:'Bebas Neue',sans-serif;color:var(--green);font-size:16px;letter-spacing:2px;margin-bottom:5px}
        #howBox ul{padding-left:14px}
        .zrow{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
        .ztag{display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:#cbd5e1}
        .zd{width:11px;height:11px;border-radius:3px}
        #foot{padding:6px;font-size:9px;color:#475569;letter-spacing:2px}
        #foot a{color:#22c55e;text-decoration:none;letter-spacing:2px;font-weight:700}
        #foot a:hover{color:#4ade80}
        #btnMute{background:var(--bg3);color:#94a3b8;border:1px solid var(--border)}
        #btnMute.muted{background:#1f0808;color:#fca5a5;border-color:#ef4444}
        #streakBadge{position:absolute;top:12%;right:4%;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;background:rgba(251,191,36,0.15);border:1px solid #f59e0b;color:#fbbf24;padding:3px 8px;border-radius:6px;pointer-events:none;z-index:14;display:none}
        #pressureBar{display:none;width:100%;max-width:500px;padding:0 10px 3px}
        #pressureInner{height:4px;border-radius:2px;background:linear-gradient(90deg,#22c55e,#f59e0b,#ef4444);position:relative;overflow:hidden}
        #pressureNeedle{position:absolute;top:-2px;width:8px;height:8px;border-radius:50%;background:#fff;border:1.5px solid #0d1324;transition:left .4s;transform:translateX(-50%)}
        #pressureLbl{font-size:8px;color:#64748b;letter-spacing:2px;text-align:right;margin-top:2px;font-weight:700}
      `;
      document.head.appendChild(style);

      // Load Google Fonts
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Create the HTML structure
      const container = containerRef.current;
      container.innerHTML = `
        <!-- TOSS SCREEN -->
        <div id="tossScreen">
          <div id="tossBrand" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:4px">
            <img src="https://www.sportsfan360.com/assets/images/logo.png"
                 alt="sportsfan360"
                 id="sf360Logo"
                 style="height:44px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(34,197,94,0.35))"
                 onerror="this.style.display='none'">
            <div id="tossLogo">Circle Cricket<small>PRO EDITION</small></div>
          </div>
          <div id="tossSub">Choose Your Mode</div>

          <div id="tossCards">
            <div class="tcard bat" onclick="window.selectMode('bat')">
              <div class="tcard-badge">1ST INNINGS</div>
              <div class="tcard-icon">🏏</div>
              <div class="tcard-title">BAT</div>
              <div class="tcard-desc">Score as many runs as possible in 12 balls. Set the target.</div>
            </div>
            <div class="tcard chase" onclick="window.selectMode('chase')">
              <div class="tcard-badge">2ND INNINGS</div>
              <div class="tcard-icon">🎯</div>
              <div class="tcard-title">CHASE</div>
              <div class="tcard-desc">Chase a realistic target. Beat the score to WIN the match!</div>
            </div>
          </div>

          <div class="toss-section">
            <div class="toss-section-lbl">Difficulty</div>
            <div class="pill-row">
              <button class="pill" id="dEasy" onclick="window.setDiff('easy')">EASY<br><span class="pill-sub">Slow ball</span></button>
              <button class="pill" id="dMedium" onclick="window.setDiff('medium')">MEDIUM<br><span class="pill-sub">Real pace</span></button>
              <button class="pill" id="dHard" onclick="window.setDiff('hard')">HARD<br><span class="pill-sub">Fast &amp; furious</span></button>
            </div>
          </div>
          <div class="toss-section">
            <div class="toss-section-lbl">Format</div>
            <div class="pill-row">
              <button class="pill" id="fT5" onclick="window.setFmt(5,2)">T5<br><span class="pill-sub">5 balls · 2 wkts</span></button>
              <button class="pill" id="fT10" onclick="window.setFmt(10,2)">T10<br><span class="pill-sub">10 balls · 2 wkts</span></button>
              <button class="pill" id="fT20" onclick="window.setFmt(20,3)">T20<br><span class="pill-sub">20 balls · 3 wkts</span></button>
            </div>
          </div>
          <div id="tossInfo">Choose mode, then pick difficulty &amp; format</div>
          <div id="tossFoot"><a href="https://sportsfan360.com" target="_blank" style="color:#22c55e;text-decoration:none;font-weight:700;letter-spacing:2px">sportsfan360.com</a> — Circle Cricket PRO</div>
        </div>

        <!-- GAME SCREEN -->
        <div id="gameScreen">
          <div id="header">
            <div id="logo">Circle Cricket<small>PRO EDITION</small></div>
            <div id="modeBadge" class="bat">BAT</div>
          </div>

          <div id="chaseBar" style="width:calc(100% - 20px);max-width:480px;margin:0 10px 4px">
            <div id="chaseBarFill"></div>
            <div id="chaseBarContent">
              <div id="chaseTarget">TARGET: 0</div>
              <div id="chaseNeed">NEED 0 FROM 12</div>
              <div id="chaseRR">RR: 0.0</div>
            </div>
          </div>

          <div id="board">
            <div class="sc"><span class="sc-v" id="vScore">0</span><span class="sc-l">SCORE</span></div>
            <div class="sc"><span class="sc-v" id="vBalls">0/12</span><span class="sc-l">BALLS</span></div>
            <div class="sc"><span class="sc-v" id="vWkts">0/3</span><span class="sc-l">WICKETS</span></div>
            <div class="sc"><span class="sc-v" id="vBest">0</span><span class="sc-l" id="lblFour">BEST</span></div>
          </div>

          <div id="wrap">
            <div id="cdBox"><div id="cdNum"></div><div id="cdSub">GET READY</div></div>
            <div id="popBox"><div id="popScore"></div><div id="popLabel"></div></div>
            <div id="matchOver"><div id="moCard">
              <div class="mo-lbl" id="moLbl">MATCH OVER</div>
              <div class="mo-big" id="moScore">0</div>
              <div class="mo-sub" id="moSub">RUNS IN 12 BALLS</div>
              <div class="mo-extra" id="moExtra"></div>
            </div></div>
            <canvas id="gc" width="460" height="460"></canvas>
          </div>

          <div id="tracker"><div id="tlbl">SCORECARD</div><div id="bRow"></div></div>
          <div id="pressureBar">
            <div id="pressureInner"><div id="pressureNeedle"></div></div>
            <div id="pressureLbl">PRESSURE METER</div>
          </div>
          <div id="msgRow"><div id="msgTxt">Loading...</div></div>
          <div id="btns">
            <button class="btn" id="btnR" onclick="window.resetGame()">↺ RESTART</button>
            <button class="btn" id="btnT" onclick="window.goToss()">⇄ TOSS</button>
            <button class="btn" id="btnMute" onclick="window.toggleMute()" title="Mute / Unmute">🔊 SOUND</button>
            <button class="btn" id="btnH" onclick="window.toggleHow()">? HELP</button>
          </div>
          <div id="streakBadge"></div>

          <div id="howBox">
            <h3>HOW TO PLAY</h3>
            <ul>
              <li><strong style="color:#22c55e">Move mouse / drag finger</strong> to swing the bat.</li>
              <li>Ball bowls from top — intercept with your bat blade.</li>
              <li>Ball touches bat = automatic HIT → flies to a random zone.</li>
              <li>Ball passes bat = miss, 0 runs.</li>
              <li><strong style="color:#ef4444">W zone</strong> = WICKET, you're out!</li>
              <li><strong style="color:#60a5fa">CHASE mode:</strong> Beat the target to WIN!</li>
            </ul>
            <div class="zrow">
              <div class="ztag"><div class="zd" style="background:#16a34a"></div>6</div>
              <div class="ztag"><div class="zd" style="background:#2563eb"></div>4</div>
              <div class="ztag"><div class="zd" style="background:#7c3aed"></div>3</div>
              <div class="ztag"><div class="zd" style="background:#d97706"></div>2</div>
              <div class="ztag"><div class="zd" style="background:#0891b2"></div>1</div>
              <div class="ztag"><div class="zd" style="background:#dc2626"></div>W</div>
            </div>
          </div>
          <div id="foot"><a href="https://sportsfan360.com" target="_blank">sportsfan360.com</a> — Circle Cricket PRO</div>
        </div>
      `;

      // Load the script
      const script = document.createElement('script');
      script.textContent = `
        // CANVAS & CONSTANTS
        const canvas=document.getElementById('gc');
        const ctx=canvas.getContext('2d');
        const S=460,CX=S/2,CY=S/2;
        const FIELD_R=214,BAT_LEN=74,BAT_W=12,BALL_R=11,HIT_ZONE=65;

        // GAME STATE
        let mode='bat';
        let target=0;
        let score=0,best=0,balls=0,wickets=0;
        let phase='toss';
        let ballRecord=[];
        let matchWon=false;
        let diff='easy';
        let maxBalls=5;
        let maxWkts=2;
        const DIFF_SPEED={easy:{min:3.2,rng:1.4},medium:{min:4.5,rng:2},hard:{min:6.2,rng:2.5}};
        let batAngle=-Math.PI/2,batAngVel=0,batFlash=0;
        let ball={x:CX,y:-20,vx:0,vy:0,spin:0,trail:[],active:false};
        let hb={x:0,y:0,vx:0,vy:0,spin:0,trail:[],active:false,zone:-1,settled:false};
        let impactRings=[],parts=[];
        let flash={t:0,col:'rgba(255,255,255,0.2)'};
        let muted=false;
        let streak=0;
        let pressurePct=0.5;
        let crowdWave=0;
        let crowdWaveTimer=0;
        let floodlightFlicker=1;

        const ZONE_DATA=[
          {run:6, col:'#166534', lab:'6'},
          {run:4, col:'#1d4ed8', lab:'4'},
          {run:3, col:'#6d28d9', lab:'3'},
          {run:2, col:'#92400e', lab:'2'},
          {run:1, col:'#0e7490', lab:'1'},
          {run:'W',col:'#991b1b', lab:'W'},
        ];
        let ZONE_RUNS=[6,4,3,2,1,'W'];
        let ZONE_COLS=['#166534','#1d4ed8','#6d28d9','#92400e','#0e7490','#991b1b'];
        let ZONE_LAB=['6','4','3','2','1','W'];

        function shuffleZones(){
          const idx=[0,1,2,3,4,5];
          for(let i=5;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
          ZONE_RUNS=idx.map(i=>ZONE_DATA[i].run);
          ZONE_COLS=idx.map(i=>ZONE_DATA[i].col);
          ZONE_LAB=idx.map(i=>ZONE_DATA[i].lab);
        }

        function generateTarget(){
          const weights=[
            {v:0,w:22},{v:1,w:20},{v:2,w:18},{v:3,w:14},{v:4,w:12},{v:6,w:8},{v:'W',w:6}
          ];
          let total=0,wkts=0;
          for(let b=0;b<maxBalls;b++){
            if(wkts>=maxWkts) break;
            const roll=Math.random()*100;
            let cum=0;
            for(const {v,w} of weights){
              cum+=w;
              if(roll<cum){if(v==='W')wkts++;else total+=v;break;}
            }
          }
          const minT=Math.ceil(maxBalls*1.5), maxT=Math.ceil(maxBalls*5);
          return Math.max(minT, Math.min(maxT, total+1));
        }

        function applyPillStyle(el, active, activeStyle){
          if(!el) return;
          el.style.borderColor = active ? activeStyle.border : '#1e293b';
          el.style.background  = active ? activeStyle.bg     : '#0d1324';
          el.style.color       = active ? activeStyle.color  : '#64748b';
        }

        window.setDiff = function(d){
          diff = d;
          applyPillStyle(document.getElementById('dEasy'),   d==='easy',   {border:'#22c55e',bg:'#052e16',color:'#86efac'});
          applyPillStyle(document.getElementById('dMedium'), d==='medium', {border:'#f59e0b',bg:'#1c1108',color:'#fcd34d'});
          applyPillStyle(document.getElementById('dHard'),   d==='hard',   {border:'#ef4444',bg:'#1f0808',color:'#fca5a5'});
        };

        window.setFmt = function(b, w){
          maxBalls = b;
          maxWkts  = w;
          applyPillStyle(document.getElementById('fT5'),  b===5,  {border:'#8b5cf6',bg:'#1e1040',color:'#c4b5fd'});
          applyPillStyle(document.getElementById('fT10'), b===10, {border:'#8b5cf6',bg:'#1e1040',color:'#c4b5fd'});
          applyPillStyle(document.getElementById('fT20'), b===20, {border:'#8b5cf6',bg:'#1e1040',color:'#c4b5fd'});
        };

        window.selectMode = function(m){
          mode=m;
          document.getElementById('tossScreen').style.display='none';
          const gs=document.getElementById('gameScreen');
          gs.style.display='flex';

          const badge=document.getElementById('modeBadge');
          badge.className='bat'+(m==='chase'?' chase':'');
          badge.innerText=(m==='chase'?'CHASE':'BAT')+' · '+(diff==='easy'?'EASY':diff==='hard'?'HARD':'MED')+' · T'+maxBalls;

          if(m==='chase'){
            target=generateTarget();
            document.getElementById('chaseBar').style.display='block';
            document.getElementById('lblFour').innerText='TARGET';
            document.getElementById('vBest').innerText=target;
            updateChaseBar();
          } else {
            target=0;
            document.getElementById('chaseBar').style.display='none';
            document.getElementById('lblFour').innerText='BEST';
            document.getElementById('vBest').innerText=best;
          }

          score=0;balls=0;wickets=0;ballRecord=[];matchWon=false;
          streak=0;pressurePct=0.5;
          parts=[];flash.t=0;batFlash=0;impactRings=[];
          ball.active=false;hb.active=false;
          document.getElementById('streakBadge').style.display='none';
          document.getElementById('pressureBar').style.display=m==='chase'?'block':'none';
          updateUI();
          startCountdown();
        };

        window.goToss = function(){
          phase='toss';
          document.getElementById('gameScreen').style.display='none';
          document.getElementById('tossScreen').style.display='flex';
          document.getElementById('howBox').style.display='none';
        };

        function updateChaseBar(){
          if(mode!=='chase') return;
          const need=Math.max(0,target-score);
          const ballsLeft=maxBalls-balls;
          const pct=Math.min(100,(score/target)*100);
          document.getElementById('chaseBarFill').style.width=pct+'%';
          document.getElementById('chaseTarget').innerText='TARGET: '+target;
          document.getElementById('chaseNeed').innerText='NEED '+need+' FROM '+ballsLeft;
          const rr=ballsLeft>0?(need/(ballsLeft/6)).toFixed(1):'—';
          document.getElementById('chaseRR').innerText='RR: '+rr;
        }

        let AC=null;
        function getAC(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();return AC;}
        function beep(f,type,dur,vol,delay=0){
          if(muted) return;
          try{
            const A=getAC(),o=A.createOscillator(),g=A.createGain();
            o.type=type;o.frequency.value=f;
            g.gain.setValueAtTime(0.001,A.currentTime+delay);
            g.gain.linearRampToValueAtTime(vol,A.currentTime+delay+0.012);
            g.gain.exponentialRampToValueAtTime(0.001,A.currentTime+delay+dur);
            o.connect(g);g.connect(A.destination);
            o.start(A.currentTime+delay);o.stop(A.currentTime+delay+dur+0.05);
          }catch(e){}
        }
        window.toggleMute = function(){
          muted=!muted;
          const btn=document.getElementById('btnMute');
          if(btn){
            btn.textContent=muted?'🔇 MUTED':'🔊 SOUND';
            btn.classList.toggle('muted',muted);
          }
        };
        function sndTick(){beep(660,'sine',0.1,0.15);}
        function sndGo(){beep(880,'sine',0.06,0.2);beep(1100,'sine',0.1,0.18,0.07);}
        function sndHit(){
          if(muted) return;
          try{
            const A=getAC();
            const buf=A.createBuffer(1,A.sampleRate*0.12,A.sampleRate);
            const d=buf.getChannelData(0);
            for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
            const src=A.createBufferSource();src.buffer=buf;
            const g=A.createGain();g.gain.value=0.55;
            src.connect(g);g.connect(A.destination);src.start();
            const o=A.createOscillator(),g2=A.createGain();
            o.type='sine';o.frequency.setValueAtTime(180,A.currentTime);
            o.frequency.exponentialRampToValueAtTime(55,A.currentTime+0.12);
            g2.gain.setValueAtTime(0.4,A.currentTime);
            g2.gain.exponentialRampToValueAtTime(0.001,A.currentTime+0.18);
            o.connect(g2);g2.connect(A.destination);o.start();o.stop(A.currentTime+0.2);
          }catch(e){}
        }
        function sndMiss(){beep(140,'sawtooth',0.25,0.1);}
        function sndWkt(){
          [310,265,225,185,150].forEach((f,i)=>beep(f,'triangle',0.28,0.11,i*0.11));
        }
        function sndFour(){
          [440,554,659,880].forEach((f,i)=>beep(f,'sine',0.22,0.1,i*0.07));
        }
        function sndSix(){
          [523,659,784,1047,1319].forEach((f,i)=>beep(f,'square',0.15,0.08,i*0.06));
        }
        function sndRun(r){beep(r>=3?490:330,'sine',0.14,0.1);}
        function sndWin(){}
        function sndLose(){}
        function triggerCrowdWave(){crowdWaveTimer=180;}
        function updateCrowd(){if(crowdWaveTimer>0){crowdWaveTimer--;crowdWave=(crowdWave+0.004)%1;}}
        function addImpact(x,y){impactRings.push({x,y,r:8,t:1.0});}
        
        function msg(t){document.getElementById('msgTxt').innerText=t;}
        function showPop(text,label,col,big){}
        function buildRow(){
          const row=document.getElementById('bRow');
          row.innerHTML='';
          for(let i=0;i<maxBalls;i++){
            const d=document.createElement('div');
            if(i<ballRecord.length){
              const r=ballRecord[i];
              if(r==='W')    d.className='bb wkt',d.innerText='W';
              else if(r===0) d.className='bb dot',d.innerText='•';
              else           d.className='bb r'+r,d.innerText=r;
            } else {
              d.className='bb'+(i===balls&&phase!=='over'?' now':'');
              d.innerText=i+1;
            }
            row.appendChild(d);
          }
        }
        function updateUI(){
          document.getElementById('vScore').innerText=score;
          document.getElementById('vBalls').innerText=balls+'/'+maxBalls;
          document.getElementById('vWkts').innerText=wickets+'/'+maxWkts;
          if(mode==='bat') document.getElementById('vBest').innerText=best;
          else document.getElementById('vBest').innerText=target;
          buildRow();
          if(mode==='chase') updateChaseBar();
        }
        function updateStreakBadge(){}
        function updatePressureMeter(){}
        
        function startCountdown(){
          phase='countdown';parts=[];flash.t=0;impactRings=[];
          ball.active=false;hb.active=false;batFlash=0;matchWon=false;
          document.getElementById('matchOver').style.display='none';
          document.getElementById('popBox').style.display='none';
          const num=document.getElementById('cdNum'),sub=document.getElementById('cdSub');
          num.style.opacity=1;sub.style.opacity=1;
          let c=3;num.innerText=c;sndTick();
          const iv=setInterval(()=>{
            c--;
            if(c>0){num.innerText=c;sndTick();}
            else if(c===0){num.innerText='GO!';num.style.color='#22c55e';sndGo();}
            else{
              clearInterval(iv);
              num.style.opacity=0;sub.style.opacity=0;num.style.color='#fff';
              setTimeout(bowlBall,250);
            }
          },800);
        }
        
        function bowlBall(){
          phase='live';batFlash=0;
          ball.trail=[];hb.active=false;
          ball.x=CX+(Math.random()*44-22);
          ball.y=-BALL_R;
          const dx=CX-ball.x,dy=CY-ball.y,d=Math.sqrt(dx*dx+dy*dy);
          const sp=DIFF_SPEED[diff];
          const spd=sp.min+Math.random()*sp.rng;
          ball.vx=dx/d*spd+(Math.random()-0.5)*0.55;
          ball.vy=dy/d*spd;
          ball.spin=0;ball.active=true;
          buildRow();
          if(mode==='chase'){
            const need=target-score;
            const left=maxBalls-balls;
            msg('Need '+need+' from '+left+' balls — swing your bat!');
          } else {
            msg('Move your bat to intercept the ball!');
          }
        }
        
        function checkHit(){
          if(!ball.active||phase!=='live') return false;
          const bx=ball.x-CX,by=ball.y-CY;
          const c=Math.cos(-batAngle),s=Math.sin(-batAngle);
          const lx=bx*c-by*s,ly=bx*s+by*c;
          return Math.abs(lx)<=BAT_LEN/2 && Math.abs(ly)<=(BAT_W/2+BALL_R+1);
        }
        
        function triggerHit(){
          phase='flying';ball.active=false;
          sndHit();batFlash=1.0;
          addImpact(ball.x,ball.y);
          flash.col='rgba(255,255,255,0.2)';flash.t=7;
          const zone=Math.floor(Math.random()*ZONE_RUNS.length);
          const outAng=(zone+0.5)*(Math.PI*2/6)-Math.PI/2+(Math.random()-0.5)*0.5;
          const spd=12+Math.random()*3.5+Math.min(Math.abs(batAngVel)*1.5,2);
          hb.x=ball.x;hb.y=ball.y;
          hb.vx=Math.cos(outAng)*spd;hb.vy=Math.sin(outAng)*spd;
          hb.spin=batAngVel*0.6;hb.trail=[];hb.active=true;
          hb.zone=zone;hb.settled=false;
        }
        
        function resolveLanding(zone){
          const runs=ZONE_RUNS[zone];
          balls++;
          if(runs==='W'){
            streak=0; updateStreakBadge();
            wickets++;ballRecord.push('W');
            sndWkt();triggerCrowdWave();
            msg('WICKET! OUT! '+(wickets<maxWkts?'Keep going!':'All out!'));
          } else {
            streak++; updateStreakBadge();
            score+=runs;ballRecord.push(runs);
            if(mode==='chase' && score>=target){
              hb.active=false;phase='pause';
              updateUI();updatePressureMeter();
              setTimeout(()=>endGame(true),500);
              return;
            }
            if(runs===6){sndSix();triggerCrowdWave();msg('SIX! MAXIMUM!');}
            else if(runs===4){sndFour();triggerCrowdWave();msg('FOUR! Great boundary!');}
            else {sndRun(runs);msg(runs+' run'+(runs>1?'s':'')+' — good shot!');}
            if(mode==='bat'&&score>best){
              best=score;
              setTimeout(()=>msg('NEW BEST: '+best+'!'),700);
            }
          }
          hb.active=false;phase='pause';
          updateUI();updatePressureMeter();
          if(balls>=maxBalls||wickets>=maxWkts){setTimeout(()=>endGame(false),1200);return;}
          setTimeout(bowlBall,1700);
        }
        
        function endGame(won){
          phase='over';matchWon=!!won;
          const moLbl=document.getElementById('moLbl');
          const moBig=document.getElementById('moScore');
          const moSub=document.getElementById('moSub');
          if(mode==='chase'){
            if(won){
              moLbl.innerText='🏆 CONGRATULATIONS!';moLbl.style.color='#22c55e';
              moBig.innerText=score;moBig.style.color='#22c55e';
              moSub.innerText='YOU CHASED THE TARGET!';
              msg('🏆 CONGRATULATIONS! You chased down '+target+' — MATCH WON!');
            } else {
              moLbl.innerText='MATCH LOST';moLbl.style.color='#ef4444';
              moBig.innerText=score;moBig.style.color='#ef4444';
              moSub.innerText='TARGET WAS '+target+' RUNS';
              msg('You needed '+target+' — fell short. Try again!');
            }
          } else {
            moLbl.innerText='MATCH OVER';moLbl.style.color='#94a3b8';
            moBig.innerText=score;moBig.style.color='#22c55e';
            moSub.innerText='RUNS IN '+maxBalls+' BALLS';
            msg('You scored '+score+' runs. Best: '+best+'. Tap RESTART!');
          }
          document.getElementById('matchOver').style.display='flex';
          buildRow();
        }
        
        window.resetGame = function(){
          score=0;balls=0;wickets=0;ballRecord=[];matchWon=false;
          streak=0;pressurePct=0.5;
          parts=[];flash.t=0;batFlash=0;impactRings=[];
          ball.active=false;hb.active=false;
          document.getElementById('matchOver').style.display='none';
          document.getElementById('popBox').style.display='none';
          document.getElementById('streakBadge').style.display='none';
          document.getElementById('pressureBar').style.display=mode==='chase'?'block':'none';
          if(mode==='chase'){
            target=generateTarget();
            document.getElementById('vBest').innerText=target;
            updateChaseBar();
          }
          updateUI();updateStreakBadge();updatePressureMeter();
          startCountdown();
        };
        
        window.toggleHow = function(){
          const h=document.getElementById('howBox');
          h.style.display=h.style.display==='block'?'none':'block';
        };
        
        function updateBat(px,py){
          const dx=px-CX,dy=py-CY;
          if(Math.hypot(dx,dy)<12) return;
          const newAng=Math.atan2(dy,dx);
          let da=newAng-batAngle;
          while(da>Math.PI)da-=Math.PI*2;
          while(da<-Math.PI)da+=Math.PI*2;
          batAngVel=da;batAngle=newAng;
        }
        
        const wrap=document.getElementById('wrap');
        function getRel(e,touch){
          const r=wrap.getBoundingClientRect(),sc=S/r.width;
          if(touch){const t=e.touches[0];return{x:(t.clientX-r.left)*sc,y:(t.clientY-r.top)*sc};}
          return{x:(e.clientX-r.left)*sc,y:(e.clientY-r.top)*sc};
        }
        wrap.addEventListener('mousemove',e=>{const p=getRel(e,false);updateBat(p.x,p.y);});
        wrap.addEventListener('touchstart',e=>{e.preventDefault();const p=getRel(e,true);updateBat(p.x,p.y);},{passive:false});
        wrap.addEventListener('touchmove',e=>{e.preventDefault();const p=getRel(e,true);updateBat(p.x,p.y);},{passive:false});
        wrap.addEventListener('mouseleave',()=>{batAngVel*=0.5;});
        
        function update(){
          if(phase==='live'&&ball.active){
            ball.trail.push({x:ball.x,y:ball.y});
            if(ball.trail.length>22)ball.trail.shift();
            ball.x+=ball.vx;ball.y+=ball.vy;ball.spin+=0.22;
            if(checkHit()) triggerHit();
            if(phase==='live'&&ball.y>CY+HIT_ZONE+24) {phase='pause';ball.active=false;streak=0;updateStreakBadge();balls++;ballRecord.push(0);sndMiss();updateUI();if(balls>=maxBalls||wickets>=maxWkts){setTimeout(endGame,800);return;}setTimeout(bowlBall,1300);}
            if(phase==='live'&&(ball.x<-25||ball.x>S+25||ball.y>S+25)) {phase='pause';ball.active=false;streak=0;updateStreakBadge();balls++;ballRecord.push(0);sndMiss();updateUI();if(balls>=maxBalls||wickets>=maxWkts){setTimeout(endGame,800);return;}setTimeout(bowlBall,1300);}
          }
          if(phase==='flying'&&hb.active&&!hb.settled){
            hb.trail.push({x:hb.x,y:hb.y});
            if(hb.trail.length>22)hb.trail.shift();
            hb.x+=hb.vx;hb.y+=hb.vy;
            hb.vx*=0.982;hb.vy*=0.982;hb.spin+=0.38;
            if(Math.hypot(hb.x-CX,hb.y-CY)>=FIELD_R-BALL_R){hb.settled=true;resolveLanding(hb.zone);}
          }
          if(batFlash>0)batFlash=Math.max(0,batFlash-0.06);
          batAngVel*=0.78;
          impactRings.forEach(r=>{r.r+=3;r.t-=0.06;});
          impactRings=impactRings.filter(r=>r.t>0);
          if(flash.t>0)flash.t--;
          parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.13;p.vx*=0.968;p.life--;});
          parts=parts.filter(p=>p.life>0);
          updateCrowd();
        }
        
        function drawStadium(){}
        function drawField(){
          for(let i=0;i<6;i++){
            const a1=i*Math.PI*2/6-Math.PI/2,a2=(i+1)*Math.PI*2/6-Math.PI/2;
            ctx.beginPath();ctx.moveTo(CX,CY);ctx.arc(CX,CY,FIELD_R,a1,a2);ctx.closePath();
            ctx.fillStyle=ZONE_COLS[i];ctx.fill();
            ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1.5;ctx.stroke();
          }
          for(let i=0;i<6;i++){
            const a=i*Math.PI*2/6-Math.PI/2;
            ctx.beginPath();ctx.moveTo(CX+Math.cos(a)*(HIT_ZONE+6),CY+Math.sin(a)*(HIT_ZONE+6));
            ctx.lineTo(CX+Math.cos(a)*FIELD_R,CY+Math.sin(a)*FIELD_R);
            ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();
          }
          for(let i=0;i<6;i++){
            const mid=(i+0.5)*Math.PI*2/6-Math.PI/2;
            const tx=CX+Math.cos(mid)*160,ty=CY+Math.sin(mid)*160;
            ctx.save();ctx.translate(tx,ty);
            ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);
            ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fill();
            ctx.font='900 30px Bebas Neue,Arial';ctx.textAlign='center';ctx.textBaseline='middle';
            ctx.fillStyle='#ffffff';
            ctx.fillText(ZONE_LAB[i],0,ZONE_LAB[i]==='W'?-5:0);
            ctx.restore();
          }
        }
        
        function drawCenter(){
          ctx.beginPath();ctx.arc(CX,CY,HIT_ZONE,0,Math.PI*2);ctx.fillStyle='#081408';ctx.fill();
          ctx.strokeStyle='#1e293b';ctx.lineWidth=2;ctx.stroke();
        }
        
        function drawBat(){
          ctx.save();ctx.translate(CX,CY);ctx.rotate(batAngle);
          const halfL=BAT_LEN/2,halfW=BAT_W/2,rad=halfW;
          const bg=ctx.createLinearGradient(0,-halfW,0,halfW);
          bg.addColorStop(0,'#fef3c7');bg.addColorStop(0.35,'#fbbf24');bg.addColorStop(1,'#b45309');
          ctx.fillStyle=bg;
          ctx.beginPath();ctx.moveTo(-halfL+rad,-halfW);ctx.lineTo(halfL-rad,-halfW);
          ctx.arcTo(halfL,-halfW,halfL,0,rad);ctx.arcTo(halfL,halfW,halfL-rad,halfW,rad);
          ctx.lineTo(-halfL+rad,halfW);ctx.arcTo(-halfL,halfW,-halfL,0,rad);
          ctx.arcTo(-halfL,-halfW,-halfL+rad,-halfW,rad);ctx.closePath();ctx.fill();
          ctx.restore();
        }
        
        function draw(){
          ctx.clearRect(0,0,S,S);
          ctx.fillStyle='#05080f';ctx.fillRect(0,0,S,S);
          ctx.save();ctx.beginPath();ctx.arc(CX,CY,FIELD_R,0,Math.PI*2);ctx.clip();
          drawField();
          if(flash.t>0){ctx.fillStyle=flash.col;ctx.fillRect(0,0,S,S);}
          ctx.restore();
          drawCenter();
          if(phase!=='over')drawBat();
          if(ball.active&&phase==='live'){ctx.beginPath();ctx.arc(ball.x,ball.y,BALL_R,0,Math.PI*2);ctx.fillStyle='#f0ede6';ctx.fill();}
          if(hb.active&&phase==='flying'&&!hb.settled){ctx.beginPath();ctx.arc(hb.x,hb.y,BALL_R,0,Math.PI*2);ctx.fillStyle='#fffbf0';ctx.fill();}
          impactRings.forEach(ring=>{
            ctx.beginPath();ctx.arc(ring.x,ring.y,ring.r,0,Math.PI*2);ctx.strokeStyle='rgba(251,191,36,0.6)';ctx.lineWidth=2.5;ctx.stroke();
          });
        }
        
        function loop(){update();draw();requestAnimationFrame(loop);}
        
        window.setDiff('easy');
        window.setFmt(5,2);
        loop();
      `;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#05080f] flex justify-center items-start py-8"
      style={{ background: 'var(--bg)' }}
    />
  );
}