import { useState } from "react";
import { font, body } from "./theme";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle.jsx";

const ROLES = [
  { id: "student", icon: "🎓", label: "Student" },
  { id: "teacher", icon: "📚", label: "Teacher" },
];

const STEPS = ["Enter Email", "Verify OTP", "Reset Password"];

export default function ForgotPassword({ onGoBack }) {
  const { theme: C } = useTheme();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Step 1: Send OTP to email ──
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/otp/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("OTP sent to your email!");
        setStep(1);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("OTP verified successfully!");
        setStep(2);
      } else {
        setError(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/reset-password/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => onGoBack(), 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: ${body}; background: ${C.bg}; color: ${C.text}; }
        .otp-input::placeholder { letter-spacing: 0.3em; }
      `}</style>

      {/* BG grid */}
      <div style={{ position:"fixed", inset:0, backgroundImage:`radial-gradient(circle at 1px 1px, ${C.border} 1px, transparent 0)`, backgroundSize:"40px 40px", opacity:0.4, pointerEvents:"none", zIndex:0 }}/>

      {/* Theme toggle */}
      <div style={{ position:"fixed", top:20, right:20, zIndex:999 }}>
        <ThemeToggle/>
      </div>

      {/* Main Container */}
      <div style={{ minHeight:"100vh", display:"flex", position:"relative", zIndex:1 }}>

        {/* ── Left panel ── */}
        <div style={{ flex:"0 0 42%", background:`linear-gradient(135deg, ${C.surface} 0%, ${C.surface2} 100%)`, padding:"60px 50px", display:"flex", flexDirection:"column", gap:40, borderRight:`1px solid ${C.border}` }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg, ${C.gold} 0%, ${C.goldMid} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:"#000", fontFamily:font }}>
              E
            </div>
            <div style={{ fontSize:26, fontWeight:700, fontFamily:font, color:C.text }}>
              EduTrack
            </div>
          </div>

          {/* Title */}
          <div style={{ marginTop:40 }}>
            <h2 style={{ fontSize:36, fontWeight:700, fontFamily:font, color:C.text, marginBottom:16, lineHeight:1.2 }}>
              Reset Your Password
            </h2>
            <p style={{ fontSize:16, color:C.textDim, lineHeight:1.6, fontFamily:body }}>
              Enter your email to receive a verification code, then set a new secure password.
            </p>
          </div>

          {/* Step tracker */}
          <div style={{ marginTop:20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:i < STEPS.length-1 ? 20 : 0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${step > i ? C.teal : step === i ? C.gold : C.border}`, background:step > i ? C.tealDim : step === i ? C.goldDim : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:step > i ? C.teal : step === i ? C.gold : C.textDim, transition:"all 0.3s" }}>
                    {step > i ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width:2, height:30, background:step > i ? C.teal : C.border, transition:"background 0.4s", margin:"4px 0" }}/>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, fontFamily:body, color:step >= i ? C.text : C.textDim, marginBottom:2 }}>
                    {s}
                  </div>
                  <div style={{ fontSize:12, color:C.textDim, fontFamily:body }}>
                    {i === 0 ? "We'll send you a verification code" : i === 1 ? "Check your email for OTP" : "Create a new secure password"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div style={{ marginTop:"auto", padding:16, borderRadius:12, background:C.surface2, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", gap:10 }}>
              <span style={{ fontSize:20 }}>🔒</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, fontFamily:body, color:C.text, marginBottom:4 }}>
                  Secure Password Reset
                </div>
                <div style={{ fontSize:12, color:C.textDim, fontFamily:body, lineHeight:1.5 }}>
                  Your password will be encrypted and stored securely. Never share your password or OTP with anyone.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex:1, padding:"60px 80px", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:600, margin:"0 auto" }}>

          {/* Progress bar */}
          <div style={{ display:"flex", gap:4, marginBottom:30 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ flex:1, height:4, borderRadius:2, background:step >= i ? C.gold : C.surface2, transition:"background 0.3s" }}/>
            ))}
          </div>

          <div style={{ marginBottom:8, fontSize:12, color:C.textDim, fontFamily:body, fontWeight:500, textTransform:"uppercase", letterSpacing:1 }}>
            Step {step + 1} of {STEPS.length}
          </div>

          <h1 style={{ fontSize:32, fontWeight:700, fontFamily:font, color:C.text, marginBottom:30 }}>
            {STEPS[step]}
          </h1>

          {/* ── STEP 0: Enter Email & Role ── */}
          {step === 0 && (
            <form onSubmit={handleSendOtp} style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* Role selector */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:10, fontFamily:body }}>
                  I am a
                </label>
                <div style={{ display:"flex", gap:12 }}>
                  {ROLES.map(r => (
                    <div key={r.id} onClick={() => setRole(r.id)} style={{ flex:1, padding:"14px 10px", borderRadius:11, border:`1px solid ${role === r.id ? C.goldMid : C.border}`, background:role === r.id ? C.goldDim : "transparent", cursor:"pointer", fontFamily:body, transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:24 }}>{r.icon}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:10, fontFamily:body }}>
                  Email Address
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:11, border:`1px solid ${C.border}`, background:C.surface, transition:"border 0.2s" }}>
                  <span style={{ fontSize:18 }}>✉️</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={role === "student" ? "student@college.edu" : "teacher@college.edu"} style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }} />
                </div>
              </div>

              {error && (
                <div style={{ padding:12, borderRadius:8, background:C.errorDim, border:`1px solid ${C.error}`, fontSize:13, color:C.error, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div style={{ padding:12, borderRadius:8, background:C.tealDim, border:`1px solid ${C.teal}`, fontSize:13, color:C.teal, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>✓</span> {success}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ padding:"14px 24px", borderRadius:11, border:"none", background:`linear-gradient(135deg, ${C.gold} 0%, ${C.goldMid} 100%)`, color:"#000", fontSize:15, fontWeight:600, cursor:loading ? "not-allowed" : "pointer", fontFamily:body, opacity:loading ? 0.6 : 1, transition:"opacity 0.2s" }}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>

            </form>
          )}

          {/* ── STEP 1: Enter OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* Email sent banner */}
              <div style={{ padding:16, borderRadius:12, background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:12 }}>
                <span style={{ fontSize:24 }}>📧</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:body, marginBottom:4 }}>
                    Check your email!
                  </div>
                  <div style={{ fontSize:13, color:C.textDim, fontFamily:body }}>
                    We sent a 6-digit OTP to <strong style={{ color:C.text }}>{email}</strong>
                  </div>
                </div>
              </div>

              {/* OTP input */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:10, fontFamily:body }}>
                  Enter OTP
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:11, border:`1px solid ${C.border}`, background:C.surface }}>
                  <span style={{ fontSize:18 }}>🔢</span>
                  <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="• • • • • •" maxLength={6} className="otp-input" style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:22, color:C.text, fontFamily:body, letterSpacing:"0.3em", textAlign:"center" }} />
                </div>
              </div>

              {/* Resend OTP */}
              <div style={{ fontSize:13, color:C.textDim, fontFamily:body, textAlign:"center" }}>
                Didn't receive it?{" "}
                <button type="button" onClick={handleSendOtp} disabled={loading} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontWeight:600, textDecoration:"underline", fontFamily:body }}>
                  Resend OTP
                </button>
              </div>

              {error && (
                <div style={{ padding:12, borderRadius:8, background:C.errorDim, border:`1px solid ${C.error}`, fontSize:13, color:C.error, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div style={{ padding:12, borderRadius:8, background:C.tealDim, border:`1px solid ${C.teal}`, fontSize:13, color:C.teal, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>✓</span> {success}
                </div>
              )}

              <div style={{ display:"flex", gap:12 }}>
                <button type="button" onClick={() => setStep(0)} style={{ flex:1, padding:"14px 24px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.text, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:body }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} style={{ flex:2, padding:"14px 24px", borderRadius:11, border:"none", background:`linear-gradient(135deg, ${C.gold} 0%, ${C.goldMid} 100%)`, color:"#000", fontSize:15, fontWeight:600, cursor:loading ? "not-allowed" : "pointer", fontFamily:body, opacity:loading ? 0.6 : 1 }}>
                  {loading ? "Verifying..." : "Verify OTP →"}
                </button>
              </div>

            </form>
          )}

          {/* ── STEP 2: Reset Password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* New Password */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:10, fontFamily:body }}>
                  New Password
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:11, border:`1px solid ${C.border}`, background:C.surface }}>
                  <span style={{ fontSize:18 }}>🔒</span>
                  <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" type={showPass ? "text" : "password"} style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, fontFamily:body }}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                <div style={{ marginTop:6, fontSize:12, color:C.textDim, fontFamily:body }}>
                  At least 6 characters
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.text, marginBottom:10, fontFamily:body }}>
                  Confirm Password
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:11, border:`1px solid ${C.border}`, background:C.surface }}>
                  <span style={{ fontSize:18 }}>🔒</span>
                  <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" type={showPass ? "text" : "password"} style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }} />
                </div>
              </div>

              {error && (
                <div style={{ padding:12, borderRadius:8, background:C.errorDim, border:`1px solid ${C.error}`, fontSize:13, color:C.error, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div style={{ padding:12, borderRadius:8, background:C.tealDim, border:`1px solid ${C.teal}`, fontSize:13, color:C.teal, fontFamily:body, display:"flex", alignItems:"center", gap:8 }}>
                  <span>✓</span> {success}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ padding:"14px 24px", borderRadius:11, border:"none", background:`linear-gradient(135deg, ${C.gold} 0%, ${C.goldMid} 100%)`, color:"#000", fontSize:15, fontWeight:600, cursor:loading ? "not-allowed" : "pointer", fontFamily:body, opacity:loading ? 0.6 : 1 }}>
                {loading ? "Resetting password..." : "Reset Password ✓"}
              </button>

            </form>
          )}

          {/* Back to login */}
          <div style={{ marginTop:30, textAlign:"center", fontSize:14, color:C.textDim, fontFamily:body }}>
            Remember your password?{" "}
            <button onClick={onGoBack} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontWeight:600, textDecoration:"underline", fontFamily:body }}>
              Sign in →
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
