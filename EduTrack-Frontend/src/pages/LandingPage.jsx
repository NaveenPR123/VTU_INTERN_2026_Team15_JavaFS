import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { font, body, mono } from '../theme.js';
import logoSrc from '../assets/edutrack-logo.png';

const LandingPage = ({ onGoSignin, onGoSignup }) => {
  const { theme: C, isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const g  = `linear-gradient(135deg, #e8b96a 0%, #4ecdc4 100%)`;
  const g2 = `linear-gradient(135deg, #4ecdc4 0%, #a78bfa 100%)`;

  const pill = (bg, color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '0.3rem 0.85rem', borderRadius: 99,
    fontSize: 12, fontWeight: 600,
    background: bg, color, letterSpacing: '0.03em',
    border: `1px solid ${color}30`,
  });

  const features = [
    { emoji: '📅', title: 'Smart Attendance', color: '#4ecdc4', desc: 'Mark per-course attendance with date tracking. Students see live percentages with shortage warnings.' },
    { emoji: '📝', title: 'Assignment Submissions', color: '#e8b96a', desc: 'Students upload files, teachers grade and leave feedback — deadline tracking built in.' },
    { emoji: '📊', title: 'Marks & Grades', color: '#a78bfa', desc: 'Enter marks per student. Grades auto-calculated (O, A+, A, B+, B). CGPA computed instantly.' },
    { emoji: '📂', title: 'Course Materials', color: '#60a5fa', desc: 'Upload PDFs, notes, or share external links. Students access everything organised by course.' },
    { emoji: '📤', title: 'Bulk CSV Import', color: '#34d399', desc: 'Import attendance, marks, students, and teachers in bulk. Download templates, import in seconds.' },
    { emoji: '🛡️', title: 'Three-role Access', color: '#f87171', desc: 'Separate secure portals for students, teachers, and admins. Each role sees only what they need.' },
  ];

  const steps = [
    { n: '01', title: 'Admin sets up', desc: 'Admin creates teacher accounts, sets up courses, and manages the institution from the admin portal.', color: '#e8b96a' },
    { n: '02', title: 'Teachers manage', desc: 'Teachers mark attendance, create assignments, enter marks, and upload course materials.', color: '#4ecdc4' },
    { n: '03', title: 'Students track', desc: 'Students view attendance, submit assignments, check marks, and download course materials.', color: '#a78bfa' },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: body, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* Global styles */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .lp-btn-primary { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .lp-btn-primary:hover { transform: translateY(-2px) scale(1.03) !important; box-shadow: 0 12px 32px rgba(232,185,106,0.4) !important; }
        .lp-btn-secondary { transition: all 0.2s ease !important; }
        .lp-btn-secondary:hover { background: ${C.surface2} !important; border-color: ${C.gold}60 !important; color: ${C.gold} !important; transform: translateY(-1px) !important; }
        .lp-feature-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
        .lp-feature-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.2) !important; }
        .lp-role-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
        .lp-role-card:hover { transform: translateY(-4px) !important; }
        .lp-nav-link { transition: color 0.2s ease !important; position: relative; }
        .lp-nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px; background:${C.gold}; border-radius:2px; transition:width 0.2s ease; }
        .lp-nav-link:hover { color: ${C.text} !important; }
        .lp-nav-link:hover::after { width:100%; }
        .lp-step-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
        .lp-step-card:hover { transform: translateY(-4px) scale(1.01) !important; }
        .lp-preview-row { transition: background 0.2s ease !important; }
        .lp-preview-row:hover { background: ${C.surface3} !important; }
        .lp-logo-img { animation: float 4s ease-in-out infinite; }
        .ticker-track { display:flex; animation: ticker 28s linear infinite; }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(232,185,106,0.05)':'rgba(232,185,106,0.07)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }}/>
      <div style={{ position: 'fixed', top: '30%', right: 0, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(78,205,196,0.04)':'rgba(78,205,196,0.06)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }}/>
      <div style={{ position: 'fixed', bottom: 0, left: '40%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(167,139,250,0.04)':'rgba(167,139,250,0.05)'} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }}/>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? (isDark ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.85)') : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s', padding: '0.85rem 0',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoSrc} alt="EduTrack logo" style={{ width: 38, height: 38, borderRadius: 10, boxShadow: '0 4px 14px rgba(232,185,106,0.35)', objectFit: 'cover' }} />
            <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.text }}>Edu<span style={{ color: C.gold }}>Track</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {[['How it works','#how'],['Features','#features']].map(([l,h]) => (
              <a key={l} href={h} className="lp-nav-link" style={{ color: C.textMuted, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{l}</a>
            ))}
            <ThemeToggle />
            <button onClick={onGoSignin} className="lp-btn-secondary"
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.text, padding: '0.5rem 1.25rem', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: body }}>
              Log in
            </button>
            <button onClick={onGoSignup} className="lp-btn-primary"
              style={{ background: g, border: 'none', color: '#0d1117', padding: '0.5rem 1.25rem', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: body, boxShadow: '0 4px 16px rgba(232,185,106,0.25)' }}>
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 2rem 5rem', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '48px 48px', opacity: 0.4, pointerEvents: 'none', borderRadius: 24 }}/>

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Logo icon floating above headline */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ position: 'relative' }}>
              <img src={logoSrc} alt="EduTrack" className="lp-logo-img" style={{ width: 80, height: 80, borderRadius: 22, boxShadow: '0 16px 48px rgba(232,185,106,0.35), 0 0 0 1px rgba(232,185,106,0.2)', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: -8, borderRadius: 30, border: `1px solid ${C.gold}25`, animation: 'spin-slow 12s linear infinite', pointerEvents: 'none' }}/>
            </div>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: '1.5rem', animation: 'fadeUp 0.6s 0.05s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <span style={{ ...pill(C.goldDim, C.gold), fontSize: 13 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, display: 'inline-block', animation: 'pulse 2s ease infinite' }}/>
              Built for colleges &amp; universities
            </span>
          </div>

          <h1 style={{ fontFamily: font, fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '1.5rem', color: C.text, animation: 'fadeUp 0.6s 0.1s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <div>Academic management,</div>
            <div key={isDark ? 'dark' : 'light'} style={{ background: g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>all in one place.</div>
          </h1>

          <p style={{ fontSize: '1.1rem', color: C.textMuted, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 2.75rem', animation: 'fadeUp 0.6s 0.2s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            EduTrack connects students, teachers, and admins — attendance, assignments, marks, and course materials managed in real time.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.3s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <button onClick={onGoSignup} className="lp-btn-primary"
              style={{ background: g, border: 'none', color: '#0d1117', padding: '0.95rem 2.25rem', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: body, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 28px rgba(232,185,106,0.3)' }}>
              Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onGoSignin} className="lp-btn-secondary"
              style={{ background: 'transparent', border: `1.5px solid ${C.border}`, color: C.text, padding: '0.95rem 2.25rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: body, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              I already have an account
            </button>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.4s ease both', opacity: 0, animationFillMode: 'forwards', marginBottom: '2rem' }}>
            {[['3','User Roles'],['6','Modules'],['100%','Free to use'],['Real-time','Live sync']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, background: g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
                <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 3 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Trusted-by ticker */}
          <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)', animation: 'fadeUp 0.6s 0.5s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="ticker-track">
              {[...Array(2)].map((_,ri) => (
                <div key={ri} style={{ display: 'flex', gap: '2.5rem', paddingRight: '2.5rem', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  {['📊 Smart Analytics','🎓 Graduation Tracking','📅 Bulk Attendance','📝 Assignment Manager','📤 CSV Imports','🛡️ Role-based Access','📂 Course Materials','✅ Auto Grading'].map(item => (
                    <span key={item} style={{ fontSize: 13, color: C.textDim, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 99, border: `1px solid ${C.border}`, background: C.surface }}>{item}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Preview card ── */}
      <section style={{ padding: '0 2rem 7rem', maxWidth: 920, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ background: isDark ? 'rgba(22,27,37,0.9)' : 'rgba(255,255,255,0.9)', border: `1px solid ${C.border}`, borderRadius: 20, padding: '1.75rem', boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' : '0 32px 80px rgba(0,0,0,0.12)', backdropFilter: 'blur(12px)' }}>
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>)}
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.surface2, marginLeft: 8 }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: C.surface2, borderRadius: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', animation: 'pulse 2s ease infinite' }}/>
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: mono }}>Student Dashboard</span>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[['Attendance','89%','↑ Above 75%', C.teal, C.tealDim],['CGPA','8.6','↑ +0.3 this sem', C.gold, C.goldDim],['Pending','2 tasks','1 overdue', C.rose, C.roseDim]].map(([l,v,sub,col,dim]) => (
              <div key={l} style={{ background: dim, borderRadius: 14, padding: '1rem 1.1rem', border: `1px solid ${col}25`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: `${col}15`, pointerEvents: 'none' }}/>
                <div style={{ fontSize: 11, color: col, fontWeight: 600, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontFamily: font, fontSize: '1.7rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 11, color: col, marginTop: 6, fontWeight: 500 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Course rows */}
          <div style={{ background: C.surface2, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px', padding: '0.6rem 1rem', borderBottom: `1px solid ${C.border}` }}>
              {['Course','Teacher','Attendance','Grade'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {[
              ['Data Structures','Prof. R. Sharma','23/25','O', C.gold],
              ['Operating Systems','Prof. K. Menon','21/25','A+', C.teal],
              ['Database Systems','Prof. P. Reddy','22/25','A', C.purple],
            ].map(([sub,teacher,att,grade,gc],i) => (
              <div key={sub} className="lp-preview-row" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px', padding: '0.75rem 1rem', borderBottom: i<2?`1px solid ${C.border}`:'none', cursor: 'default' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{sub}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{teacher}</div>
                <div style={{ fontSize: 12, color: C.teal, fontWeight: 500 }}>{att}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${gc}18`, color: gc }}>{grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: '6rem 2rem', background: C.surface, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(78,205,196,0.06)':'rgba(78,205,196,0.08)'} 0%, transparent 70%)`, pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ ...pill(C.tealDim, C.teal), marginBottom: 16, display: 'inline-flex' }}>Simple by design</span>
            <h2 style={{ fontFamily: font, fontSize: '2.2rem', fontWeight: 700, color: C.text, marginTop: 14 }}>Up and running in minutes</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: 10 }}>Three steps, three roles, one platform.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {steps.map((step, i) => (
              <div key={step.n} className="lp-step-card" style={{ background: isDark ? `linear-gradient(165deg, ${C.surface2} 0%, ${C.surface3} 100%)` : C.surface2, borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: 14, border: `1px solid ${step.color}20`, boxShadow: `0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${step.color}10`, pointerEvents: 'none' }}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: font, fontSize: '2.5rem', fontWeight: 700, background: `linear-gradient(135deg, ${step.color}, ${step.color}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{step.n}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${step.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {i===0?'🛡️':i===1?'📚':'🎓'}
                  </div>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: C.text, fontFamily: font }}>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.7 }}>{step.desc}</div>
                <div style={{ height: 3, borderRadius: 99, background: `linear-gradient(90deg, ${step.color}, ${step.color}30)`, marginTop: 4 }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '6rem 2rem', background: C.bg, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(167,139,250,0.05)':'rgba(167,139,250,0.07)'} 0%, transparent 70%)`, pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ ...pill(C.goldDim, C.gold), marginBottom: 16, display: 'inline-flex' }}>What's inside</span>
            <h2 style={{ fontFamily: font, fontSize: '2.2rem', fontWeight: 700, color: C.text, marginTop: 14 }}>Everything your institution needs</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: 10, maxWidth: 460, margin: '10px auto 0' }}>
              Built specifically for the EduTrack workflow — from daily attendance to end-of-semester marks.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.25rem' }}>
            {features.map(f => (
              <div key={f.title} className="lp-feature-card" style={{ background: isDark ? `linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)` : C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '1.75rem', cursor: 'default', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at 80% 20%, ${f.color}12 0%, transparent 70%)`, pointerEvents: 'none' }}/>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.1rem', border: `1px solid ${f.color}20` }}>
                  {f.emoji}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, fontFamily: font, marginBottom: '0.6rem' }}>{f.title}</div>
                <p style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                <div style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: f.color, fontWeight: 600 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.color }}/>
                  Included in EduTrack
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role split ── */}
      <section style={{ padding: '6rem 2rem', background: C.surface, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${isDark?'rgba(232,185,106,0.04)':'rgba(232,185,106,0.06)'} 0%, transparent 70%)`, pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: font, fontSize: '2.2rem', fontWeight: 700, color: C.text }}>Three roles, one platform</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: 10 }}>Each role gets a tailored experience built for their workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.5rem' }}>
            {[
              { icon:'📚', label:'For Teachers', color:C.gold, dim:C.goldDim, items:['Mark attendance per course with date selection','Create assignments and grade student submissions','Enter marks — grades auto-calculated (O to B)','Upload lecture notes, PDFs, and external links','Bulk import attendance and marks via CSV'] },
              { icon:'🎓', label:'For Students', color:C.teal, dim:C.tealDim, items:['View attendance per course with shortage alerts','Submit assignments and check teacher feedback','See marks and CGPA calculated automatically','Download course materials uploaded by teachers','Track pending, overdue, and submitted assignments'] },
              { icon:'🛡️', label:'For Admins', color:C.purple, dim:C.purpleDim, items:['Add, edit, and remove students and teachers','Bulk import rosters via CSV upload','View all courses across the institution','Monitor live stats — students, teachers, departments','Admin account auto-created on first startup'] },
            ].map(role => (
              <div key={role.label} className="lp-role-card" style={{ background: isDark ? `linear-gradient(165deg, ${C.surface2} 0%, ${C.surface3} 100%)` : C.surface2, borderRadius: 20, padding: '2rem', border: `1px solid ${role.color}25`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${role.color}, ${role.color}50)`, borderRadius: '20px 20px 0 0' }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: role.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: `1px solid ${role.color}20` }}>{role.icon}</div>
                  <div style={{ fontFamily: font, fontSize: '1.15rem', fontWeight: 700, color: role.color }}>{role.label}</div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {role.items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: C.textMuted }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={role.color} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '7rem 2rem', background: C.bg, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '48px 48px', opacity: 0.3, pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <img src={logoSrc} alt="EduTrack" style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 1.5rem', display: 'block', boxShadow: '0 8px 32px rgba(232,185,106,0.4)', animation: 'float 4s ease-in-out infinite', objectFit: 'cover' }} />
          <h2 style={{ fontFamily: font, fontSize: '2.4rem', fontWeight: 700, color: C.text, marginBottom: '1rem', lineHeight: 1.2 }}>
            Ready to get started?
          </h2>
          <p style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Sign up as a student or teacher. Admins log in with credentials provided by your institution.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onGoSignup} className="lp-btn-primary"
              style={{ background: g, border: 'none', color: '#0d1117', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: body, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 28px rgba(232,185,106,0.3)' }}>
              Create an account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onGoSignin} className="lp-btn-secondary"
              style={{ background: 'transparent', border: `1.5px solid ${C.border}`, color: C.text, padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: body, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '3.5rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <img src={logoSrc} alt="EduTrack" style={{ width: 36, height: 36, borderRadius: 9, boxShadow: '0 4px 12px rgba(232,185,106,0.3)', objectFit: 'cover' }} />
              <span style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text }}>Edu<span style={{ color: C.gold }}>Track</span></span>
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.75, maxWidth: 300 }}>
              Academic performance and tracking system for colleges. Attendance, assignments, marks, and materials — all in one platform.
            </p>

          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: '0.1em', marginBottom: '1.1rem', textTransform: 'uppercase' }}>Navigate</div>
            {[['How it works','#how'],['Features','#features']].map(([l,h]) => (
              <a key={l} href={h} className="lp-nav-link" style={{ display: 'block', fontSize: 13, color: C.textMuted, textDecoration: 'none', marginBottom: '0.7rem', fontWeight: 500 }}>{l}</a>
            ))}
            <button onClick={onGoSignin} style={{ display: 'block', fontSize: 13, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: body, padding: 0, marginBottom: '0.7rem', fontWeight: 500, textAlign: 'left' }}>Log in</button>
            <button onClick={onGoSignup} style={{ display: 'block', fontSize: 13, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: body, padding: 0, fontWeight: 500, textAlign: 'left' }}>Sign up</button>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: '0.1em', marginBottom: '1.1rem', textTransform: 'uppercase' }}>Portals</div>
            {[['🎓','Student portal'],['📚','Teacher portal'],['🛡️','Admin portal']].map(([icon,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textMuted, marginBottom: '0.7rem', fontWeight: 500 }}>
                <span>{icon}</span>{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: C.textDim }}>© 2026 EduTrack. Academic management platform.</span>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
