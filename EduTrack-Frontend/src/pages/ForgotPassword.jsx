import { useState } from "react";
import { font, body } from "../theme.js";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import logoSrc from "../assets/edutrack-logo.png";

const ROLES = [
  { id:"student", icon:"🎓", label:"Student", color:"#4ecdc4" },
  { id:"teacher", icon:"📚", label:"Teacher", color:"#e8b96a" },
  { id:"admin",   icon:"🛡️", label:"Admin",   color:"#a78bfa" },
];
const STEPS = ["Enter Email","Verify OTP","Reset Password"];

export default function ForgotPassword({ onGoBack }) {
  const { theme: C, isDark } = useTheme();
  const [step,            setStep]            = useState(0);
  const [role,            setRole]            = useState("student");
  const [email,           setEmail]           = useState("");
  const [otp,             setOtp]             = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  const activeRole = ROLES.find(r => r.id === role);
  const g = `linear-gradient(135deg,#e8b96a 0%,#4ecdc4 100%)`;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL||"http://localhost:8080"}/api/otp/forgot-password`,{
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email, role})
      });
      const data = await res.json();
      if (data.success) { setSuccess("OTP sent!"); setStep(1); }
      else setError(data.message||"Failed to send OTP");
    } catch { setError("Cannot connect to server. Make sure backend is running."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()||otp.length!==6) { setError("Please enter the 6-digit OTP"); return; }
    setError(""); setSuccess("OTP verified!"); setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword||newPassword.length<6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword!==confirmPassword) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL||"http://localhost:8080"}/api/auth/reset-password/${role}`,{
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,otp,newPassword})
      });
      const data = await res.json();
      if (data.success) { setSuccess("Password reset! Redirecting…"); setTimeout(()=>onGoBack(),2000); }
      else setError(data.message||"Failed to reset password");
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:${body};background:${C.bg};color:${C.text};}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
        .fp-btn{transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1)!important;}
        .fp-btn:hover:not(:disabled){transform:translateY(-2px) scale(1.01);box-shadow:0 14px 36px rgba(232,185,106,0.42)!important;}
        .fp-btn:disabled{opacity:0.65;cursor:not-allowed;}
        .fp-back{transition:all 0.2s ease!important;}
        .fp-back:hover{background:${C.surface2}!important;border-color:${C.gold}60!important;color:${C.gold}!important;}
        .fp-role{transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1)!important;}
        .fp-role:hover{transform:translateY(-3px)!important;box-shadow:0 10px 28px rgba(0,0,0,0.14)!important;}
        .card-in{animation:fadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both;}
      `}</style>

      {/* BG */}
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,backgroundSize:"44px 44px",opacity:0.4,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:-120,left:-100,width:520,height:520,borderRadius:"50%",background:`radial-gradient(circle,${isDark?"rgba(232,185,106,0.06)":"rgba(184,134,11,0.05)"} 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-80,right:-80,width:440,height:440,borderRadius:"50%",background:`radial-gradient(circle,${isDark?"rgba(78,205,196,0.05)":"rgba(13,148,136,0.04)"} 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

      <div style={{position:"fixed",top:20,right:20,zIndex:999}}><ThemeToggle/></div>

      <div style={{minHeight:"100vh",display:"flex",position:"relative",zIndex:1}}>

        {/* ── LEFT panel ── */}
        <div style={{width:"40%",minWidth:360,background:isDark?"rgba(16,20,28,0.97)":"rgba(250,251,252,0.97)",borderRight:`1px solid ${C.border}`,padding:"60px 48px",display:"flex",flexDirection:"column",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:56}}>
            <img src={logoSrc} alt="EduTrack" style={{width:52,height:52,borderRadius:14,boxShadow:"0 10px 32px rgba(232,185,106,0.4)",objectFit:"cover",animation:"float 4s ease-in-out infinite"}}/>
            <div>
              <div style={{fontFamily:font,fontSize:26,fontWeight:700,color:C.text,lineHeight:1}}>Edu<span style={{color:C.gold}}>Track</span></div>
              <div style={{fontSize:11,color:C.textDim,marginTop:3,fontWeight:500,letterSpacing:"0.05em"}}>Academic Management Platform</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{marginBottom:44}}>
            <h2 style={{fontFamily:font,fontSize:30,fontWeight:700,color:C.text,lineHeight:1.2,marginBottom:12}}>
              Forgot your<br/>
              <span style={{background:g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>password?</span>
            </h2>
            <p style={{fontSize:14,color:C.textMuted,lineHeight:1.8}}>
              No worries — enter your email, verify with a one-time code, and set a new secure password in under a minute.
            </p>
          </div>

          {/* Step tracker */}
          <div style={{marginBottom:"auto"}}>
            {STEPS.map((s,i) => (
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",
                    border:`2px solid ${step>i?"#4ecdc4":step===i?"#e8b96a":C.border}`,
                    background:step>i?"rgba(78,205,196,0.15)":step===i?"rgba(232,185,106,0.15)":"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,fontWeight:700,color:step>i?"#4ecdc4":step===i?"#e8b96a":C.textDim,
                    transition:"all 0.3s",boxShadow:step===i?"0 0 0 4px rgba(232,185,106,0.15)":undefined}}>
                    {step>i
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : i+1}
                  </div>
                  {i<STEPS.length-1 && <div style={{width:2,height:32,background:step>i?"#4ecdc4":C.border,transition:"background 0.4s",margin:"5px 0",borderRadius:1}}/>}
                </div>
                <div style={{paddingBottom:i<STEPS.length-1?32:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:step>=i?C.text:C.textMuted}}>{s}</div>
                  <div style={{fontSize:12,color:C.textDim,marginTop:2}}>
                    {i===0?"Enter your registered email address":i===1?"6-digit code sent to your inbox":"Create a strong new password"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div style={{padding:"16px 18px",background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`,border:`1px solid ${C.border}`,borderRadius:14,display:"flex",gap:12,alignItems:"flex-start",marginTop:40}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(78,205,196,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔒</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>Secure Reset Process</div>
              <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>OTPs expire in 10 minutes. Never share your OTP or password with anyone.</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT form panel ── */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 72px"}}>
          <div className="card-in" style={{width:"100%",maxWidth:480}}>

            {/* Progress bar */}
            <div style={{display:"flex",gap:6,marginBottom:32}}>
              {STEPS.map((_,i) => (
                <div key={i} style={{flex:1,height:4,borderRadius:99,background:step>=i?activeRole?.color||C.gold:C.surface2,transition:"background 0.3s"}}/>
              ))}
            </div>

            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textDim,marginBottom:6}}>Step {step+1} of {STEPS.length}</div>
            <h1 style={{fontFamily:font,fontSize:30,fontWeight:700,color:C.text,marginBottom:28}}>{STEPS[step]}</h1>

            {/* ── STEP 0 ── */}
            {step===0 && (
              <form onSubmit={handleSendOtp} style={{display:"flex",flexDirection:"column",gap:20}}>
                <div>
                  <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textDim,marginBottom:10}}>I am a</div>
                  <div style={{display:"flex",gap:10}}>
                    {ROLES.map(r => {
                      const isSel = role===r.id;
                      return (
                        <button key={r.id} type="button" className="fp-role" onClick={()=>{ setRole(r.id); setEmail(""); setError(""); setSuccess(""); }}
                          style={{flex:1,padding:"14px 8px",borderRadius:14,border:`1.5px solid ${isSel?r.color:C.border}`,background:isSel?`${r.color}16`:"transparent",cursor:"pointer",fontFamily:body,display:"flex",flexDirection:"column",alignItems:"center",gap:7,boxShadow:isSel?`0 0 0 3px ${r.color}20,0 8px 24px rgba(0,0,0,0.1)`:undefined}}>
                          <span style={{fontSize:22}}>{r.icon}</span>
                          <span style={{fontSize:13,fontWeight:isSel?700:500,color:isSel?r.color:C.text}}>{r.label}</span>
                          {isSel && <div style={{width:6,height:6,borderRadius:"50%",background:r.color,animation:"pulse 2s ease infinite"}}/>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textDim,marginBottom:8}}>Email Address</label>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",transition:"border-color 0.2s, box-shadow 0.2s"}}
                    onFocus={e=>{e.currentTarget.style.borderColor=`${activeRole?.color}80`;e.currentTarget.style.boxShadow=`0 0 0 3px ${activeRole?.color}15`;}}
                    onBlur={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>

                    <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                      placeholder={role==="student"?"student@college.edu":role==="teacher"?"teacher@college.edu":"admin@institution.edu"}
                      style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:14,color:C.text,fontFamily:body}}/>
                                    </div>
                </div>

                {error && <div style={{padding:"11px 14px",background:C.roseDim,border:`1px solid rgba(248,113,113,0.25)`,borderRadius:10,fontSize:13,color:C.rose,display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}

                <button type="submit" className="fp-btn" disabled={loading}
                  style={{padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${activeRole?.color||"#e8b96a"},${role==="student"?"#2d9e97":role==="teacher"?"#c4973a":"#6d28d9"})`,color:"#0d1117",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:body,boxShadow:`0 6px 24px ${activeRole?.color||"#e8b96a"}40`,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {loading ? <><span style={{width:15,height:15,border:"2px solid #0d1117",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/> Sending…</> : <>Send OTP <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
                </button>
              </form>
            )}

            {/* ── STEP 1 ── */}
            {step===1 && (
              <form onSubmit={handleVerifyOtp} style={{display:"flex",flexDirection:"column",gap:20}}>
                <div style={{padding:"16px 18px",background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`,border:`1px solid ${C.border}`,borderRadius:14,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:48,height:48,borderRadius:14,background:"rgba(78,205,196,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📧</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>Check your email!</div>
                    <div style={{fontSize:13,color:C.textMuted}}>We sent a 6-digit code to <strong style={{color:C.gold}}>{email}</strong></div>
                  </div>
                </div>

                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textDim,marginBottom:8}}>Enter OTP</label>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",transition:"border-color 0.2s"}}>
                    <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                      placeholder="• • • • • •" maxLength={6}
                      style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:26,color:C.text,fontFamily:body,letterSpacing:"0.4em",textAlign:"center"}}/>
                  </div>
                  <div style={{textAlign:"center",marginTop:12,fontSize:13,color:C.textDim}}>
                    Didn't receive it?{" "}
                    <button type="button" onClick={handleSendOtp} disabled={loading}
                      style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontWeight:600,fontFamily:body}}>
                      Resend OTP
                    </button>
                  </div>
                  <div style={{marginTop:14,padding:"10px 14px",background:C.goldDim,border:`1px solid ${C.goldMid}`,borderRadius:10,fontSize:12,color:C.gold,textAlign:"center"}}>
                    ⏳ OTP expires in 10 minutes
                  </div>
                </div>

                {error && <div style={{padding:"11px 14px",background:C.roseDim,border:`1px solid rgba(248,113,113,0.25)`,borderRadius:10,fontSize:13,color:C.rose,display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
                {success && <div style={{padding:"11px 14px",background:C.tealDim,border:`1px solid ${C.teal}40`,borderRadius:10,fontSize:13,color:C.teal,display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{success}</div>}

                <div style={{display:"flex",gap:12}}>
                  <button type="button" className="fp-back" onClick={()=>{setStep(0);setError("");setSuccess("");}}
                    style={{flex:1,padding:"13px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontFamily:body,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                    ← Back
                  </button>
                  <button type="submit" className="fp-btn" disabled={loading||otp.length!==6}
                    style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#e8b96a,#4ecdc4)",color:"#0d1117",fontFamily:body,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 24px rgba(232,185,106,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:otp.length!==6?0.6:1}}>
                    Verify OTP <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2 ── */}
            {step===2 && (
              <form onSubmit={handleResetPassword} style={{display:"flex",flexDirection:"column",gap:18}}>
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textDim,marginBottom:8}}>New Password</label>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",transition:"border-color 0.2s, box-shadow 0.2s"}}
                    onFocus={e=>{e.currentTarget.style.borderColor=`${activeRole?.color}80`;e.currentTarget.style.boxShadow=`0 0 0 3px ${activeRole?.color}15`;}}
                    onBlur={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

                    <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Minimum 6 characters" type={showPass?"text":"password"}
                      style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:14,color:C.text,fontFamily:body}}/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.textDim,fontFamily:body,fontWeight:500}}>{showPass?"Hide":"Show"}</button>
                                    </div>
                  {/* Password strength */}
                  <div style={{display:"flex",gap:4,marginTop:8}}>
                    {[0,1,2,3].map(i => {
                      const strength = newPassword.length===0?0:newPassword.length<6?1:newPassword.length<10?2:(/[A-Z]/.test(newPassword)&&/[0-9]/.test(newPassword))?4:3;
                      const col = strength<=1?"#f87171":strength===2?"#e8b96a":strength===3?"#60a5fa":"#4ecdc4";
                      return <div key={i} style={{flex:1,height:3,borderRadius:99,background:i<strength?col:C.border,transition:"background 0.3s"}}/>;
                    })}
                  </div>
                  <div style={{fontSize:11,color:C.textDim,marginTop:5}}>Use 10+ chars with uppercase &amp; numbers for a strong password</div>
                </div>

                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textDim,marginBottom:8}}>Confirm Password</label>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",transition:"border-color 0.2s, box-shadow 0.2s"}}
                    onFocus={e=>{e.currentTarget.style.borderColor=`${activeRole?.color}80`;e.currentTarget.style.boxShadow=`0 0 0 3px ${activeRole?.color}15`;}}
                    onBlur={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={confirmPassword&&confirmPassword===newPassword?"#4ecdc4":C.textDim} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

                    <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter new password" type={showPass?"text":"password"}
                      style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:14,color:C.text,fontFamily:body}}/>
                                    </div>
                  {confirmPassword && confirmPassword===newPassword && (
                    <div style={{fontSize:12,color:"#4ecdc4",marginTop:6,display:"flex",alignItems:"center",gap:5}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Passwords match
                    </div>
                  )}
                </div>

                {error && <div style={{padding:"11px 14px",background:C.roseDim,border:`1px solid rgba(248,113,113,0.25)`,borderRadius:10,fontSize:13,color:C.rose,display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
                {success && <div style={{padding:"11px 14px",background:C.tealDim,border:`1px solid ${C.teal}40`,borderRadius:10,fontSize:13,color:C.teal,display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{success}</div>}

                <button type="submit" className="fp-btn" disabled={loading}
                  style={{padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#e8b96a,#4ecdc4)",color:"#0d1117",fontFamily:body,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 24px rgba(232,185,106,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {loading ? <><span style={{width:15,height:15,border:"2px solid #0d1117",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/> Resetting…</> : <>Reset Password <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></>}
                </button>
              </form>
            )}

            <div style={{marginTop:28,textAlign:"center",fontSize:13.5,color:C.textMuted}}>
              Remember your password?{" "}
              <span onClick={onGoBack} style={{color:C.gold,cursor:"pointer",fontWeight:600}}>Sign in →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
