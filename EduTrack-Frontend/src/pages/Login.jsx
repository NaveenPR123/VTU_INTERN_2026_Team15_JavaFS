import { useState } from "react";
import { font, body, FONTS_IMPORT } from "../theme.js";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import logoSrc from "../assets/edutrack-logo.png";

const ROLES = [
  { id:"student", icon:"🎓", label:"Student",  desc:"View courses, attendance & marks",   color:"#4ecdc4" },
  { id:"teacher", icon:"📚", label:"Teacher",  desc:"Manage courses, marks & assignments", color:"#e8b96a" },
  { id:"admin",   icon:"🛡️", label:"Admin",    desc:"Manage users, courses & system",     color:"#a78bfa" },
];

const FEATURES = [
  { icon:"📅", label:"Smart Attendance",    desc:"Per-course records with shortage alerts",   color:"#4ecdc4" },
  { icon:"📝", label:"Assignment Tracking", desc:"Create, submit & track all deadlines",      color:"#e8b96a" },
  { icon:"📊", label:"Marks & CGPA",        desc:"Auto-calculated grades and performance",    color:"#a78bfa" },
  { icon:"📂", label:"Course Materials",    desc:"Access notes, PDFs & external resources",   color:"#60a5fa" },
];

export default function Login({ onLogin, onGoSignup, onGoForgotPassword }) {
  const { theme: C, isDark } = useTheme();
  const [role,     setRole]     = useState("student");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const g = `linear-gradient(135deg,#e8b96a 0%,#4ecdc4 100%)`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (role !== "admin") {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/system/settings`);
        const settings = await res.json();
        if (settings.maintenanceMode) { setError("Platform is under maintenance. Try again later."); return; }
      } catch {}
    }
    setError(""); setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/auth/login/${role}`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) onLogin(role, data);
      else setError(data.message || "Invalid email or password");
    } catch {
      setLoading(false);
      setError("Cannot connect to server. Make sure the backend is running.");
    }
  };

  const activeRole = ROLES.find(r => r.id === role);

  return (
    <>
      <style>{`
        ${FONTS_IMPORT}
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; font-family:${body}; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes glow-in  { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        .login-card { animation: glow-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .role-btn { transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .role-btn:hover { transform:translateY(-3px) !important; box-shadow:0 10px 28px rgba(0,0,0,0.14) !important; }
        .role-btn.active { transform:translateY(-2px) !important; }
        .input-row { transition: border-color 0.2s, box-shadow 0.2s !important; }
        .input-row:focus-within { border-color:${activeRole?.color}80 !important; box-shadow:0 0 0 3px ${activeRole?.color}18 !important; }
        .submit-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.01); box-shadow:0 14px 36px rgba(232,185,106,0.42) !important; }
        .submit-btn:active:not(:disabled) { transform:translateY(0) scale(0.99); }
        .submit-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .link-txt:hover { color:${C.gold} !important; text-decoration:underline; }
        .feat-row { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
        .feat-row:hover { transform:translateX(5px) !important; box-shadow:0 4px 20px rgba(0,0,0,0.08) !important; }
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", background:C.bg, fontFamily:body, position:"relative", overflow:"hidden" }}>

        {/* — Background grid — */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"44px 44px", opacity:0.45, pointerEvents:"none" }}/>
        {/* Ambient glows */}
        <div style={{ position:"absolute", top:-140, left:-120, width:560, height:560, borderRadius:"50%", background:`radial-gradient(circle,${isDark?"rgba(232,185,106,0.07)":"rgba(184,134,11,0.05)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-100, right:-80, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${isDark?"rgba(78,205,196,0.06)":"rgba(13,148,136,0.04)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"50%", right:"38%", width:320, height:320, borderRadius:"50%", background:`radial-gradient(circle,${isDark?"rgba(167,139,250,0.04)":"rgba(139,92,246,0.03)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>

        {/* Theme toggle */}
        <div style={{ position:"absolute", top:20, right:20, zIndex:100 }}><ThemeToggle/></div>

        {/* ── LEFT panel ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 48px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:440, width:"100%" }}>

            {/* Logo + wordmark */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
              <img src={logoSrc} alt="EduTrack" style={{ width:54, height:54, borderRadius:15, boxShadow:"0 10px 32px rgba(232,185,106,0.4)", objectFit:"cover", animation:"float 4s ease-in-out infinite" }}/>
              <div>
                <div style={{ fontFamily:font, fontSize:28, fontWeight:700, color:C.text, lineHeight:1 }}>Edu<span style={{ color:C.gold }}>Track</span></div>
                <div style={{ fontSize:12, color:C.textDim, marginTop:3, fontWeight:500, letterSpacing:"0.05em" }}>Academic Management Platform</div>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily:font, fontSize:32, fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:12 }}>
              Academic management,<br/>
              <span style={{ background:g, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>all in one place.</span>
            </h2>
            <p style={{ fontSize:14.5, color:C.textMuted, lineHeight:1.8, marginBottom:36 }}>
              A centralized platform connecting students, teachers, and admins — manage attendance, assignments, marks, and course materials in real time.
            </p>

            {/* Feature cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {FEATURES.map((f,i) => (
                <div key={i} className="feat-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:14, cursor:"default", animationDelay:`${i*0.07+0.1}s`, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:-10, top:-10, width:60, height:60, borderRadius:"50%", background:`${f.color}12`, pointerEvents:"none" }}/>
                  <div style={{ width:40, height:40, borderRadius:11, background:`${f.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:`1px solid ${f.color}25` }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:C.text }}>{f.label}</div>
                    <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{f.desc}</div>
                  </div>
                  <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:f.color, animation:"pulse 2s ease infinite" }}/>
                </div>
              ))}
            </div>



          </div>
        </div>

        {/* ── RIGHT form panel ── */}
        <div style={{ width:510, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 48px", background:isDark?"rgba(16,20,28,0.95)":"rgba(255,255,255,0.96)", borderLeft:`1px solid ${C.border}`, position:"relative", zIndex:1, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", boxShadow:isDark?"-28px 0 72px rgba(0,0,0,0.4)":"-28px 0 72px rgba(0,0,0,0.06)" }}>
          <div className="login-card" style={{ width:"100%" }}>

            {/* Form header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>Welcome back</div>
              <h1 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:C.text, marginBottom:6 }}>Sign in to EduTrack</h1>
              <p style={{ fontSize:13.5, color:C.textMuted }}>Choose your role and enter your credentials below.</p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>I am a</div>
              <div style={{ display:"flex", gap:8 }}>
                {ROLES.map(r => {
                  const isSel = role === r.id;
                  return (
                    <button key={r.id} className={`role-btn${isSel?" active":""}`} onClick={() => { setRole(r.id); setEmail(""); setPassword(""); setError(""); }}
                      style={{ flex:1, padding:"14px 8px", borderRadius:14, border:`1.5px solid ${isSel?r.color:C.border}`, background:isSel?`${r.color}16`:"transparent", cursor:"pointer", fontFamily:body, display:"flex", flexDirection:"column", alignItems:"center", gap:7, boxShadow:isSel?`0 0 0 3px ${r.color}20,0 8px 24px rgba(0,0,0,0.1)`:undefined }}>
                      <span style={{ fontSize:22 }}>{r.icon}</span>
                      <span style={{ fontSize:13, fontWeight:isSel?700:500, color:isSel?r.color:C.text }}>{r.label}</span>
                      <span style={{ fontSize:10.5, color:C.textMuted, textAlign:"center", lineHeight:1.4 }}>{r.desc}</span>
                      {isSel && <div style={{ width:6, height:6, borderRadius:"50%", background:r.color, animation:"pulse 2s ease infinite" }}/>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
              <div style={{ flex:1, height:1, background:C.border }}/>
              <span style={{ fontSize:11, color:C.textDim, fontWeight:500 }}>CREDENTIALS</span>
              <div style={{ flex:1, height:1, background:C.border }}/>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Email Address</label>
                <div className="input-row" style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:11, padding:"12px 15px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                    placeholder={role==="student"?"student@college.edu":role==="teacher"?"teacher@college.edu":"admin@institution.edu"}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <label style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim }}>Password</label>
                  <span onClick={onGoForgotPassword} style={{ fontSize:12, color:activeRole?.color||C.gold, cursor:"pointer", fontWeight:500 }}>Forgot password?</span>
                </div>
                <div className="input-row" style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:11, padding:"12px 15px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type={showPass?"text":"password"}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, fontFamily:body, fontWeight:500 }}>
                    {showPass?"Hide":"Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ marginBottom:16, padding:"11px 14px", background:C.roseDim, border:`1px solid rgba(248,113,113,0.25)`, borderRadius:10, fontSize:13, color:C.rose, display:"flex", alignItems:"center", gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}
                style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${activeRole?.color||"#e8b96a"},${role==="student"?"#2d9e97":role==="teacher"?"#c4973a":"#6d28d9"})`, color:"#0d1117", fontFamily:body, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:`0 6px 24px ${activeRole?.color||"#e8b96a"}40`, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
                {loading
                  ? <><span style={{ width:16, height:16, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Signing in…</>
                  : <>{`Sign in as ${activeRole?.label}`} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
              </button>
            </form>

            {/* Tip for role */}
            <div style={{ marginTop:16, padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:12, color:C.textMuted }}>
              {role==="student" && "💡 Students register using the Sign up button. Teachers are added by your admin."}
              {role==="teacher" && "💡 Teacher accounts are created by your institution's admin."}
              {role==="admin" && "💡 The admin account is auto-created on first server startup."}
            </div>

            {role === "student" && (
              <p style={{ textAlign:"center", fontSize:13.5, color:C.textMuted, marginTop:20 }}>
                Don't have an account?{" "}
                <span onClick={onGoSignup} style={{ color:C.gold, cursor:"pointer", fontWeight:600 }}>Create one →</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
