import { useState } from "react";
import { font, body, FONTS_IMPORT } from "../theme.js";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import logoSrc from "../assets/edutrack-logo.png";

const STEPS = ["Your Details", "Set Password", "Verify Email"];
const DEPARTMENTS = ["Computer Science and Engineering","Artificial Intelligence and Machine Learning"];
const YEARS = ["1st Year","2nd Year","3rd Year","4th Year"];

// ── Field — C passed as prop ──
function Field({ label, placeholder, type="text", icon, value, onChange, error, showPass, setShowPass, C }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:error?C.rose:C.textDim, marginBottom:7 }}>{label}</label>
      <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${error?"rgba(248,113,113,0.4)":C.border}`, borderRadius:9, padding:"11px 14px", transition:"border 0.2s" }}>
        {icon && <span style={{ fontSize:15, flexShrink:0 }}>{icon}</span>}
        {type === "password" ? (
          <>
            <input value={value} onChange={onChange} placeholder={placeholder} type={showPass?"text":"password"}
              style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
            <button type="button" onClick={()=>setShowPass(!showPass)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, fontFamily:body }}>
              {showPass?"Hide":"Show"}
            </button>
          </>
        ) : (
          <input value={value} onChange={onChange} placeholder={placeholder} type={type}
            style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
        )}
      </div>
      {error && <div style={{ fontSize:12, color:C.rose, marginTop:5 }}>⚠ {error}</div>}
    </div>
  );
}

// ── SelectField — C passed as prop ──
function SelectField({ label, options, icon, value, onChange, error, C }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:error?C.rose:C.textDim, marginBottom:7 }}>{label}</label>
      <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${error?"rgba(248,113,113,0.4)":C.border}`, borderRadius:9, padding:"11px 14px", transition:"border 0.2s" }}>
        {icon && <span style={{ fontSize:15, flexShrink:0 }}>{icon}</span>}
        <select value={value} onChange={onChange}
          style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:value?C.text:C.textMuted, fontFamily:body, cursor:"pointer" }}>
          <option value="" disabled style={{ background:C.surface2 }}>Select {label.toLowerCase()}</option>
          {options.map(o => <option key={o} value={o} style={{ background:C.surface2 }}>{o}</option>)}
        </select>
      </div>
      {error && <div style={{ fontSize:12, color:C.rose, marginTop:5 }}>⚠ {error}</div>}
    </div>
  );
}

export default function Signup({ onSignup, onGoLogin }) {
  const { theme: C, isDark } = useTheme();

  // ── All state inside component ──
  const [step,        setStep]       = useState(0);
  const role = "student";
  const [loading,     setLoading]    = useState(false);
  const [errors,      setErrors]     = useState({});
  const [error,       setError]      = useState("");
  const [showPass,    setShowPass]   = useState(false);
  const [otp,         setOtp]        = useState("");      // ← OTP input
  const [otpSending,  setOtpSending] = useState(false);  // ← OTP send loading
  const [otpSent,     setOtpSent]    = useState(false);  // ← OTP sent flag

  const [form, setForm] = useState({
    name:"", email:"", password:"", confirm:"",
    department:"", year:"", phone:"", usn:"", employeeId:"", semester:"",
  });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim())               e.name       = "Full name is required";
      if (!form.email.trim())              e.email      = "Email address is required";
      if (!form.department)               e.department = "Department is required";
      if (role==="student" && !form.year) e.year       = "Year of study is required";
      if (role==="student" && !form.usn.trim())        e.usn        = "USN is required";
      if (role==="student" && !form.semester)           e.semester   = "Semester is required";
      if (!form.phone.trim())                           e.phone      = "Phone number is required";
    }
    if (step === 1) {
      if (!form.password)                  e.password = "Password is required";
      if (form.password.length < 6)        e.password = "Minimum 6 characters";
      if (form.password !== form.confirm)  e.confirm  = "Passwords do not match";
    }
    if (step === 2) {
      if (!otp.trim() || otp.length !== 6) e.otp = "Please enter the 6-digit OTP";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Send OTP to email ──
  const sendOtp = async () => {
    setOtpSending(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setOtpSending(false);
    }
  };

  // ── Next button — sends OTP when moving from step 2 → step 3 ──
  const next = async () => {
    if (!validate()) return;
    if (step === 1) {
      // Send OTP before showing step 2 (Verify Email)
      setOtpSending(true);
      setError("");
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email })
        });
        const data = await res.json();
        if (data.success) {
          setOtpSent(true);
          setStep(s => s+1);
        } else {
          setError("Failed to send OTP: " + (data.message || "Try again"));
        }
      } catch {
        setError("Cannot connect to server. Make sure backend is running.");
      } finally {
        setOtpSending(false);
      }
      return;
    }
    setStep(s => s+1);
  };

  const back = () => { setErrors({}); setError(""); setStep(s => s-1); };

  // ── Final submit — verify OTP then register ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if registrations are disabled by admin (from server)
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/system/settings`);
      const settings = await res.json();
      if (!settings.registrationOpen) {
        setError("New registrations are currently disabled. Please contact your administrator.");
        return;
      }
    } catch { /* if server unreachable, allow registration attempt */ }
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      // Step 1: Verify OTP
      const otpRes = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp })
      });
      const otpData = await otpRes.json();

      if (!otpData.success) {
        setLoading(false);
        setError("Invalid or expired OTP. Please try again.");
        return;
      }

      // Step 2: Register account
      const endpoint = role === "student"
        ? `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/auth/register/student`
        : `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/auth/register/teacher`;

      const payload = role === "student"
        ? { name:form.name, email:form.email, password:form.password, department:form.department, year:form.year, phone:form.phone, usn:form.usn, semester:form.semester }
        : { name:form.name, email:form.email, password:form.password, department:form.department, phone:form.phone, employeeId:form.employeeId };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        setLoading(false);
        onSignup("student", data);
      } else {
        setLoading(false);
        setError(data.message || "Registration failed");
      }
    } catch {
      setLoading(false);
      setError("Cannot connect to server. Make sure backend is running.");
    }
  };

  return (
    <>
      <style>{`
        ${FONTS_IMPORT}
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; font-family:${body}; transition: background 0.3s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .form-card  { animation: fadeUp 0.5s ease both; }
        .role-card { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .role-card:hover { border-color:${C.goldMid} !important; transform:translateY(-2px); box-shadow: 0 8px 24px rgba(232,185,106,0.15) !important; }
        .next-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .next-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.01); box-shadow: 0 12px 32px rgba(232,185,106,0.4) !important; }
        .next-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .next-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .back-btn { transition: all 0.2s ease !important; }
        .back-btn:hover  { border-color:${C.goldMid} !important; color:${C.text} !important; background: ${C.surface2} !important; }
        .link-txt { transition: color 0.2s ease !important; }
        .link-txt:hover  { color:${C.gold} !important; text-decoration: underline; }
        .otp-input { letter-spacing: 0.3em; font-size:22px !important; text-align:center; font-family:${body}; }
        div[style*="border-radius:9px"][style*="padding:\"11px 14px\""] { transition: border-color 0.2s, box-shadow 0.2s !important; }
        div[style*="border-radius:9px"]:focus-within { border-color:${C.gold}80 !important; box-shadow: 0 0 0 3px ${C.gold}18 !important; }
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", background:C.bg, fontFamily:body, position:"relative", overflow:"hidden", transition:"background 0.3s" }}>

        {/* BG */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity:0.4, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-100, right:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(78,205,196,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-80, left:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,185,106,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>

        {/* Theme toggle */}
        <div style={{ position:"absolute", top:20, right:20, zIndex:100 }}>
          <ThemeToggle/>
        </div>

        {/* ── Left panel ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 48px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:400, width:"100%" }}>

            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:40 }}>
              <img src={logoSrc} alt="EduTrack" style={{ width:52, height:52, borderRadius:14, boxShadow:"0 10px 32px rgba(232,185,106,0.4)", objectFit:"cover", animation:"float 4s ease-in-out infinite" }}/>
              <div>
                <div style={{ fontFamily:font, fontSize:26, fontWeight:700, color:C.text, lineHeight:1 }}>Edu<span style={{ color:C.gold }}>Track</span></div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:3, fontWeight:500, letterSpacing:"0.05em" }}>Academic Management Platform</div>
              </div>
            </div>

            <h2 style={{ fontFamily:font, fontSize:30, fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:12 }}>
              Join EduTrack as a<br/>
              <span style={{ background:`linear-gradient(135deg,#e8b96a 0%,#4ecdc4 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Student.</span>
            </h2>
            <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.8, marginBottom:32 }}>
              Create your student account to track attendance, submit assignments, view marks, and access course materials — all in one place.
            </p>

            {/* Step tracker */}
            <div style={{ marginBottom:32 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%",
                      border:`2px solid ${step>i?"#4ecdc4":step===i?"#e8b96a":C.border}`,
                      background:step>i?"rgba(78,205,196,0.15)":step===i?"rgba(232,185,106,0.15)":"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:13, fontWeight:700,
                      color:step>i?"#4ecdc4":step===i?"#e8b96a":C.textDim,
                      transition:"all 0.3s", boxShadow:step===i?`0 0 0 4px ${"#e8b96a"}18`:undefined }}>
                      {step>i?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>:i+1}
                    </div>
                    {i < STEPS.length-1 && <div style={{ width:2, height:28, background:step>i?"#4ecdc4":C.border, transition:"background 0.4s", margin:"4px 0", borderRadius:1 }}/>}
                  </div>
                  <div style={{ paddingBottom:i<STEPS.length-1?28:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:step===i?C.text:C.textMuted }}>{s}</div>
                    <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>
                      {i===0?"Name, email, department & USN":i===1?"Create a secure password":"6-digit OTP sent to your email"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* What you get */}
            <div style={{ padding:"16px 18px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:14 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>What you get</div>
              {[["📅","#4ecdc4","Attendance tracking with shortage alerts"],["📝","#e8b96a","Submit assignments & check feedback"],["📊","#a78bfa","View marks and auto-calculated CGPA"],["📂","#60a5fa","Access all course materials & notes"]].map(([icon,col,text]) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, fontSize:13, color:C.textMuted }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${col}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{icon}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ width:520, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 48px", background: isDark ? "rgba(22,27,37,0.92)" : "rgba(255,255,255,0.92)", borderLeft:`1px solid ${C.border}`, position:"relative", zIndex:1, transition:"background 0.3s", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", boxShadow: isDark ? "-20px 0 60px rgba(0,0,0,0.3)" : "-20px 0 60px rgba(0,0,0,0.06)" }}>
          <div className="form-card" style={{ width:"100%" }}>

            {/* Progress bar */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                {STEPS.map((_,i) => (
                  <div key={i} style={{ flex:1, height:3, borderRadius:3, background:step>=i?C.gold:C.surface2, transition:"background 0.3s" }}/>
                ))}
              </div>
              <div style={{ fontSize:11, color:C.textDim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Step {step+1} of {STEPS.length}</div>
              <h1 style={{ fontFamily:font, fontSize:24, fontWeight:600, color:C.text }}>{STEPS[step]}</h1>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── Step 0: Role ── */}
              {/* ── Step 0: Personal details ── */}
              {step===0 && (
                <div style={{ marginBottom:8 }}>
                  <Field label="Full Name"      placeholder="e.g. Arjun Kumar"    icon="👤" value={form.name}       onChange={set("name")}       error={errors.name}       C={C} />
                  <Field label="Email Address"  placeholder="you@institution.edu" icon="✉️" value={form.email}      onChange={set("email")}      error={errors.email}      C={C} type="email" />
                  <SelectField label="Department" options={DEPARTMENTS}            icon="📂" value={form.department} onChange={set("department")} error={errors.department} C={C} />
                  {role==="student" && (
                    <>
                      <SelectField label="Year of Study" options={YEARS}            icon="📅" value={form.year}       onChange={set("year")}       error={errors.year}       C={C} />
                      <SelectField label="Semester" options={({"1st Year":["Sem 1","Sem 2"],"2nd Year":["Sem 3","Sem 4"],"3rd Year":["Sem 5","Sem 6"],"4th Year":["Sem 7","Sem 8"]})[form.year]||["Sem 1","Sem 2"]} icon="📆" value={form.semester} onChange={set("semester")} error={errors.semester} C={C} />
                      <Field label="USN / Registration Number" placeholder="e.g. 1VT22CS001" icon="🪪" value={form.usn} onChange={set("usn")} error={errors.usn} C={C} />
                    </>
                  )}
                  <Field label="Phone Number" placeholder="e.g. 9876543210" icon="📞" value={form.phone} onChange={set("phone")} error={errors.phone} C={C} />

                </div>
              )}

              {/* ── Step 2: Password ── */}
              {step===1 && (
                <div style={{ marginBottom:8 }}>
                  <Field label="Create Password"  placeholder="Minimum 6 characters" icon="🔒" value={form.password} onChange={set("password")} error={errors.password} type="password" showPass={showPass} setShowPass={setShowPass} C={C} />
                  <Field label="Confirm Password" placeholder="Re-enter password"    icon="🔐" value={form.confirm}  onChange={set("confirm")}  error={errors.confirm}  type="password" showPass={showPass} setShowPass={setShowPass} C={C} />

                  {/* Account summary */}
                  <div style={{ padding:"16px 18px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, marginTop:8 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:14 }}>Account Summary</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {[
                        ["Role",       "🎓 Student"],
                        ["Name",       form.name       || "—"],
                        ["Email",      form.email      || "—"],
                        ["Department", form.department || "—"],
                        ["Year",       form.year       || "—"],
                        ["Semester",   form.semester   || "—"],
                        ["USN",        form.usn        || "—"],
                        ["Phone",      form.phone      || "—"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:C.textDim }}>{k}</span>
                          <span style={{ fontSize:13, color:C.text, fontWeight:500, textAlign:"right", maxWidth:"60%", wordBreak:"break-all" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ── Step 3: OTP Verification ── */}
              {step===2 && (
                <div style={{ marginBottom:8 }}>
                  {/* Email sent banner */}
                  <div style={{ textAlign:"center", marginBottom:28 }}>
                    <div style={{ width:64, height:64, borderRadius:"50%", background:C.tealDim, border:`2px solid ${C.teal}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 14px" }}>📧</div>
                    <div style={{ fontFamily:font, fontSize:18, fontWeight:600, color:C.text, marginBottom:8 }}>Check your email!</div>
                    <div style={{ fontSize:13.5, color:C.textMuted, lineHeight:1.6 }}>
                      We sent a 6-digit OTP to<br/>
                      <strong style={{ color:C.gold }}>{form.email}</strong>
                    </div>
                    {otpSent && (
                      <div style={{ marginTop:10, padding:"6px 14px", background:C.tealDim, border:`1px solid ${C.teal}`, borderRadius:20, display:"inline-block", fontSize:12, color:C.teal }}>
                        ✓ OTP sent successfully
                      </div>
                    )}
                  </div>

                  {/* OTP input */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:errors.otp?C.rose:C.textDim, marginBottom:7 }}>Enter OTP</label>
                    <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${errors.otp?"rgba(248,113,113,0.4)":C.border}`, borderRadius:9, padding:"14px", transition:"border 0.2s" }}>
                      <span style={{ fontSize:15, flexShrink:0 }}>🔢</span>
                      <input
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                        placeholder="• • • • • •"
                        maxLength={6}
                        className="otp-input"
                        style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:22, color:C.text, fontFamily:body, letterSpacing:"0.3em", textAlign:"center" }}
                      />
                    </div>
                    {errors.otp && <div style={{ fontSize:12, color:C.rose, marginTop:5 }}>⚠ {errors.otp}</div>}
                  </div>

                  {/* Resend OTP */}
                  <div style={{ textAlign:"center", marginTop:12 }}>
                    <span style={{ fontSize:13, color:C.textMuted }}>
                      Didn't receive it?{" "}
                      <span
                        className="link-txt"
                        onClick={otpSending ? undefined : sendOtp}
                        style={{ color:C.gold, cursor:otpSending?"not-allowed":"pointer", fontWeight:500, transition:"color 0.2s" }}>
                        {otpSending ? "Sending…" : "Resend OTP"}
                      </span>
                    </span>
                  </div>

                  {/* OTP expires note */}
                  <div style={{ marginTop:16, padding:"10px 14px", background:C.goldDim, border:`1px solid ${C.goldMid}`, borderRadius:9, fontSize:12, color:C.gold, textAlign:"center" }}>
                    ⏳ OTP expires in 10 minutes
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div style={{ marginBottom:14, padding:"10px 14px", background:C.roseDim, border:`1px solid rgba(248,113,113,0.2)`, borderRadius:9, fontSize:13, color:C.rose }}>
                  ⚠️ &nbsp;{error}
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {step>0 && step<3 && (
                  <button type="button" className="back-btn" onClick={back}
                    style={{ flex:1, padding:"12px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}>
                    ← Back
                  </button>
                )}

                {step < STEPS.length-1 ? (
                  // Continue button (steps 0-2)
                  <button type="button" className="next-btn"
                    onClick={next}
                    disabled={otpSending}
                    style={{ flex:2, padding:"12px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:otpSending?"not-allowed":"pointer", boxShadow:"0 4px 20px rgba(232,185,106,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {otpSending ? (
                      <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Sending OTP…</>
                    ) : (
                      <>Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    )}
                  </button>
                ) : (
                  // Final submit button (step 3)
                  <button type="submit" className="next-btn"
                    disabled={loading || otp.length !== 6}
                    style={{ flex:2, padding:"12px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:(loading||otp.length!==6)?"not-allowed":"pointer", opacity:(loading||otp.length!==6)?0.6:1, boxShadow:"0 4px 20px rgba(232,185,106,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {loading ? (
                      <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Creating account…</>
                    ) : (
                      <>{`Verify & Register ${role==="student"?"🎓":"📚"}`}</>
                    )}
                  </button>
                )}
              </div>
            </form>

            <p style={{ textAlign:"center", fontSize:13.5, color:C.textMuted, marginTop:22 }}>
              Already registered?{" "}
              <span className="link-txt" onClick={onGoLogin} style={{ color:C.gold, cursor:"pointer", fontWeight:500, transition:"color 0.2s" }}>Sign in →</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
