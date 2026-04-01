import { useState } from "react";
import { font, body, FONTS_IMPORT } from "./theme";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle.jsx";

const STEPS = ["Choose Role", "Your Details", "Set Password", "Verify Email"];
const DEPARTMENTS = ["Computer Science","Information Science","Electronics","Mechanical","Civil","Electrical","Biotechnology","Chemical"];
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
  const { theme: C } = useTheme();

  // ── All state inside component ──
  const [step,        setStep]       = useState(0);
  const [role,        setRole]       = useState("student");
  const [loading,     setLoading]    = useState(false);
  const [errors,      setErrors]     = useState({});
  const [error,       setError]      = useState("");
  const [showPass,    setShowPass]   = useState(false);
  const [otp,         setOtp]        = useState("");      // ← OTP input
  const [otpSending,  setOtpSending] = useState(false);  // ← OTP send loading
  const [otpSent,     setOtpSent]    = useState(false);  // ← OTP sent flag

  const [form, setForm] = useState({
    name:"", email:"", password:"", confirm:"",
    department:"", year:"",
  });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim())               e.name       = "Full name is required";
      if (!form.email.trim())              e.email      = "Email address is required";
      if (!form.department)               e.department = "Department is required";
      if (role==="student" && !form.year) e.year       = "Year of study is required";
    }
    if (step === 2) {
      if (!form.password)                  e.password = "Password is required";
      if (form.password.length < 6)        e.password = "Minimum 6 characters";
      if (form.password !== form.confirm)  e.confirm  = "Passwords do not match";
    }
    if (step === 3) {
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
      const res = await fetch("http://localhost:8080/api/otp/send", {
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
    if (step === 2) {
      // Send OTP before showing step 3
      setOtpSending(true);
      setError("");
      try {
        const res = await fetch("http://localhost:8080/api/otp/send", {
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
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      // Step 1: Verify OTP
      const otpRes = await fetch("http://localhost:8080/api/otp/verify", {
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
        ? "http://localhost:8080/api/auth/register/student"
        : "http://localhost:8080/api/auth/register/teacher";

      const payload = role === "student"
        ? { name:form.name, email:form.email, password:form.password, department:form.department, year:form.year }
        : { name:form.name, email:form.email, password:form.password, department:form.department };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        setLoading(false);
        onSignup(role, data);
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
        .form-card  { animation: fadeUp 0.5s ease both; }
        .role-card:hover { border-color:${C.goldMid} !important; transform:translateY(-2px); }
        .next-btn:hover:not(:disabled)  { opacity:0.88; transform:translateY(-1px); }
        .next-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .back-btn:hover  { border-color:${C.goldMid} !important; color:${C.text} !important; }
        .link-txt:hover  { color:${C.gold} !important; }
        .otp-input { letter-spacing: 0.3em; font-size:22px !important; text-align:center; font-family:${body}; }
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
              <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#e8b96a,#c4973a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontWeight:700, fontSize:22, color:"#0d1117", boxShadow:"0 8px 28px rgba(232,185,106,0.4)", animation:"float 4s ease-in-out infinite" }}>E</div>
              <span style={{ fontFamily:font, fontSize:26, fontWeight:700, color:C.text }}>Edu<span style={{ color:C.gold }}>Track</span></span>
            </div>

            <h2 style={{ fontFamily:font, fontSize:28, fontWeight:600, color:C.text, lineHeight:1.3, marginBottom:14 }}>
              Join EduTrack as a<br/><span style={{ color:C.gold }}>{role==="student"?"Student":"Teacher"}.</span>
            </h2>
            <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.75, marginBottom:36 }}>
              {role==="student"
                ? "Track your courses, attendance, assignments and academic performance all in one place."
                : "Manage your courses, mark attendance, create assignments and enter student marks efficiently."}
            </p>

            {/* Step tracker */}
            <div style={{ marginBottom:36 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${step>i?C.teal:step===i?C.gold:C.border}`, background:step>i?C.tealDim:step===i?C.goldDim:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:step>i?C.teal:step===i?C.gold:C.textDim, transition:"all 0.3s" }}>
                      {step>i?"✓":i+1}
                    </div>
                    {i < STEPS.length-1 && <div style={{ width:2, height:28, background:step>i?C.teal:C.border, transition:"background 0.4s", margin:"4px 0" }}/>}
                  </div>
                  <div style={{ paddingBottom:i<STEPS.length-1?28:0 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:step===i?C.text:C.textMuted }}>{s}</div>
                    <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>
                      {i===0?"Select your role":i===1?"Your name, email & department":i===2?"Secure your account":"Enter OTP sent to your email"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DB schema */}
            <div style={{ padding:"14px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>
                {role==="student"?"Student":"Teacher"} Account Fields
              </div>
              {(role==="student"
                ? [["👤","Name"],["✉️","Email"],["🔒","Password"],["📂","Department"],["📅","Year"]]
                : [["👤","Name"],["✉️","Email"],["🔒","Password"],["📂","Department"]]
              ).map(([ic,f]) => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, fontSize:12, color:C.textMuted }}>
                  <span>{ic}</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ width:520, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 48px", background:C.surface, borderLeft:`1px solid ${C.border}`, position:"relative", zIndex:1, transition:"background 0.3s" }}>
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
              {step===0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
                  {[
                    { id:"student", icon:"🎓", label:"Student", desc:"View courses, attendance, assignments & marks", fields:"Name · Email · Password · Department · Year" },
                    { id:"teacher", icon:"📚", label:"Teacher", desc:"Manage courses, attendance, assignments & marks", fields:"Name · Email · Password · Department" },
                  ].map(r => (
                    <div key={r.id} className="role-card" onClick={()=>setRole(r.id)}
                      style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px", borderRadius:12, border:`1px solid ${role===r.id?C.goldMid:C.border}`, background:role===r.id?C.goldDim:C.surface2, cursor:"pointer", transition:"all 0.2s" }}>
                      <div style={{ width:44, height:44, borderRadius:11, background:role===r.id?"rgba(232,185,106,0.2)":C.surface3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{r.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:600, color:role===r.id?C.gold:C.text, marginBottom:4 }}>{r.label}</div>
                        <div style={{ fontSize:12.5, color:C.textMuted, lineHeight:1.5, marginBottom:8 }}>{r.desc}</div>
                        <div style={{ fontSize:11, color:C.textDim, fontStyle:"italic" }}>Fields: {r.fields}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${role===r.id?C.gold:C.border}`, background:role===r.id?C.gold:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:"#0d1117", fontWeight:700, marginTop:2 }}>
                        {role===r.id&&"✓"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Step 1: Personal details ── */}
              {step===1 && (
                <div style={{ marginBottom:8 }}>
                  <Field label="Full Name"      placeholder="e.g. Arjun Kumar"    icon="👤" value={form.name}       onChange={set("name")}       error={errors.name}       C={C} />
                  <Field label="Email Address"  placeholder="you@institution.edu" icon="✉️" value={form.email}      onChange={set("email")}      error={errors.email}      C={C} type="email" />
                  <SelectField label="Department" options={DEPARTMENTS}            icon="📂" value={form.department} onChange={set("department")} error={errors.department} C={C} />
                  {role==="student" && (
                    <SelectField label="Year of Study" options={YEARS}            icon="📅" value={form.year}       onChange={set("year")}       error={errors.year}       C={C} />
                  )}
                </div>
              )}

              {/* ── Step 2: Password ── */}
              {step===2 && (
                <div style={{ marginBottom:8 }}>
                  <Field label="Create Password"  placeholder="Minimum 6 characters" icon="🔒" value={form.password} onChange={set("password")} error={errors.password} type="password" showPass={showPass} setShowPass={setShowPass} C={C} />
                  <Field label="Confirm Password" placeholder="Re-enter password"    icon="🔐" value={form.confirm}  onChange={set("confirm")}  error={errors.confirm}  type="password" showPass={showPass} setShowPass={setShowPass} C={C} />

                  {/* Account summary */}
                  <div style={{ padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, marginTop:8 }}>
                    <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>Account Summary</div>
                    {[
                      ["Role",       role==="student"?"🎓 Student":"📚 Teacher"],
                      ["Name",       form.name       || "—"],
                      ["Email",      form.email      || "—"],
                      ["Department", form.department || "—"],
                      ...(role==="student" ? [["Year", form.year || "—"]] : []),
                    ].map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:13 }}>
                        <span style={{ color:C.textMuted }}>{k}</span>
                        <span style={{ color:C.text, fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3: OTP Verification ── */}
              {step===3 && (
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
                    style={{ flex:2, padding:"12px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:600, cursor:otpSending?"not-allowed":"pointer", transition:"all 0.2s", boxShadow:"0 4px 16px rgba(232,185,106,0.2)", opacity:otpSending?0.7:1 }}>
                    {otpSending ? "Sending OTP…" : "Continue →"}
                  </button>
                ) : (
                  // Final submit button (step 3)
                  <button type="submit" className="next-btn"
                    disabled={loading || otp.length !== 6}
                    style={{ flex:2, padding:"12px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:600, cursor:(loading||otp.length!==6)?"not-allowed":"pointer", transition:"all 0.2s", opacity:(loading||otp.length!==6)?0.6:1, boxShadow:"0 4px 16px rgba(232,185,106,0.2)" }}>
                    {loading ? "Creating account…" : `Verify & Register ${role==="student"?"🎓":"📚"}`}
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
