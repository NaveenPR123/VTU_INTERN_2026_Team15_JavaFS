import { useState } from "react";
import { font, body, FONTS_IMPORT } from "./theme";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle.jsx";

const ROLES = [
  { id:"student", icon:"🎓", label:"Student", desc:"View courses, attendance & marks" },
  { id:"teacher", icon:"📚", label:"Teacher", desc:"Manage courses, assignments & marks" },
  { id:"admin",   icon:"🛡️", label:"Admin",   desc:"Manage users, courses & system" },
];

export default function Login({ onLogin, onGoSignup, onGoForgotPassword }) {
  const { theme: C, isDark } = useTheme();

  const [role,     setRole]     = useState("student");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/login/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setLoading(false);
        onLogin(role, data);
      } else {
        setLoading(false);
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot connect to server. Make sure backend is running.");
    }
  };

  return (
    <>
      <style>{`
        ${FONTS_IMPORT}
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; font-family:${body}; transition: background 0.3s, color 0.3s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .login-card { animation: fadeUp 0.5s ease both; }
        .role-btn:hover { border-color:${C.goldMid} !important; background:${C.goldDim} !important; }
        .input-box:focus-within { border-color:${C.goldMid} !important; }
        .submit-btn:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
        .submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .link-txt:hover { color:${C.gold} !important; }
        .social-btn:hover { border-color:${C.goldMid} !important; background:${C.surface2} !important; }
        .feature-row { animation: fadeUp 0.5s ease both; }
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", background:C.bg, fontFamily:body, position:"relative", overflow:"hidden", transition:"background 0.3s" }}>
        {/* BG grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity:0.5, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-120, left:-100, width:480, height:480, borderRadius:"50%", background:`radial-gradient(circle,${isDark?"rgba(232,185,106,0.06)":"rgba(184,134,11,0.04)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-100, right:-80, width:420, height:420, borderRadius:"50%", background:`radial-gradient(circle,${isDark?"rgba(78,205,196,0.05)":"rgba(13,148,136,0.04)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>

        {/* Theme toggle top right */}
        <div style={{ position:"absolute", top:20, right:20, zIndex:100 }}>
          <ThemeToggle/>
        </div>

        {/* ── Left panel ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 48px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:420, width:"100%" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:44 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#e8b96a,#c4973a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontWeight:700, fontSize:24, color:"#0d1117", boxShadow:"0 8px 28px rgba(232,185,106,0.4)", animation:"float 4s ease-in-out infinite" }}>E</div>
              <span style={{ fontFamily:font, fontSize:28, fontWeight:700, color:C.text }}>Edu<span style={{ color:C.gold }}>Track</span></span>
            </div>

            <h2 style={{ fontFamily:font, fontSize:30, fontWeight:600, color:C.text, lineHeight:1.25, marginBottom:14 }}>
              Academic management,<br/><span style={{ color:C.gold }}>simplified.</span>
            </h2>
            <p style={{ fontSize:14.5, color:C.textMuted, lineHeight:1.75, marginBottom:36 }}>
              A centralized platform for students and teachers to track attendance, assignments, and academic performance.
            </p>

            {[
              { icon:"📅", label:"Attendance Tracking",  desc:"Per-course attendance records" },
              { icon:"📝", label:"Assignment Management", desc:"Create, submit & track deadlines" },
              { icon:"📋", label:"Marks & Grades",        desc:"Enter and view academic scores" },
              { icon:"📊", label:"Performance Overview",  desc:"Monitor progress across courses" },
            ].map((f, i) => (
              <div key={i} className="feature-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, marginBottom:10, animationDelay:`${i*0.08+0.2}s`, transition:"background 0.3s" }}>
                <div style={{ width:36, height:36, borderRadius:9, background:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{f.label}</div>
                  <div style={{ fontSize:12, color:C.textMuted }}>{f.desc}</div>
                </div>
              </div>
            ))}


          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ width:490, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 48px", background:C.surface, borderLeft:`1px solid ${C.border}`, position:"relative", zIndex:1, transition:"background 0.3s" }}>
          <div className="login-card" style={{ width:"100%" }}>
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:font, fontSize:26, fontWeight:600, color:C.text, marginBottom:6 }}>Welcome back</h1>
              <p style={{ fontSize:13.5, color:C.textMuted }}>Sign in to your EduTrack account</p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>I am a</div>
              <div style={{ display:"flex", gap:10 }}>
                {ROLES.map(r => (
                  <button key={r.id} className="role-btn"
                    onClick={() => setRole(r.id)}
                    style={{ flex:1, padding:"14px 10px", borderRadius:11, border:`1px solid ${role===r.id ? C.goldMid : C.border}`, background:role===r.id ? C.goldDim : "transparent", cursor:"pointer", fontFamily:body, transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:22 }}>{r.icon}</span>
                    <span style={{ fontSize:14, fontWeight:role===r.id?600:400, color:role===r.id?C.gold:C.text }}>{r.label}</span>
                    <span style={{ fontSize:11, color:C.textMuted, textAlign:"center", lineHeight:1.4 }}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Email Address</label>
                <div className="input-box" style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"11px 14px", transition:"border 0.2s" }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>✉️</span>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                    placeholder={role==="student" ? "student@college.edu" : "teacher@college.edu"}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <label style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim }}>Password</label>
                  <span className="link-txt" onClick={onGoForgotPassword} style={{ fontSize:12, color:C.textMuted, cursor:"pointer", transition:"color 0.2s" }}>Forgot password?</span>
                </div>
                <div className="input-box" style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"11px 14px", transition:"border 0.2s" }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>🔒</span>
                  <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type={showPass?"text":"password"}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, fontFamily:body }}>
                    {showPass?"Hide":"Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ marginBottom:16, padding:"10px 14px", background:C.roseDim, border:`1px solid rgba(248,113,113,0.2)`, borderRadius:9, fontSize:13, color:C.rose }}>⚠️ &nbsp;{error}</div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}
                style={{ width:"100%", padding:"13px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:15, fontWeight:600, cursor:"pointer", transition:"all 0.2s", boxShadow:"0 4px 16px rgba(232,185,106,0.2)" }}>
                {loading ? "Signing in…" : `Sign in as ${ROLES.find(r=>r.id===role)?.label}`}
              </button>
            </form>

            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
              <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:12, color:C.textDim }}>or</span><div style={{ flex:1, height:1, background:C.border }}/>
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:26 }}>
              <button disabled
                style={{ width:"100%", padding:"9px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textDim, fontFamily:body, fontSize:13, cursor:"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.5 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
                Continue with Google
                <span style={{ fontSize:10, background:C.surface2, color:C.textDim, padding:"2px 6px", borderRadius:4, marginLeft:4 }}>Coming soon</span>
              </button>
            </div>

            <p style={{ textAlign:"center", fontSize:13.5, color:C.textMuted }}>
              Don't have an account?{" "}
              <span className="link-txt" onClick={onGoSignup} style={{ color:C.gold, cursor:"pointer", fontWeight:500, transition:"color 0.2s" }}>Create one →</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
