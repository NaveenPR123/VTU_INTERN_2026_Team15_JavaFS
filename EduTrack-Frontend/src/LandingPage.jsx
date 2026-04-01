import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle.jsx';
import { font, body } from './theme';

const LandingPage = ({ onGoSignin, onGoSignup }) => {
  const { theme: C, isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const g = `linear-gradient(135deg, ${C.gold} 0%, ${C.teal} 100%)`;

  // ── shared style helpers ──
  const card = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: '1.75rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const pill = (bg, color) => ({
    display: 'inline-block', padding: '0.25rem 0.75rem',
    borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: bg, color, letterSpacing: '0.04em',
  });

  const features = [
    { emoji: '🗓️', title: 'Attendance in Seconds', desc: 'Teachers mark full-class attendance with one tap. Students get instant visibility into their own records.' },
    { emoji: '📝', title: 'Assignment Lifecycle', desc: 'Create, distribute, submit and grade assignments — all tracked in one place with deadline reminders.' },
    { emoji: '🏆', title: 'Marks & Scorecards', desc: 'Enter exam scores once and let EduTrack generate per-student scorecards automatically.' },
    { emoji: '📉', title: 'Shortage Alerts', desc: 'Automatic warnings when a student\'s attendance dips below the required threshold.' },
    { emoji: '🔐', title: 'Two-role Security', desc: 'Separate, secure portals for teachers and students. Each role sees exactly what it needs — nothing more.' },
    { emoji: '📱', title: 'Works Everywhere', desc: 'Fully responsive interface that works on phones, tablets, and desktops without installing anything.' },
  ];

  const steps = [
    { n: '01', title: 'Create your account', desc: 'Sign up as a student or teacher in under a minute.' },
    { n: '02', title: 'Join your courses', desc: 'Teachers set up courses; students enroll with a code.' },
    { n: '03', title: 'Track everything', desc: 'Attendance, marks, and assignments — all in one view.' },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: body, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? C.surface : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s', padding: '0.9rem 0',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, fontWeight: 700, fontSize: 18, color: '#0d1117' }}>E</div>
            <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.text }}>
              Edu<span style={{ color: C.gold }}>Track</span>
            </span>
          </div>
          {/* Nav items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#how" style={{ color: C.textMuted, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>How it works</a>
            <a href="#features" style={{ color: C.textMuted, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Features</a>
            <ThemeToggle />
            <button onClick={onGoSignin} style={{ background: 'none', border: `1px solid ${C.border}`, color: C.text, padding: '0.5rem 1.2rem', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: body }}>
              Log in
            </button>
            <button onClick={onGoSignup} style={{ background: g, border: 'none', color: '#0d1117', padding: '0.5rem 1.2rem', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: body }}>
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '6rem 2rem 5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* top label */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={pill(C.goldDim, C.gold)}>🎓 Built for colleges &amp; universities</span>
        </div>

        {/* headline */}
        <h1 style={{ fontFamily: font, fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700, textAlign: 'center', lineHeight: 1.15, marginBottom: '1.5rem', color: C.text }}>
          Academic records,<br />
          <span style={{ background: g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            finally under control.
          </span>
        </h1>

        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: C.textMuted, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem', fontFamily: body }}>
          EduTrack gives teachers and students a shared, real-time view of attendance, assignments, and marks — no spreadsheets, no confusion.
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          <button onClick={onGoSignup} style={{ background: g, border: 'none', color: '#0d1117', padding: '0.9rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: body, display: 'flex', alignItems: 'center', gap: 8 }}>
            Get started — it's free <span>→</span>
          </button>
          <button onClick={onGoSignin} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.text, padding: '0.9rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: body }}>
            I already have an account
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {[['2 Roles', 'Teacher & Student'], ['100%', 'Free to use'], ['Real-time', 'Live updates']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: font, fontSize: '1.8rem', fontWeight: 700, color: C.gold }}>{val}</div>
              <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview card ── */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ ...card, padding: '2rem', boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(0,0,0,0.1)' }}>
          {/* mock header bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
            {['#e8b96a','#4ecdc4','rgba(255,255,255,0.15)'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.surface2, marginLeft: 8 }}/>
          </div>
          {/* mock content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[['Attendance','87%', C.teal, C.tealDim],['Avg Score','74%', C.gold, C.goldDim],['Pending','3 tasks', C.rose, C.roseDim]].map(([l,v,col,dim]) => (
              <div key={l} style={{ background: dim, borderRadius: 12, padding: '1rem', border: `1px solid ${col}22` }}>
                <div style={{ fontSize: 11, color: col, fontWeight: 600, marginBottom: 6, letterSpacing: '0.06em' }}>{l}</div>
                <div style={{ fontFamily: font, fontSize: '1.6rem', fontWeight: 700, color: C.text }}>{v}</div>
              </div>
            ))}
          </div>
          {/* mock table rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Data Structures','Dr. Sharma','92%','A'],['Operating Systems','Dr. Mehta','78%','B+'],['DBMS','Dr. Patel','85%','A-']].map(([sub,teacher,att,grade]) => (
              <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: C.surface2, borderRadius: 10 }}>
                <div style={{ flex: 2, fontSize: 13, fontWeight: 600, color: C.text }}>{sub}</div>
                <div style={{ flex: 2, fontSize: 12, color: C.textMuted }}>{teacher}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.teal }}>{att}</div>
                <span style={pill(C.goldDim, C.gold)}>{grade}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: '5rem 2rem', background: C.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ ...pill(C.tealDim, C.teal), marginBottom: 16, display: 'inline-block' }}>Simple by design</span>
            <h2 style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, color: C.text, marginTop: 12 }}>Up and running in minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1.5rem' }}>
            {steps.map(step => (
              <div key={step.n} style={{ ...card, background: C.surface2, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, background: g, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{step.n}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, fontFamily: font }}>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '5rem 2rem', background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ ...pill(C.goldDim, C.gold), marginBottom: 16, display: 'inline-block' }}>What's inside</span>
            <h2 style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, color: C.text, marginTop: 12 }}>
              Tools that actually save time
            </h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: 10, maxWidth: 480, margin: '10px auto 0' }}>
              Designed around how teachers and students actually work — not how software companies think they do.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.25rem' }}>
            {features.map(f => (
              <div key={f.title} style={card}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.emoji}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, fontFamily: font, marginBottom: '0.5rem' }}>{f.title}</div>
                <p style={{ fontSize: '0.875rem', color: C.textMuted, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role split ── */}
      <section style={{ padding: '5rem 2rem', background: C.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, color: C.text }}>Two roles, one platform</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem', marginTop: 10 }}>Each role gets a tailored experience built for their workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Teacher */}
            <div style={{ ...card, borderTop: `3px solid ${C.gold}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
              <div style={{ fontFamily: font, fontSize: '1.2rem', fontWeight: 700, color: C.gold, marginBottom: '0.75rem' }}>For Teachers</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Mark attendance for entire classes at once','Create and grade assignments','Enter and update student marks','View per-student performance summaries'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: C.textMuted }}>
                    <span style={{ color: C.gold, marginTop: 1 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Student */}
            <div style={{ ...card, borderTop: `3px solid ${C.teal}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎓</div>
              <div style={{ fontFamily: font, fontSize: '1.2rem', fontWeight: 700, color: C.teal, marginBottom: '0.75rem' }}>For Students</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Check attendance across all subjects','View marks and grade history','Track pending and submitted assignments','Get alerts before attendance falls short'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: C.textMuted }}>
                    <span style={{ color: C.teal, marginTop: 1 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', background: C.bg, textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: font, fontSize: '2rem', fontWeight: 700, color: C.text, marginBottom: '1rem' }}>
            Your college, better organised.
          </h2>
          <p style={{ color: C.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Stop chasing attendance sheets and scattered mark lists. EduTrack keeps everything in sync, automatically.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onGoSignup} style={{ background: g, border: 'none', color: '#0d1117', padding: '0.9rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: body }}>
              Create a free account →
            </button>
            <button onClick={onGoSignin} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.text, padding: '0.9rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: body }}>
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, fontWeight: 700, fontSize: 16, color: '#0d1117' }}>E</div>
              <span style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text }}>Edu<span style={{ color: C.gold }}>Track</span></span>
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, maxWidth: 300 }}>
              A student-teacher academic platform built with React and Spring Boot. Track attendance, marks, and assignments in one place.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: '0.08em', marginBottom: '1rem' }}>NAVIGATE</div>
            {[['How it works','#how'],['Features','#features']].map(([l,h]) => (
              <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: C.textMuted, textDecoration: 'none', marginBottom: '0.6rem', fontWeight: 500 }}>{l}</a>
            ))}
            <button onClick={onGoSignin} style={{ display: 'block', fontSize: 13, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: body, padding: 0, marginBottom: '0.6rem', fontWeight: 500 }}>Log in</button>
            <button onClick={onGoSignup} style={{ display: 'block', fontSize: 13, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: body, padding: 0, fontWeight: 500 }}>Sign up</button>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: '0.08em', marginBottom: '1rem' }}>ROLES</div>
            {['Teacher portal','Student portal'].map(l => (
              <div key={l} style={{ fontSize: 13, color: C.textMuted, marginBottom: '0.6rem', fontWeight: 500 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: C.textDim }}>© 2026 EduTrack. Academic management platform.</span>
          <span style={{ fontSize: 12, color: C.textDim }}>React · Spring Boot · MySQL</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
