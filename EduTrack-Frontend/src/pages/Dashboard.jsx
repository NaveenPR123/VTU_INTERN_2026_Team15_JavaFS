import { useState, useEffect } from "react";
import { font, body, mono, FONTS_IMPORT } from "../theme.js";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import logoSrc from "../assets/edutrack-logo.png";

/* ═══════════════════════════════════════════════════════
   SDD Section 3.2 – System Modules
   Student Module:  login, view courses, attendance, assignments, marks
   Teacher Module:  login, manage courses, create assignments, mark attendance, enter marks
═══════════════════════════════════════════════════════ */

// ── Nav configs per role ──
const STUDENT_NAV = [
  { iconKey:"grid",      label:"Dashboard",   section:"Overview" },
  { iconKey:"book",      label:"My Courses",  section:"Overview" },
  { iconKey:"calendar",  label:"Attendance",  section:"Academic" },
  { iconKey:"clipboard", label:"Assignments", section:"Academic" },
  { iconKey:"chart",     label:"My Marks",    section:"Academic" },
  { iconKey:"folder",    label:"Materials",   section:"Academic" },
  { iconKey:"cog",       label:"Settings",    section:"Account"  },
];

const TEACHER_NAV = [
  { iconKey:"grid",      label:"Dashboard",       section:"Overview" },
  { iconKey:"layers",    label:"Manage Courses",  section:"Manage"   },
  { iconKey:"calendar",  label:"Mark Attendance", section:"Manage"   },
  { iconKey:"clipboard", label:"Assignments",     section:"Manage"   },
  { iconKey:"chart",     label:"Enter Marks",     section:"Manage"   },
  { iconKey:"folder",    label:"Course Materials",section:"Manage"   },
  { iconKey:"cog",       label:"Settings",        section:"Account"  },
];

const ADMIN_NAV = [
  { iconKey:"grid", label:"Dashboard",        section:"Overview" },
  { iconKey:"grad", label:"Students",         section:"Manage"   },
  { iconKey:"users", label:"Teachers",         section:"Manage"   },
  { iconKey:"book", label:"Courses",          section:"Manage"   },
  { iconKey:"cog", label:"Settings",         section:"Account"  },
];

/* ── Course color/icon mapping by index ── */
const COURSE_COLORS = ["teal","gold","purple","rose","blue","green","teal","gold"];
const COURSE_ICONS  = ["🔬","⚙️","🧮","🌐","💾","🖥️","📐","🧪"];

/* ── Assignment tag helper from due date ── */
const getTag = (dueDateStr) => {
  const due  = new Date(dueDateStr);
  const now  = new Date();
  const diff = Math.ceil((due - now) / (1000*60*60*24));
  if (diff < 0)  return "Overdue";
  if (diff <= 3) return "Due Soon";
  return "Pending";
};

/* ── API base ── */
const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

/* ── Helper functions that accept C ── */
const tagStyle = (t, C) =>
  t==="Overdue"  ? { background:C.roseDim, color:C.rose } :
  t==="Due Soon" ? { background:C.goldDim, color:C.gold } :
                   { background:C.tealDim, color:C.teal };

// Attendance status helpers
const cycleStatus = (s) =>
  s==="Present" ? "Absent" : "Present";

const getStatusColor = (s) =>
  s==="Present" ? "#4ecdc4" : "#f87171";

const statusDot = (s, C) =>
  s==="late"    ? { background:C.rose, boxShadow:`0 0 6px ${C.rose}` } :
  s==="pending" ? { background:C.gold, boxShadow:`0 0 6px ${C.gold}` } :
                  { background:C.teal };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function NavGlyph({ name, color }) {
  const s = { width:18, height:18, stroke:color, fill:"none", strokeWidth:1.65, strokeLinecap:"round", strokeLinejoin:"round" };
  switch (name) {
    case "grid": return <svg viewBox="0 0 24 24" style={s}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>;
    case "book": return <svg viewBox="0 0 24 24" style={s}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "calendar": return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "clipboard": return <svg viewBox="0 0 24 24" style={s}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
    case "chart": return <svg viewBox="0 0 24 24" style={s}><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>;
    case "folder": return <svg viewBox="0 0 24 24" style={s}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
    case "cog": return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    case "layers": return <svg viewBox="0 0 24 24" style={s}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
    case "grad": return <svg viewBox="0 0 24 24" style={s}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>;
    case "users": return <svg viewBox="0 0 24 24" style={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "warn":  return <svg viewBox="0 0 24 24" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "star":  return <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "chart": return <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    default: return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

function AnimatedNumber({ value, decimals=0, duration=850, style={}, reducedMotion, loading, fallback="—" }) {
  const [n, setN] = useState(0);
  const end = typeof value === "number" && !Number.isNaN(value) ? value : null;
  useEffect(() => {
    if (loading || end === null) return;
    if (reducedMotion) { setN(end); return; }
    setN(0);
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * end);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, loading, reducedMotion, duration]);
  if (loading) return <span style={style}>…</span>;
  if (end === null) return <span style={style}>{fallback}</span>;
  const str = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
  return <span style={style}>{str}</span>;
}

function AttendanceRing({ pct, present, total, strokeColor, C, loading, reducedMotion }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <div className={reducedMotion ? "" : "att-ring-wrap"} style={{ position:"relative", width:132, height:132, flexShrink:0 }}>
      <svg width="132" height="132" viewBox="0 0 120 120" style={{ transform:"rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke={C.border} strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={loading ? c : dash}
          style={{ transition: reducedMotion ? "none" : "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
        <div style={{ fontFamily:mono, fontSize:26, fontWeight:600, color:C.text, lineHeight:1 }}>{loading ? "—" : `${pct}%`}</div>
        <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>{loading ? "" : `${present}/${total || "—"}`}</div>
      </div>
    </div>
  );
}

function SkeletonBlock({ C, h=14, w="100%" }) {
  return <div className="skeleton-shimmer" style={{ height:h, width:w, borderRadius:8, background:C.surface3, overflow:"hidden" }}/>;
}

/* ── Simple initials avatar ── */
function UserAvatar({ role, id, name, size=36, grad, C }) {
  const initials = name ? name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "?";
  const background = grad || (role==="student" ? "linear-gradient(135deg,#4ecdc4,#2d9e97)" : role==="teacher" ? "linear-gradient(135deg,#e8b96a,#c4973a)" : "linear-gradient(135deg,#a78bfa,#7c3aed)");
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:Math.round(size*0.35), color:"#0d1117", flexShrink:0 }}>
      {initials}
    </div>
  );
}

/* ── Reusable Panel — soft elevation, no hard frame ── */
const Panel = ({ children, style={}, C }) => (
  <div style={{
    background:`linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)`,
    borderRadius:18,
    padding:22,
    boxShadow: `${C.cardGlow}, ${C.cardShadow}`,
    ...style,
  }}>{children}</div>
);

const PH = ({ title, link, onLink, C }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
    <span style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>{title}</span>
    {link && <span onClick={onLink} style={{ fontSize:12, color:C.gold, cursor:"pointer" }}>{link} →</span>}
  </div>
);

/* ══════════════════════════════════════════════
   STUDENT PAGES — wired to real API
══════════════════════════════════════════════ */

function StudentDashboard({ user, setActive, C }) {
  const [marks,       setMarks]       = useState([]);
  const [attendance,  setAttendance]  = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses,     setCourses]     = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading,     setLoading]     = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!user?.studentId) return;
    Promise.all([
      fetch(`${API}/api/marks/student/${user.studentId}`).then(r=>r.json()),
      fetch(`${API}/api/attendance/student/${user.studentId}`).then(r=>r.json()),
      fetch(`${API}/api/assignments`).then(r=>r.json()),
      fetch(`${API}/api/courses/department/${encodeURIComponent(user.department||"")}`).then(r=>r.json()),
    ]).then(([m,a,asn,c]) => {
      setMarks(Array.isArray(m)?m:[]);
      setAttendance(Array.isArray(a)?a:[]);
      const deptCourses = Array.isArray(c)?c:[];
      const deptCourseIds = new Set(deptCourses.map(x=>x.courseId));
      const asnList = (Array.isArray(asn)?asn:[]).filter(x=>deptCourseIds.has(x.course?.courseId));
      setAssignments(asnList);
      setCourses(deptCourses);
      const subs = {};
      Promise.all(asnList.map(a =>
        fetch(`${API}/api/submissions/check?assignmentId=${a.assignmentId}&studentId=${user.studentId}`)
          .then(r=>r.json())
          .then(d=>{ if(d.submitted) subs[a.assignmentId]=d; })
          .catch(()=>{})
      )).then(()=>setSubmissions({...subs}));
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [user?.studentId]);

  const totalPresent = attendance.filter(a=>a.status==="Present").length;
  const totalClasses = attendance.length;
  const attPct       = totalClasses>0 ? Math.round((totalPresent/totalClasses)*100) : 0;
  const pendingCount = assignments.filter(a=>!submissions[a.assignmentId]?.submitted).length;
  const avgScore     = marks.length>0 ? Math.round(marks.reduce((s,m)=>s+m.marks,0)/marks.length) : 0;
  const cgpaNum      = avgScore>0 ? avgScore / 10 : null;

  const byCourse = {};
  attendance.forEach(a => {
    const name = a.course?.courseName||"Unknown";
    if (!byCourse[name]) byCourse[name]={present:0,total:0};
    byCourse[name].total++;
    if (a.status==="Present") byCourse[name].present++;
  });

  const ringStroke = attPct > 75 ? C.teal : attPct >= 70 ? C.amber : C.textDim;

  const miniStat = (label, color, glyph, children) => (
    <div className="stat-card" style={{
      position:"relative", overflow:"hidden", borderRadius:18, padding:0,
      background:`linear-gradient(155deg,${C.surface} 0%,${C.surface2} 100%)`,
      boxShadow:`${C.cardGlow},${C.cardShadow}`,
      animationDelay:"0.12s",
    }}>
      {/* Top accent bar */}
      <div style={{ height:3, background:`linear-gradient(90deg,${color},${color}44)`, borderRadius:"18px 18px 0 0" }}/>
      <div style={{ padding:"16px 18px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${color}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${color}22` }}>
            <NavGlyph name={glyph} color={color} />
          </div>
        </div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.11em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>{label}</div>
        {children}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"minmax(260px,360px) 1fr", gap:18, marginBottom:22 }}>
        <div className="stat-card" style={{
          borderRadius:20, padding:24, position:"relative", overflow:"hidden",
          background:`linear-gradient(150deg, ${C.surface} 0%, ${C.surface2} 55%, ${C.surface3} 100%)`,
          boxShadow:`${C.cardGlow}, ${C.cardShadow}`,
        }}>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 80% 50% at 20% 0%, ${ringStroke}14 0%, transparent 55%)`, pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", position:"relative" }}>
            <AttendanceRing pct={attPct} present={totalPresent} total={totalClasses} strokeColor={ringStroke} C={C} loading={loading} reducedMotion={reducedMotion} />
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Attendance</div>
              <div style={{ fontSize:14, color:C.textMuted, lineHeight:1.45 }}>
                {loading ? "Syncing your records…" : totalClasses === 0 ? "No attendance logged yet." : `${totalPresent} present of ${totalClasses} recorded sessions.`}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:14 }}>
          {miniStat("CGPA", C.gold, "book", (
            <>
              <div style={{ fontFamily:mono, fontSize:30, fontWeight:700, lineHeight:1, color:C.gold }}>
                <AnimatedNumber value={cgpaNum} decimals={1} reducedMotion={reducedMotion} loading={loading} style={{}} />
              </div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:8 }}>out of 10.0</div>
            </>
          ))}
          {miniStat("Pending", C.rose, "warn", (
            <>
              <div style={{ fontFamily:mono, fontSize:30, fontWeight:700, lineHeight:1, color:C.rose }}>
                <AnimatedNumber value={pendingCount} decimals={0} reducedMotion={reducedMotion} loading={loading} style={{}} />
              </div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:8 }}>assignments to submit</div>
            </>
          ))}
          {miniStat("Courses", C.purple, "grid", (
            <>
              <div style={{ fontFamily:mono, fontSize:30, fontWeight:700, lineHeight:1, color:C.purple }}>
                <AnimatedNumber value={courses.length} decimals={0} reducedMotion={reducedMotion} loading={loading} style={{}} />
              </div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:8 }}>this semester</div>
            </>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:18, marginBottom:22 }}>
        <Panel C={C}>
          <PH title="Recent Marks" link="View All" onLink={()=>setActive("My Marks")} C={C}/>
          <div className="scroll-fade" style={{ maxHeight:280, overflowY:"auto", paddingRight:4 }}>
            {loading ? (
              <>
                <SkeletonBlock C={C} h={48} />
                <div style={{ height:8 }} />
                <SkeletonBlock C={C} h={48} />
              </>
            ) :
             marks.length===0 ? <div style={{ color:C.textMuted,fontSize:13 }}>No marks yet.</div> :
             marks.slice(0,6).map((m,i) => {
              const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
              const hi = m.marks >= 85;
              return (
                <div key={i} className="list-row fade-stagger" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, background:C.surface2, marginBottom:10, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                  {hi && <span title="Strong performance" style={{ width:8, height:8, borderRadius:"50%", background:C.teal, flexShrink:0, boxShadow:`0 0 10px ${C.teal}` }}/>}
                  {!hi && <span style={{ width:8, height:8, borderRadius:"50%", background:C.border, flexShrink:0 }}/>}
                  <div style={{ width:36, height:36, borderRadius:12, background:`${color}22`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:600, color:C.text }}>{m.course?.courseName}</div></div>
                  <div style={{ width:72, height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
                    <div className="bar-grow" style={{ width:`${m.marks}%`, height:"100%", background:`linear-gradient(90deg, ${color}, ${color}99)`, borderRadius:99 }}/>
                  </div>
                  <div style={{ fontFamily:mono, fontSize:13, color, minWidth:32, textAlign:"right" }}>{m.marks}</div>
                  <div style={{ width:32, height:32, borderRadius:10, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:mono, fontSize:12, fontWeight:700, color }}>{m.grade}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel C={C}>
          <PH title="Attendance by Course" C={C}/>
          <div className="scroll-fade filter-cross" style={{ maxHeight:280, overflowY:"auto", paddingRight:4 }}>
            {loading ? (
              <>
                <SkeletonBlock C={C} />
                <div style={{ height:8 }} />
                <SkeletonBlock C={C} />
              </>
            ) :
             Object.entries(byCourse).slice(0,8).map(([name,{present,total}],i) => {
              const pct = total>0?Math.round((present/total)*100):0;
              const color = pct<75?C.rose:pct>=90?C.teal:C.amber;
              const dot = pct>=90 ? C.teal : pct>=75 ? C.amber : C.textDim;
              return (
                <div key={i} className="list-row fade-stagger" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:dot, flexShrink:0, boxShadow:pct>=90?`0 0 8px ${C.teal}`:"none" }}/>
                  <div style={{ flex:1, fontSize:13, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
                  <div style={{ width:72, height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
                    <div className="bar-grow" style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:99 }}/>
                  </div>
                  <span style={{ fontFamily:mono, fontSize:12, fontWeight:600, color, minWidth:40, textAlign:"right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:12 }}>
            {[[totalPresent,C.teal,"Present"],[totalClasses-totalPresent,C.rose,"Absent"],[`${attPct}%`,C.gold,"Overall"]].map(([v,c,l]) => (
              <div key={l} style={{ flex:1, textAlign:"center", padding:"10px 8px", borderRadius:14, background:C.surface2, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:c }}>{v}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel C={C}>
        <PH title="Pending Assignments" link="View All" onLink={()=>setActive("Assignments")} C={C}/>
        {loading ? <SkeletonBlock C={C} h={52} /> :
         assignments.filter(a=>!submissions[a.assignmentId]?.submitted).slice(0,5).map((a,i) => {
          const tag = getTag(a.dueDate);
          return (
            <div key={i} className="list-row fade-stagger" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:14, background:C.surface2, marginBottom:10, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", flexShrink:0, background:tag==="Overdue"?C.rose:C.amber, boxShadow:`0 0 10px ${tag==="Overdue"?C.rose:C.amber}55` }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{a.course?.courseName} · Due: {a.dueDate}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:99, ...tagStyle(tag,C) }}>{tag}</div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

function StudentCourses({ user, C }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const dept = user?.department;
    const url = dept ? `${API}/api/courses/department/${encodeURIComponent(dept)}` : `${API}/api/courses`;
    fetch(url).then(r=>r.json())
      .then(d=>{ setCourses(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  }, [user?.department]);
  if (loading) return <div style={{ color:C.textMuted, padding:32 }}>Loading courses…</div>;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
      {courses.map((c,i) => {
        const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
        const icon  = COURSE_ICONS[i%COURSE_ICONS.length];
        return (
          <div key={c.courseId} className="list-row course-card-glass" style={{ background:`linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)`, borderRadius:18, padding:22, position:"relative", overflow:"hidden", transition:"transform 0.25s ease, box-shadow 0.25s ease", boxShadow:`${C.cardGlow}, ${C.cardShadow}` }}>
            <div style={{ position:"absolute", top:0, right:0, width:100, height:100, background:`radial-gradient(circle at 80% 20%,${color}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:11, background:`${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
              <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:`${color}15`, color }}>{c.credits} Cr</span>
            </div>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:600, marginBottom:4, color:C.text }}>{c.courseName}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{c.teacher?.name||"—"}</div>
          </div>
        );
      })}
    </div>
  );
}

function StudentAttendance({ user, C }) {
  const [attendance,   setAttendance]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    if (!user?.studentId) return;
    fetch(`${API}/api/attendance/student/${user.studentId}`).then(r=>r.json())
      .then(d=>{ 
        const data = Array.isArray(d)?d:[];
        setAttendance(data);
        setLoading(false);
        // auto-select first course
        if (data.length > 0) setSelectedCourse(data[0].course?.courseName);
      })
      .catch(()=>setLoading(false));
  }, [user?.studentId]);

  // group by course
  const byCourse = {};
  attendance.forEach(a => {
    const name = a.course?.courseName || "Unknown";
    if (!byCourse[name]) byCourse[name] = { present:0, absent:0, total:0, records:[] };
    byCourse[name].total++;
    if (a.status==="Present") byCourse[name].present++;
    else byCourse[name].absent++;
    byCourse[name].records.push(a);
  });

  const getLabel = (pct) => pct>=90?"Excellent":pct>=75?"Good":pct>=60?"Average":"Low";
  const getColor = (pct) => pct>=90?C.teal:pct>=75?C.amber:C.rose;

  const monthOptions = selectedCourse
    ? [...new Set((byCourse[selectedCourse]?.records||[]).map(r => (r.attendanceDate||"").slice(0,7)).filter(m => m.length === 7))].sort().reverse()
    : [];

  const recentRecords = selectedCourse
    ? [...(byCourse[selectedCourse]?.records||[])]
        .filter(r => monthFilter === "all" || (r.attendanceDate||"").startsWith(monthFilter))
        .sort((a,b)=>(b.attendanceDate||"").localeCompare(a.attendanceDate||""))
        .slice(0, 14)
    : [];

  const overallPct = attendance.length > 0
    ? Math.round(attendance.filter(a=>a.status==="Present").length / attendance.length * 100)
    : 0;
  const overallColor = overallPct>=90?C.teal:overallPct>=75?C.amber:C.rose;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* ── Summary banner ── */}
      <div style={{ borderRadius:20, padding:"22px 26px", background:`linear-gradient(135deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden", boxShadow:C.cardShadow }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, background:`radial-gradient(circle,${overallColor}16 0%,transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, background:`radial-gradient(circle,${C.teal}08 0%,transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:28, flexWrap:"wrap", position:"relative" }}>
          {/* Big ring */}
          <div style={{ position:"relative", width:90, height:90, flexShrink:0 }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke={C.surface3||C.surface2} strokeWidth="8"/>
              <circle cx="45" cy="45" r="38" fill="none" stroke={overallColor} strokeWidth="8"
                strokeDasharray={`${(overallPct/100)*2*Math.PI*38} ${2*Math.PI*38}`}
                strokeDashoffset={2*Math.PI*38*0.25}
                strokeLinecap="round" style={{ transition:"stroke-dasharray 1s ease" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:overallColor, lineHeight:1 }}>{overallPct}%</div>
            </div>
          </div>
          <div style={{ flex:1, minWidth:180 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>Overall Attendance</div>
            <div style={{ fontFamily:font, fontSize:26, fontWeight:700, color:C.text, marginBottom:4 }}>
              {overallPct>=90?"Excellent 🎉":overallPct>=75?"Good Standing 👍":overallPct>=60?"Needs Attention ⚠️":"Critical — Act Now 🚨"}
            </div>
            <div style={{ fontSize:13, color:C.textMuted }}>{attendance.filter(a=>a.status==="Present").length} present · {attendance.filter(a=>a.status!=="Present").length} absent · {attendance.length} total sessions</div>
          </div>
          <div style={{ display:"flex", gap:12, flexShrink:0 }}>
            {[[attendance.filter(a=>a.status==="Present").length,C.teal,"Present","✓"],
              [attendance.filter(a=>a.status!=="Present").length,C.rose,"Absent","✗"],
              [Object.keys(byCourse).length,C.purple,"Courses","◆"]].map(([v,c,l,ic])=>(
              <div key={l} style={{ textAlign:"center", padding:"14px 16px", borderRadius:14, background:`${c}10`, border:`1px solid ${c}22`, minWidth:64 }}>
                <div style={{ fontSize:16, marginBottom:4 }}>{ic}</div>
                <div style={{ fontFamily:mono, fontSize:22, fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:10, color:C.textMuted, marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course cards ── */}
      {loading ? <div style={{ color:C.textMuted, padding:20 }}>Loading…</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
          {Object.entries(byCourse).map(([name,{present,absent,total}],idx) => {
            const pct = total>0?Math.round((present/total)*100):0;
            const color = getColor(pct);
            const label = getLabel(pct);
            const selected = selectedCourse===name;
            const courseColors = [C.teal,C.gold,C.purple,C.blue,C.amber];
            const accentColor = courseColors[idx % courseColors.length];
            return (
              <div key={name} onClick={()=>{ setSelectedCourse(name); setMonthFilter("all"); }}
                className="course-card-glass"
                style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, padding:0, cursor:"pointer", transition:"all 0.25s ease", boxShadow: selected?`0 0 0 2px ${color}, ${C.cardShadow}`:`${C.cardGlow},${C.cardShadow}`, position:"relative", overflow:"hidden" }}>
                {/* Top accent */}
                <div style={{ height:3, background:`linear-gradient(90deg,${color},${color}44)`, borderRadius:"16px 16px 0 0" }}/>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${color}14 0%,transparent 65%)`, pointerEvents:"none" }}/>
                  {/* Header row */}
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:4 }}>{name}</div>
                      <span style={{ fontSize:10, padding:"3px 8px", borderRadius:99, background:`${color}18`, color, fontWeight:700 }}>{label}</span>
                    </div>
                    {/* Mini ring */}
                    <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
                      <svg width="52" height="52" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="21" fill="none" stroke={C.surface3||C.surface2} strokeWidth="5"/>
                        <circle cx="26" cy="26" r="21" fill="none" stroke={color} strokeWidth="5"
                          strokeDasharray={`${(pct/100)*2*Math.PI*21} ${2*Math.PI*21}`}
                          strokeDashoffset={2*Math.PI*21*0.25}
                          strokeLinecap="round"/>
                      </svg>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:mono, fontSize:11, fontWeight:700, color }}>{pct}%</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height:6, background:C.surface3||C.border, borderRadius:99, overflow:"hidden", marginBottom:14 }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}bb)`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)" }}/>
                  </div>
                  {/* Stats */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[[present,C.teal,"Present"],[absent,C.rose,"Absent"],[total,C.textMuted,"Total"]].map(([v,c,l])=>(
                      <div key={l} style={{ textAlign:"center", padding:"8px 4px", borderRadius:10, background:`${c}10`, border:`1px solid ${c}18` }}>
                        <div style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                        <div style={{ fontSize:10, color:C.textMuted, marginTop:3, fontWeight:500 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {selected && <div style={{ marginTop:12, fontSize:11, color, fontWeight:600, textAlign:"center" }}>↓ Viewing records below</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Record list ── */}
      {selectedCourse && recentRecords.length>0 && (
        <Panel C={C}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{selectedCourse}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Attendance log · recent {recentRecords.length} entries</div>
            </div>
            {monthOptions.length > 1 && (
              <div className="filter-cross" style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                <button type="button" onClick={()=>setMonthFilter("all")}
                  style={{ padding:"6px 14px", borderRadius:99, border:`1px solid ${monthFilter==="all"?C.teal:C.border}`, fontFamily:body, fontSize:11, fontWeight:600, cursor:"pointer", background:monthFilter==="all"?C.tealDim:C.surface2, color:monthFilter==="all"?C.teal:C.textMuted, transition:"all 0.2s" }}>
                  All
                </button>
                {monthOptions.map(m => (
                  <button type="button" key={m} onClick={()=>setMonthFilter(m)}
                    style={{ padding:"6px 14px", borderRadius:99, border:`1px solid ${monthFilter===m?C.gold:C.border}`, fontFamily:body, fontSize:11, fontWeight:600, cursor:"pointer", background:monthFilter===m?C.goldDim:C.surface2, color:monthFilter===m?C.gold:C.textMuted, transition:"all 0.2s" }}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {recentRecords.map((r,i)=>{
              const [yr,mo,dy] = (r.attendanceDate||"").split("-");
              const d = new Date(Number(yr), Number(mo)-1, Number(dy));
              const day = d.toLocaleDateString("en-US",{weekday:"long"});
              const dayShort = d.toLocaleDateString("en-US",{weekday:"short"});
              const date = `${dy}/${mo}/${yr}`;
              const present = r.status==="Present";
              return (
                <div key={i} className="list-row"
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:13, background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
                  {/* Left accent */}
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${present?C.teal:C.rose},${present?C.teal:C.rose}44)`, borderRadius:"13px 0 0 13px" }}/>
                  {/* Day badge */}
                  <div style={{ width:44, height:44, borderRadius:12, background:present?C.tealDim:C.roseDim, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${present?C.teal:C.rose}22` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:present?C.teal:C.rose, textTransform:"uppercase", letterSpacing:"0.05em" }}>{dayShort}</div>
                    <div style={{ fontFamily:mono, fontSize:16, fontWeight:700, color:present?C.teal:C.rose, lineHeight:1 }}>{dy}</div>
                  </div>
                  {/* Date info */}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{day}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{date}</div>
                  </div>
                  {/* Status pill */}
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:99, background:present?C.tealDim:C.roseDim, border:`1px solid ${present?C.teal:C.rose}30`, flexShrink:0 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:present?C.teal:C.rose, boxShadow:`0 0 6px ${present?C.teal:C.rose}` }}/>
                    <span style={{ fontSize:12, fontWeight:700, color:present?C.teal:C.rose }}>{present?"Present":"Absent"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}

function StudentAssignments({ user, C }) {
  const [assignments,  setAssignments]  = useState([]);
  const [submissions,  setSubmissions]  = useState({});
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState("All");
  const [uploading,    setUploading]    = useState(null);
  const [uploadMsg,    setUploadMsg]    = useState({});
  const [feedback,     setFeedback]     = useState(null); // { assignment, submission }
  const [expanded,     setExpanded]     = useState(null);
  const redAsn         = useReducedMotion();

  useEffect(() => {
    const dept = user?.department;
    Promise.all([
      fetch(`${API}/api/assignments`).then(r=>r.json()),
      dept ? fetch(`${API}/api/courses/department/${encodeURIComponent(dept)}`).then(r=>r.json()) : Promise.resolve([]),
    ]).then(([asn, courses]) => {
      const courseIds = new Set((Array.isArray(courses)?courses:[]).map(c=>c.courseId));
      const all = Array.isArray(asn)?asn:[];
      setAssignments(dept ? all.filter(a=>courseIds.has(a.course?.courseId)) : all);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [user?.department]);

  useEffect(() => {
    if (!user?.studentId || assignments.length===0) return;
    assignments.forEach(a => {
      fetch(`${API}/api/submissions/check?assignmentId=${a.assignmentId}&studentId=${user.studentId}`)
        .then(r=>r.json())
        .then(d=>{ if(d.submitted) setSubmissions(s=>({...s,[a.assignmentId]:d})); })
        .catch(()=>{});
    });
  }, [assignments.length, user?.studentId]);

  const handleUpload = async (assignmentId, file) => {
    if (!file) return;
    setUploading(assignmentId);
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", user.studentId);
    formData.append("file", file);
    try {
      const res = await fetch(`${API}/api/submissions/upload`, { method:"POST", body:formData });
      const data = await res.json();
      if (data.success) {
        setSubmissions(s=>({...s,[assignmentId]:{ submitted:true, fileName:data.fileName, submittedAt:new Date().toISOString() }}));
        setUploadMsg(m=>({...m,[assignmentId]:"✓ Submitted successfully"}));
      } else {
        setUploadMsg(m=>({...m,[assignmentId]:"Upload failed. Try again."}));
      }
    } catch {
      setUploadMsg(m=>({...m,[assignmentId]:"Cannot connect to server."}));
    }
    setUploading(null);
    setTimeout(()=>setUploadMsg(m=>({...m,[assignmentId]:""})), 3000);
  };

  const loadFeedback = async (a) => {
    const res = await fetch(`${API}/api/submissions/student/${user.studentId}`);
    const list = await res.json();
    const sub = Array.isArray(list) ? list.find(s => s.assignment?.assignmentId === a.assignmentId) : null;
    setFeedback({ assignment:a, submission:sub });
  };

  const tagged   = assignments.map(a=>({...a, tag: submissions[a.assignmentId]?.submitted ? "Submitted" : getTag(a.dueDate)}));
  const filtered = filter==="All" ? tagged : tagged.filter(a=>a.tag===filter);
  const counts   = {
    Pending:   tagged.filter(a=>a.tag==="Pending").length,
    Overdue:   tagged.filter(a=>a.tag==="Overdue").length,
    DueSoon:   tagged.filter(a=>a.tag==="Due Soon").length,
    Submitted: tagged.filter(a=>a.tag==="Submitted").length,
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Feedback modal */}
      {feedback && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }}
          onClick={e=>{ if(e.target===e.currentTarget) setFeedback(null); }}>
          <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:500, boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)", overflow:"hidden" }}>

            {/* Header */}
            <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Teacher Feedback</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{feedback.assignment.title}</div>
                </div>
              </div>
              <button onClick={()=>setFeedback(null)}
                style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.roseDim; e.currentTarget.style.color=C.rose; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding:"20px 24px 24px" }}>
              {/* Submission card */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.surface2, borderRadius:12, marginBottom:20, border:`1px solid ${C.border}` }}>
                <div style={{ width:38, height:38, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Your Submission</div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{feedback.submission?.fileName || "—"}</div>
                </div>
                {feedback.submission?.submittedAt && (
                  <div style={{ fontSize:11, color:C.textMuted, flexShrink:0 }}>
                    {new Date(feedback.submission.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Grade + Comment */}
              {(feedback.submission?.grade || feedback.submission?.comment) ? (
                <div style={{ display:"grid", gridTemplateColumns:"120px 1fr", gap:14, marginBottom:20 }}>
                  {/* Grade */}
                  <div style={{ padding:"20px 16px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:14, textAlign:"center", border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 30%,${C.gold}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Grade</div>
                    <div style={{ fontFamily:font, fontSize:42, fontWeight:700, color:C.gold, lineHeight:1 }}>
                      {feedback.submission?.grade || "—"}
                    </div>
                    {feedback.submission?.grade && (
                      <div style={{ marginTop:8, fontSize:11, color:C.gold, fontWeight:500 }}>
                        {feedback.submission.grade==="O"?"Outstanding":feedback.submission.grade==="A+"?"Excellent":feedback.submission.grade==="A"?"Very Good":feedback.submission.grade==="B+"?"Good":"Pass"}
                      </div>
                    )}
                  </div>
                  {/* Comment */}
                  <div style={{ padding:"16px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:14, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Teacher Comment</div>
                    <div style={{ fontSize:14, color:C.text, lineHeight:1.65, fontStyle:feedback.submission?.comment?"normal":"italic" }}>
                      {feedback.submission?.comment || "No comment provided."}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:12, marginBottom:20 }}>
                  <span style={{ fontSize:22 }}>⏳</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#f59e0b" }}>Not graded yet</div>
                    <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Your teacher hasn't reviewed this submission yet.</div>
                  </div>
                </div>
              )}

              <button onClick={()=>setFeedback(null)}
                style={{ width:"100%", padding:"12px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          [counts.Pending,   "Pending",   C.amber,  "📝"],
          [counts.Overdue,   "Overdue",   C.rose,   "⚠️"],
          [counts.DueSoon,   "Due Soon",  C.teal,   "⏰"],
          [counts.Submitted, "Submitted", C.purple, "✅"],
        ].map(([n, l, col, icon]) => (
          <div key={l} style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, padding:"18px 20px", boxShadow:`${C.cardGlow},${C.cardShadow}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:70, height:70, background:`radial-gradient(circle at 80% 20%,${col}20 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div style={{ fontSize:11, fontWeight:600, color:col, background:`${col}18`, padding:"2px 8px", borderRadius:99 }}>{l}</div>
            </div>
            <div style={{ fontFamily:font, fontSize:36, fontWeight:700, color:col, lineHeight:1 }}>
              {loading ? "…" : n}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:22, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>All Assignments</span>
          <div style={{ display:"flex", gap:4, padding:4, background:C.surface2, borderRadius:12 }}>
            {["All","Pending","Due Soon","Overdue","Submitted"].map(f => (
              <button type="button" key={f} onClick={()=>setFilter(f)}
                style={{ padding:"6px 14px", borderRadius:9, border:"none", background:filter===f?C.surface:"transparent", color:filter===f?C.text:C.textMuted, fontSize:12, fontWeight:filter===f?600:400, cursor:"pointer", fontFamily:body, boxShadow:filter===f?`${C.cardGlow},${C.cardShadow}`:"none", transition:"all 0.2s" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <SkeletonBlock C={C} h={72}/><SkeletonBlock C={C} h={72}/>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"32px 0", color:C.textMuted }}>
            <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
            <div style={{ fontSize:14 }}>No assignments in this category.</div>
          </div>
        ) : (
          <div key={filter} className="filter-cross" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map((a) => {
              const sub = submissions[a.assignmentId];
              const isSubmitted = sub?.submitted;
              const isOpen = expanded === a.assignmentId;
              const tagColor = a.tag==="Overdue"?C.rose:a.tag==="Due Soon"?C.amber:a.tag==="Submitted"?C.teal:C.purple;
              const tagDim   = a.tag==="Overdue"?C.roseDim:a.tag==="Due Soon"?C.amberDim:a.tag==="Submitted"?C.tealDim:C.purpleDim;

              return (
                <div key={a.assignmentId} style={{ borderRadius:16, background:C.surface2, overflow:"hidden", border:`1px solid ${isSubmitted?C.teal+"30":C.border}`, transition:"border-color 0.2s", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>

                  {/* Main row */}
                  <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", cursor:"pointer" }}
                    onClick={()=>setExpanded(isOpen ? null : a.assignmentId)}>
                    {/* Status dot */}
                    <div style={{ width:10, height:10, borderRadius:"50%", flexShrink:0, background:tagColor, boxShadow:`0 0 8px ${tagColor}60` }}/>

                    {/* Title + meta */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:3 }}>{a.title}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.textMuted }}>
                        <span>{a.course?.courseName}</span>
                        <span style={{ color:C.border }}>·</span>
                        <span>Due {a.dueDate}</span>
                        {isSubmitted && (
                          <>
                            <span style={{ color:C.border }}>·</span>
                            <span style={{ color:C.teal, display:"flex", alignItems:"center", gap:4 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              Submitted
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tag badge */}
                    <span style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:99, background:tagDim, color:tagColor, flexShrink:0 }}>{a.tag}</span>

                    {/* Expand arrow */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"
                      style={{ flexShrink:0, transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.25s ease" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  {/* Expanded description */}
                  {isOpen && (
                    <div style={{ padding:"0 18px 14px 42px", fontSize:13, color:C.textDim, lineHeight:1.6, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                      {a.description || "No additional instructions provided."}
                    </div>
                  )}

                  {/* Action bar */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 18px 14px", borderTop:`1px solid ${C.border}` }}
                    onClick={e=>e.stopPropagation()}>

                    {/* Submitted file info */}
                    {isSubmitted && (
                      <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.teal, minWidth:0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{sub.fileName}</span>
                        <span style={{ color:C.textDim, flexShrink:0 }}>· {new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    {uploadMsg[a.assignmentId] && (
                      <div style={{ flex:1, fontSize:12, color:C.teal, display:"flex", alignItems:"center", gap:6 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {uploadMsg[a.assignmentId]}
                      </div>
                    )}

                    <div style={{ marginLeft:"auto", display:"flex", gap:8, flexShrink:0 }}>
                      {/* Feedback button */}
                      {isSubmitted && (
                        <button type="button" onClick={()=>loadFeedback(a)}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1px solid ${C.gold}40`, background:C.goldDim, color:C.gold, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.background=C.gold; e.currentTarget.style.color="#0d1117"; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background=C.goldDim; e.currentTarget.style.color=C.gold; }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Feedback
                        </button>
                      )}

                      {/* Upload / Resubmit */}
                      {!isSubmitted ? (
                        <label style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.teal},${C.green})`, color:"#0d1117", fontFamily:body, fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 14px ${C.teal}30`, transition:"all 0.2s" }}
                          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                          {uploading===a.assignmentId ? (
                            <><span style={{ width:12, height:12, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Uploading…</>
                          ) : (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Upload</>
                          )}
                          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip" style={{ display:"none" }}
                            onChange={e=>handleUpload(a.assignmentId, e.target.files[0])} disabled={uploading===a.assignmentId}/>
                        </label>
                      ) : (
                        <label style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:10, border:`1px solid ${C.teal}40`, background:"transparent", color:C.teal, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.background=C.tealDim; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                          Resubmit
                          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip" style={{ display:"none" }}
                            onChange={e=>handleUpload(a.assignmentId, e.target.files[0])} disabled={uploading===a.assignmentId}/>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentMarks({ user, C }) {
  const [marks,   setMarks]   = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user?.studentId) return;
    fetch(`${API}/api/marks/student/${user.studentId}`).then(r=>r.json())
      .then(d=>{ setMarks(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  }, [user?.studentId]);

  const avg  = marks.length>0 ? Math.round(marks.reduce((s,m)=>s+m.marks,0)/marks.length) : 0;
  const cgpa = avg>0 ? (avg/10).toFixed(1) : "—";
  const best = marks.length>0 ? marks.reduce((a,b)=>a.marks>b.marks?a:b).grade : "—";
  const highest = marks.length>0 ? Math.max(...marks.map(m=>m.marks)) : 0;

  const gradeColor = (g) => {
    if(!g||g==="—") return C.textMuted;
    if(g==="O"||g==="A+") return C.teal;
    if(g==="A") return C.teal;
    if(g==="B+"||g==="B") return C.gold;
    if(g==="C"||g==="C+") return C.purple;
    return C.rose;
  };
  const perfLabel = (score) => {
    if(score>=90) return { label:"Outstanding", color:C.teal };
    if(score>=75) return { label:"Excellent",   color:C.teal };
    if(score>=60) return { label:"Good",        color:C.gold };
    if(score>=45) return { label:"Average",     color:C.purple };
    return { label:"Needs Work", color:C.rose };
  };

  const summaryStats = [
    { value: loading?"…":cgpa,       label:"CGPA",         sub:"cumulative",     color:C.gold,   icon:"chart" },
    { value: loading?"…":`${avg}%`,  label:"Avg Score",    sub:"across courses", color:C.teal,   icon:"grad"  },
    { value: loading?"…":best,       label:"Best Grade",   sub:"achieved",       color:C.purple, icon:"star"  },
    { value: loading?"…":marks.length, label:"Courses",    sub:"evaluated",      color:C.rose,   icon:"layers" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* ── Summary stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {summaryStats.map((s,i) => (
          <div key={i} style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:0, overflow:"hidden", boxShadow:`${C.cardGlow},${C.cardShadow}`, position:"relative" }}>
            <div style={{ height:3, background:`linear-gradient(90deg,${s.color},${s.color}44)`, borderRadius:"18px 18px 0 0" }}/>
            <div style={{ padding:"16px 18px 18px", position:"relative" }}>
              <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${s.color}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${s.color}22`, marginBottom:14 }}>
                <NavGlyph name={s.icon} color={s.color}/>
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:mono, fontSize:32, fontWeight:700, lineHeight:1, color:s.color, marginBottom:6 }}>{s.value}</div>
              <div style={{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:s.color, opacity:0.7 }}/>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Per-course mark cards ── */}
      <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden", boxShadow:C.cardShadow }}>
        {/* Panel header */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Marks per Course</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{marks.length} course{marks.length!==1?"s":""} evaluated this semester</div>
          </div>
          {!loading && marks.length>0 && (
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:99, background:C.goldDim, color:C.gold, fontWeight:700, border:`1px solid ${C.gold}22` }}>
              Top: {highest}/100
            </div>
          )}
        </div>

        <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {loading ? (
            <><SkeletonBlock C={C} h={80}/><SkeletonBlock C={C} h={80}/><SkeletonBlock C={C} h={80}/></>
          ) : marks.length===0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:C.textMuted }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
              <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>No marks recorded yet</div>
              <div style={{ fontSize:12 }}>Your teacher hasn't entered marks for any course yet.</div>
            </div>
          ) : marks.map((m,i) => {
            const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
            const gc    = gradeColor(m.grade);
            const perf  = perfLabel(m.marks);
            const pct   = Math.min(100, m.marks);
            // SVG ring
            const r=18, circ=2*Math.PI*r;
            const dashOff = circ*(1-pct/100);
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 18px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, borderRadius:16, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
                {/* Left accent */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${color},${color}44)`, borderRadius:"16px 0 0 16px" }}/>
                {/* Course icon */}
                <div style={{ width:46, height:46, borderRadius:13, background:`${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:`1px solid ${color}22` }}>
                  {COURSE_ICONS[i%COURSE_ICONS.length]}
                </div>
                {/* Course name + progress */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.course?.courseName}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:6, background:C.surface3||C.border, borderRadius:99, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:99, transition:"width 0.8s ease" }}/>
                    </div>
                    <div style={{ fontSize:11, color:C.textMuted, fontFamily:mono, minWidth:40, textAlign:"right" }}>{m.marks}/100</div>
                  </div>
                </div>
                {/* Mini SVG ring */}
                <div style={{ position:"relative", width:44, height:44, flexShrink:0 }}>
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r={r} fill="none" stroke={`${color}22`} strokeWidth="4"/>
                    <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
                      strokeDasharray={circ} strokeDashoffset={dashOff}
                      strokeLinecap="round" transform="rotate(-90 22 22)"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color, fontFamily:mono }}>{pct}%</div>
                </div>
                {/* Performance badge */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flexShrink:0 }}>
                  <div style={{ width:40, height:40, borderRadius:11, background:`${gc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:15, fontWeight:800, color:gc, border:`1px solid ${gc}25` }}>{m.grade||"—"}</div>
                  <div style={{ fontSize:9, padding:"2px 8px", borderRadius:99, background:`${perf.color}15`, color:perf.color, fontWeight:700, letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{perf.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEACHER PAGES — wired to real API
══════════════════════════════════════════════ */

function TeacherDashboard({ user, setActive, C }) {
  const [courses,     setCourses]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const reducedTD = useReducedMotion();

  useEffect(() => {
    if (!user?.teacherId) return;
    const dept = encodeURIComponent(user?.department || "");
    Promise.all([
      fetch(`${API}/api/courses/teacher/${user.teacherId}`).then(r=>r.json()),
      fetch(`${API}/api/assignments`).then(r=>r.json()),
      fetch(`${API}/api/students/department/${dept}`).then(r=>r.json()).catch(() =>
        fetch(`${API}/api/students`).then(r=>r.json())
      ),
    ]).then(([c,a,s]) => {
      const myCourses = Array.isArray(c)?c:[];
      const myCourseIds = new Set(myCourses.map(x=>x.courseId));
      setCourses(myCourses);
      setAssignments((Array.isArray(a)?a:[]).filter(a=>myCourseIds.has(a.course?.courseId)));
      // Only count students from this teacher's department
      const deptStudents = (Array.isArray(s)?s:[]).filter(st => !user?.department || st.department === user.department);
      setStudents(deptStudents);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [user?.teacherId]);

  const overdueN = assignments.filter(a=>getTag(a.dueDate)==="Overdue").length;
  const stats = [
    { label:"My Courses",  num:courses.length,     sub:"this semester", color:C.gold   },
    { label:"Assignments", num:assignments.length, sub:"created",       color:C.purple },
    { label:"Students",    num:students.length,    sub:"total",         color:C.teal   },
    { label:"Overdue",     num:overdueN,           sub:"assignments",   color:C.rose },
  ];

  const GLYPHS = ["book","users","grad","warn"];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={i} className="stat-card"
            style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:0, position:"relative", overflow:"hidden", animationDelay:`${i*0.08}s`, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
            {/* Top accent bar */}
            <div style={{ height:3, background:`linear-gradient(90deg,${s.color},${s.color}44)`, borderRadius:"18px 18px 0 0" }}/>
            <div style={{ padding:"18px 20px 16px", position:"relative" }}>
              <div style={{ position:"absolute", top:0, right:0, width:90, height:90, background:`radial-gradient(circle at 80% 20%,${s.color}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${s.color}25` }}>
                  <NavGlyph name={GLYPHS[i]} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:mono, fontSize:36, fontWeight:700, lineHeight:1, marginBottom:8, color:s.color }}>
                <AnimatedNumber value={s.num} decimals={0} reducedMotion={reducedTD} loading={loading} />
              </div>
              <div style={{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:s.color, opacity:0.7 }}/>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        {/* My Courses with visual progress */}
        <Panel C={C}>
          <PH title="My Courses" link="Manage" onLink={()=>setActive("Manage Courses")} C={C}/>
          {loading ? <><SkeletonBlock C={C} h={52}/><div style={{height:8}}/><SkeletonBlock C={C} h={52}/></> :
           courses.length===0 ? <div style={{ color:C.textMuted, fontSize:13 }}>No courses yet.</div> :
           courses.slice(0,4).map((c,i) => {
            const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
            return (
              <div key={c.courseId} className="list-row"
                style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:13, background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, marginBottom:8, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${color},${color}44)`, borderRadius:"13px 0 0 13px" }}/>
                <div style={{ width:38, height:38, borderRadius:11, background:`${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, border:`1px solid ${color}22` }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{c.courseName}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{c.credits} credits</div>
                </div>
                <div style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 8px ${color}`, flexShrink:0 }}/>
              </div>
            );
          })}
        </Panel>

        {/* Assignment status chart */}
        <Panel C={C}>
          <PH title="Assignment Overview" C={C}/>
          {loading ? <SkeletonBlock C={C} h={120}/> : (
            <>
              {/* Donut-style visual */}
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
                <div style={{ position:"relative", width:80, height:80, flexShrink:0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    {(() => {
                      const total = assignments.length || 1;
                      const overdue = assignments.filter(a=>getTag(a.dueDate)==="Overdue").length;
                      const dueSoon = assignments.filter(a=>getTag(a.dueDate)==="Due Soon").length;
                      const pending = assignments.filter(a=>getTag(a.dueDate)==="Pending").length;
                      const r = 30, cx = 40, cy = 40, circ = 2*Math.PI*r;
                      const segs = [
                        { val:overdue, color:C.rose },
                        { val:dueSoon, color:C.amber },
                        { val:pending, color:C.teal },
                      ];
                      let offset = 0;
                      return segs.map((seg,i) => {
                        const dash = (seg.val/total)*circ;
                        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="10"
                          strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-offset} strokeLinecap="round"
                          style={{ transform:"rotate(-90deg)", transformOrigin:"center" }}/>;
                        offset += dash;
                        return el;
                      });
                    })()}
                    <circle cx="40" cy="40" r="20" fill={C.surface2}/>
                    <text x="40" y="44" textAnchor="middle" style={{ fontSize:14, fontWeight:700, fill:C.text, fontFamily:mono }}>{assignments.length}</text>
                  </svg>
                </div>
                <div style={{ flex:1 }}>
                  {[
                    [assignments.filter(a=>getTag(a.dueDate)==="Overdue").length, "Overdue", C.rose],
                    [assignments.filter(a=>getTag(a.dueDate)==="Due Soon").length, "Due Soon", C.amber],
                    [assignments.filter(a=>getTag(a.dueDate)==="Pending").length, "Pending", C.teal],
                  ].map(([n,l,c]) => (
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }}/>
                      <div style={{ flex:1, fontSize:12, color:C.textMuted }}>{l}</div>
                      <div style={{ fontFamily:mono, fontSize:13, fontWeight:700, color:c }}>{n}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent assignments */}
              {assignments.slice(0,3).map((a,i) => {
                const tag = getTag(a.dueDate);
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, background:C.surface2, marginBottom:6 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:tag==="Overdue"?C.rose:tag==="Due Soon"?C.amber:C.teal, flexShrink:0 }}/>
                    <div style={{ flex:1, fontSize:12, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.title}</div>
                    <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99, ...tagStyle(tag,C) }}>{tag}</span>
                  </div>
                );
              })}
            </>
          )}
        </Panel>
      </div>

      {/* Student attendance heatmap row */}
      <Panel C={C}>
        <PH title="Student Attendance Overview" link="Mark Attendance" onLink={()=>setActive("Mark Attendance")} C={C}/>
        {loading ? <SkeletonBlock C={C} h={80}/> : students.length===0 ? <div style={{ color:C.textMuted, fontSize:13 }}>No students yet.</div> : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
              {students.slice(0,8).map((s,i) => {
                return (
                  <div key={s.studentId} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:C.surface2, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <UserAvatar role="student" id={s.studentId} name={s.name} size={34} C={C}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>{s.department}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {students.length > 8 && <div style={{ fontSize:12, color:C.textMuted, textAlign:"center", marginTop:4 }}>+{students.length-8} more students</div>}
          </div>
        )}
      </Panel>
    </div>
  );
}

function TeacherCourses({ user, C }) {
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [newCourse,  setNewCourse]  = useState({ courseName:"", credits:"" });
  const [saving,     setSaving]     = useState(false);
  const [editCourse, setEditCourse] = useState(null);  // course being edited
  const [editForm,   setEditForm]   = useState({ courseName:"", credits:"" });
  const [roster,     setRoster]     = useState(null);  // { courseId, courseName, students[] }
  const [rosterLoading, setRosterLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/courses/teacher/${user?.teacherId}`).then(r=>r.json())
      .then(d=>{ setCourses(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>{ if(user?.teacherId) load(); }, [user?.teacherId]);

  const handleAdd = async () => {
    if (!newCourse.courseName || !newCourse.credits) return;
    setSaving(true);
    await fetch(`${API}/api/courses`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ courseName:newCourse.courseName, credits:parseInt(newCourse.credits), teacher:{ teacherId:user.teacherId } })
    });
    setSaving(false); setShowForm(false); setNewCourse({ courseName:"", credits:"" }); load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`${API}/api/courses/${id}`, { method:"DELETE" });
    load();
  };

  const startEdit = (c) => {
    setEditCourse(c);
    setEditForm({ courseName:c.courseName, credits:String(c.credits) });
  };

  const handleEdit = async () => {
    if (!editForm.courseName || !editForm.credits) return;
    setSaving(true);
    await fetch(`${API}/api/courses/${editCourse.courseId}`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ courseName:editForm.courseName, credits:parseInt(editForm.credits) })
    });
    setSaving(false); setEditCourse(null); load();
  };

  const viewRoster = async (c) => {
    setRosterLoading(true);
    setRoster({ courseId:c.courseId, courseName:c.courseName, students:[] });
    // derive roster from attendance records
    const res = await fetch(`${API}/api/attendance/course/${c.courseId}`);
    const records = await res.json();
    const seen = {};
    const students = [];
    if (Array.isArray(records)) {
      records.forEach(r => {
        if (r.student && !seen[r.student.studentId]) {
          seen[r.student.studentId] = true;
          students.push(r.student);
        }
      });
    }
    setRoster({ courseId:c.courseId, courseName:c.courseName, students });
    setRosterLoading(false);
  };

  const inputStyle = { width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* ── Header bar ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:font, fontSize:20, fontWeight:700, color:C.text }}>Course Management</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{courses.length} course{courses.length!==1?"s":""} assigned · manage roster, marks & materials</div>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,185,106,0.35)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Course
        </button>
      </div>

      {/* ── Add course form ── */}
      {showForm && (
        <div style={{ padding:"22px 24px", background:`linear-gradient(135deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.goldMid}`, borderRadius:18, boxShadow:`0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${C.goldMid}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, background:`radial-gradient(circle,${C.gold}12 0%,transparent 65%)`, pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${C.goldMid}` }}>
              <NavGlyph name="layers" color={C.gold}/>
            </div>
            <div>
              <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:C.text }}>New Course</div>
              <div style={{ fontSize:11, color:C.textMuted }}>Fill in the details to create a new course</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
            {[["Course Name","courseName","e.g. Data Structures & Algorithms"],["Credits","credits","e.g. 4"]].map(([l,k,p]) => (
              <div key={k}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
                <input value={newCourse[k]} onChange={e=>setNewCourse(n=>({...n,[k]:e.target.value}))} placeholder={p}
                  style={{ width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, fontFamily:body, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleAdd} disabled={saving}
              style={{ padding:"11px 24px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(232,185,106,0.3)" }}>
              {saving ? "Saving…" : "✓ Save Course"}
            </button>
            <button onClick={()=>setShowForm(false)}
              style={{ padding:"11px 20px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Edit course modal ── */}
      {editCourse && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:28, width:440, boxShadow:"0 24px 64px rgba(0,0,0,0.4)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160, background:`radial-gradient(circle,${C.gold}10 0%,transparent 65%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <NavGlyph name="book" color={C.gold}/>
              </div>
              <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Edit Course</div>
            </div>
            {[["Course Name","courseName","text"],["Credits","credits","number"]].map(([l,k,t])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
                <input value={editForm[k]} onChange={e=>setEditForm(f=>({...f,[k]:e.target.value}))} type={t} min="1" max="6"
                  style={{ width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, fontFamily:body, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:22 }}>
              <button onClick={handleEdit} disabled={saving} style={{ flex:1, padding:"11px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer" }}>{saving?"Saving…":"Save Changes"}</button>
              <button onClick={()=>setEditCourse(null)} style={{ flex:1, padding:"11px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Roster modal ── */}
      {roster && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:28, width:500, maxHeight:"72vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 64px rgba(0,0,0,0.4)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-50, left:-50, width:160, height:160, background:`radial-gradient(circle,${C.teal}10 0%,transparent 65%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, position:"relative" }}>
              <div>
                <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Student Roster</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{roster.courseName} · {rosterLoading?"loading…":`${roster.students.length} student${roster.students.length!==1?"s":""}`}</div>
              </div>
              <button onClick={()=>setRoster(null)}
                style={{ width:32, height:32, borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.textMuted, fontSize:16 }}>✕</button>
            </div>
            {rosterLoading ? (
              <SkeletonBlock C={C} h={60}/>
            ) : roster.students.length === 0 ? (
              <div style={{ textAlign:"center", padding:"32px 0", color:C.textMuted }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🎓</div>
                <div style={{ fontSize:13 }}>No students have attendance records for this course yet.</div>
              </div>
            ) : (
              <div style={{ overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
                {roster.students.map((s,i) => (
                  <div key={s.studentId} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, border:`1px solid ${C.border}`, borderRadius:13, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${C.teal},${C.teal}44)`, borderRadius:"13px 0 0 13px" }}/>
                    <UserAvatar role="student" id={s.studentId} name={s.name} size={36} C={C}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{s.usn || s.email}</div>
                    </div>
                    <div style={{ fontSize:10, padding:"4px 10px", borderRadius:99, background:C.tealDim, color:C.teal, fontWeight:600 }}>{s.year}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Course cards ── */}
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          <SkeletonBlock C={C} h={200}/><SkeletonBlock C={C} h={200}/><SkeletonBlock C={C} h={200}/>
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:C.textMuted, border:`2px dashed ${C.border}`, borderRadius:20 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📖</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>No courses yet</div>
          <div style={{ fontSize:13 }}>Click "Add Course" to create your first course.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {courses.map((c,i) => {
            const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
            return (
              <div key={c.courseId} className="course-card-glass"
                style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:0, position:"relative", overflow:"hidden", boxShadow:`${C.cardGlow},${C.cardShadow}`, transition:"transform 0.25s ease, box-shadow 0.25s ease" }}>
                {/* Top accent bar */}
                <div style={{ height:4, background:`linear-gradient(90deg,${color},${color}55)`, borderRadius:"18px 18px 0 0" }}/>
                <div style={{ padding:"18px 20px 20px", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, right:0, width:110, height:110, background:`radial-gradient(circle at 80% 20%,${color}15 0%,transparent 65%)`, pointerEvents:"none" }}/>
                  {/* Header */}
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, border:`1px solid ${color}25` }}>
                      {COURSE_ICONS[i%COURSE_ICONS.length]}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                      <span style={{ fontSize:11, padding:"4px 12px", borderRadius:99, background:`${color}18`, color, fontWeight:700, border:`1px solid ${color}25` }}>{c.credits} Credits</span>
                    </div>
                  </div>
                  {/* Course name */}
                  <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.3 }}>{c.courseName}</div>
                  <div style={{ fontSize:11, color:C.textDim, marginBottom:18, display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:color, opacity:0.7 }}/>
                    Active course
                  </div>
                  {/* Divider */}
                  <div style={{ height:1, background:C.border, marginBottom:14 }}/>
                  {/* Actions */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7 }}>
                    <button onClick={()=>viewRoster(c)}
                      style={{ padding:"8px 4px", borderRadius:10, border:`1px solid ${C.border}`, background:C.surface2, color:C.textMuted, fontFamily:body, fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.background=C.tealDim;e.currentTarget.style.color=C.teal;e.currentTarget.style.borderColor=`${C.teal}30`;}}
                      onMouseLeave={e=>{e.currentTarget.style.background=C.surface2;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.borderColor=C.border;}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Roster
                    </button>
                    <button onClick={()=>startEdit(c)}
                      style={{ padding:"8px 4px", borderRadius:10, border:`1px solid ${C.gold}30`, background:C.goldDim, color:C.gold, fontFamily:body, fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button onClick={()=>handleDelete(c.courseId)}
                      style={{ padding:"8px 4px", borderRadius:10, border:`1px solid rgba(248,113,113,0.25)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



function TeacherAttendance({ user, C }) {
  const [courses,         setCourses]         = useState([]);
  const [students,        setStudents]        = useState([]);
  const [selected,        setSelected]        = useState(null);
  const [attMap,          setAttMap]          = useState({});
  const [statsMap,        setStatsMap]        = useState({});
  const [saving,          setSaving]          = useState(false);
  const [date,            setDate]            = useState(new Date().toISOString().split("T")[0]);
  const [historyEditMode, setHistoryEditMode] = useState(false);
  const [existingRecords, setExistingRecords] = useState({});
  const [saveMessage,     setSaveMessage]     = useState(null);
  const [saveMsgType,     setSaveMsgType]     = useState("success");
  const [flashStudent,    setFlashStudent]    = useState(null);
  const reducedMotionTA   = useReducedMotion();

  useEffect(() => {
    if (!user?.teacherId) return;
    fetch(`${API}/api/courses/teacher/${user.teacherId}`).then(r=>r.json())
      .then(d=>{ const c=Array.isArray(d)?d:[]; setCourses(c); if(c.length>0) selectCourse(c[0], date); })
      .catch(()=>{});
  }, [user?.teacherId]);

  const fetchStats = (courseId) => {
    fetch(`${API}/api/attendance/course/${courseId}/stats`).then(r=>r.json())
      .then(d=>{
        const m = {};
        if (Array.isArray(d)) d.forEach(s => m[s.studentId] = s.attendancePercentage);
        setStatsMap(m);
      }).catch(()=>{});
  };

  const selectCourse = (course, selectedDate) => {
    setSelected(course);
    setSaveMessage(null);
    loadStudentsForDate(course, selectedDate);
  };

  const loadStudentsForDate = (course, selectedDate) => {
    const today = new Date().toISOString().split("T")[0];
    const isPast = selectedDate < today;
    setHistoryEditMode(isPast);
    setExistingRecords({});

    // Fetch students in the teacher's department + stats for this course in parallel
    const teacherDept = encodeURIComponent(user?.department || "");
    Promise.all([
      fetch(`${API}/api/students/department/${teacherDept}`).then(r=>r.json()).catch(() =>
        fetch(`${API}/api/students`).then(r=>r.json())
      ),
      fetch(`${API}/api/attendance/course/${course.courseId}/stats`).then(r=>r.json()).catch(()=>[]),
    ]).then(async ([studentList, statsData]) => {
      // Filter by department on the client side as well (defence against fallback)
      const allStudents = (Array.isArray(studentList) ? studentList : [])
        .filter(s => !user?.department || s.department === user.department);
      const stats = Array.isArray(statsData) ? statsData : [];

      // Build statsMap
      const m = {};
      stats.forEach(s => { m[s.studentId] = s.attendancePercentage; });
      setStatsMap(m);

      // Only show students who are enrolled in this course
      // A student is "enrolled" if they have attendance records OR if it's a new date (show all dept students)
      const enrolledIds = new Set(stats.map(s => s.studentId));
      // If no attendance records yet for this course, show all students in teacher's department
      const list = enrolledIds.size > 0
        ? allStudents.filter(s => enrolledIds.has(s.studentId))
        : allStudents;

      setStudents(list);

      if (isPast) {
        const res = await fetch(`${API}/api/attendance/course/${course.courseId}/date/${selectedDate}`);
        const existing = await res.json();
        const recMap = {};
        const statusInit = {};
        list.forEach(s => { statusInit[s.studentId] = "Absent"; });
        if (Array.isArray(existing)) {
          existing.forEach(r => {
            recMap[r.student.studentId] = r.attendanceId;
            statusInit[r.student.studentId] = r.status;
          });
        }
        setExistingRecords(recMap);
        setAttMap(statusInit);
      } else {
        const initMap = {};
        list.forEach(s => initMap[s.studentId] = "Present");
        setAttMap(initMap);
      }
    }).catch(()=>{});
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSaveMessage(null);
    if (selected) loadStudentsForDate(selected, newDate);
  };

  const toggle = (id) => {
    setAttMap(m => ({ ...m, [id]: cycleStatus(m[id] || "Present") }));
    setSaveMessage(null);
    setFlashStudent(id);
    window.setTimeout(() => setFlashStudent(null), 480);
  };

  const handleSave = async () => {
    if (!selected || students.length === 0) return;
    setSaving(true); setSaveMessage(null);
    try {
      await Promise.all(students.map(s => {
        const status = attMap[s.studentId] || "Present";
        if (historyEditMode && existingRecords[s.studentId]) {
          // update existing record
          return fetch(`${API}/api/attendance/${existingRecords[s.studentId]}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
          });
        } else {
          // create new record
          return fetch(`${API}/api/attendance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student: { studentId: s.studentId }, course: { courseId: selected.courseId }, attendanceDate: date, status })
          });
        }
      }));
      setSaveMsgType("success");
      setSaveMessage(`Attendance saved for ${date}`);
      setHistoryEditMode(false);
      fetchStats(selected.courseId);
    } catch {
      setSaveMsgType("error");
      setSaveMessage("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const presentCount = students.filter(s => (attMap[s.studentId]||"Present")==="Present").length;
  const absentCount  = students.filter(s => attMap[s.studentId]==="Absent").length;
  const total = students.length;
  const progressPct = total > 0 ? Math.round((presentCount/total)*100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* ── Top header row ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <NavGlyph name="calendar" color={C.gold}/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{selected ? selected.courseName : "Select a course to begin"}</div>
            <div style={{ fontSize:11, color:C.textMuted }}>{date ? `Session date: ${date}` : "No date selected"}</div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving||!selected||students.length===0}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", borderRadius:12, border:"none",
            background:(!selected||students.length===0)?`1px solid ${C.border}`:"linear-gradient(135deg,#e8b96a,#c4973a)",
            backgroundColor:(!selected||students.length===0)?C.surface2:undefined,
            color:(!selected||students.length===0)?C.textDim:"#0d1117",
            fontFamily:body, fontSize:14, fontWeight:700, cursor:(!selected||students.length===0||saving)?"not-allowed":"pointer",
            opacity:saving?0.7:1, transition:"all 0.3s",
            boxShadow:(selected&&students.length>0)?"0 4px 20px rgba(232,185,106,0.35)":"none" }}
          onMouseEnter={e=>{ if(selected&&students.length>0&&!saving){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(232,185,106,0.45)"; } }}
          onMouseLeave={e=>{ if(selected&&students.length>0&&!saving){ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(232,185,106,0.35)"; } }}
        >
          {saving
            ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite"}}/> Saving…</>
            : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Save Attendance</>}
        </button>
      </div>

      {/* ── Course selector pills ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {courses.length===0
          ? <div style={{ color:C.textMuted, fontSize:13 }}>No courses yet. Add a course first.</div>
          : courses.map((c,i) => {
              const col = C[COURSE_COLORS[i%COURSE_COLORS.length]];
              const isSel = selected?.courseId===c.courseId;
              return (
                <button key={c.courseId} onClick={()=>selectCourse(c, date)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:99,
                    border:`1.5px solid ${isSel?col:C.border}`,
                    background:isSel?`${col}18`:"transparent",
                    color:isSel?col:C.textMuted,
                    fontSize:13, fontWeight:isSel?700:400, cursor:"pointer", fontFamily:body, transition:"all 0.2s",
                    boxShadow:isSel?`0 0 0 3px ${col}20`:"none" }}>
                  <span style={{ fontSize:15 }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</span>
                  {c.courseName}
                  {isSel && <span style={{ width:6, height:6, borderRadius:"50%", background:col, marginLeft:2 }}/>}
                </button>
              );
            })}
      </div>

      {/* ── Bulk import ── */}
      <BulkImportPanel 
        type="attendance" 
        courses={courses} 
        C={C}
        selectedCourseId={selected?.courseId}
        onCourseChange={(newId) => {
          const c = courses.find(x => String(x.courseId) === String(newId));
          if (c) selectCourse(c, date);
        }}
        selectedDate={date}
        onDateChange={handleDateChange}
        onImportSuccess={(importedCourseId) => {
          const c = courses.find(x => String(x.courseId) === String(importedCourseId));
          if (c) selectCourse(c, date);
        }}
      />

      {/* ── Date picker & stats row ── */}
      {selected && (
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr 1fr 1fr", gap:14, alignItems:"stretch" }}>
          {/* Date */}
          <div style={{ padding:"16px 20px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, boxShadow:`${C.cardGlow},${C.cardShadow}`, display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim }}>Date</div>
            <input type="date" value={date} onChange={e=>handleDateChange(e.target.value)}
              style={{ padding:"9px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", cursor:"pointer", transition:"border-color 0.2s" }}
              onFocus={e=>{ e.currentTarget.style.borderColor=C.gold; }}
              onBlur={e=>{ e.currentTarget.style.borderColor=C.border; }}
            />
          </div>
          {/* Present stat */}
          {[[ presentCount, C.teal, "Present", "✓"],[ absentCount, C.rose, "Absent", "✗"],[total, C.textMuted, "Total","#"]].map(([n,col,lab,sym]) => (
            <div key={lab} style={{ padding:"16px 20px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, boxShadow:`${C.cardGlow},${C.cardShadow}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:`radial-gradient(circle at 80% 20%,${col}20 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ fontFamily:mono, fontSize:28, fontWeight:700, color:col, lineHeight:1 }}>
                <AnimatedNumber value={n} decimals={0} duration={500} reducedMotion={reducedMotionTA} loading={false} />
              </div>
              <div style={{ fontSize:11, color:C.textMuted, fontWeight:500 }}>{lab}</div>
              {lab==="Present" && total>0 && <div style={{ fontSize:10, color:col, fontWeight:600, marginTop:2 }}>{progressPct}%</div>}
            </div>
          ))}
        </div>
      )}

      {/* ── History edit banner ── */}
      {historyEditMode && (
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:14 }}>
          <span style={{ fontSize:22 }}>✏️</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#f59e0b" }}>Editing Past Record</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>Changes will update existing attendance entries for this date.</div>
          </div>
        </div>
      )}

      {/* ── Save feedback ── */}
      {saveMessage && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 18px", background:saveMsgType==="success"?C.tealDim:C.roseDim, border:`1px solid ${saveMsgType==="success"?C.teal+"40":C.rose+"40"}`, borderRadius:12 }}>
          <span style={{ fontSize:16 }}>{saveMsgType==="success"?"✅":"❌"}</span>
          <span style={{ fontSize:13, fontWeight:500, color:saveMsgType==="success"?C.teal:C.rose }}>{saveMessage}</span>
        </div>
      )}

      {/* ── Student list ── */}
      {selected && (
        <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:"20px 22px", boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
          {/* Subheader with quick-actions */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>
              {total > 0 ? `${total} Students` : "No students found"}
            </div>
            {total > 0 && (
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{ const m={}; students.forEach(s=>m[s.studentId]="Present"); setAttMap(m); setSaveMessage(null); }}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:10, border:`1px solid ${C.teal}40`, background:C.tealDim, color:C.teal, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 0 0 2px ${C.teal}30`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  All Present
                </button>
                <button onClick={()=>{ const m={}; students.forEach(s=>m[s.studentId]="Absent"); setAttMap(m); setSaveMessage(null); }}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:10, border:`1px solid ${C.rose}40`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 0 0 2px ${C.rose}30`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  All Absent
                </button>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div style={{ height:5, background:C.border, borderRadius:99, marginBottom:18, overflow:"hidden" }}>
              <div style={{ width:`${progressPct}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.teal}aa)`, borderRadius:99, transition:"width 0.6s cubic-bezier(0.22,1,0.36,1)" }}/>
            </div>
          )}

          {/* Student rows */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {students.length===0 && <div style={{ color:C.textMuted, fontSize:13, padding:"12px 0" }}>No students enrolled for this course yet.</div>}
            {students.map((s,i) => {
              const status = attMap[s.studentId] || "Present";
              const isPresent = status === "Present";
              const color  = isPresent ? C.teal : C.rose;
              const colorDim = isPresent ? C.tealDim : C.roseDim;
              const pct    = statsMap[s.studentId];
              const atRisk = pct !== undefined && pct < 75;
              return (
                <div key={i}
                  className={flashStudent===s.studentId ? "row-attn-flash" : "list-row"}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14,
                    background:C.surface2,
                    boxShadow:`0 0 0 1.5px ${isPresent?C.teal+"25":C.rose+"25"}`,
                    transition:"box-shadow 0.2s" }}>
                  <UserAvatar role="student" id={s.studentId} name={s.name} size={40} C={C}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:atRisk?C.rose:C.text, display:"flex", alignItems:"center", gap:8 }}>
                      {s.name}
                      {atRisk && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:99, background:C.roseDim, color:C.rose, fontWeight:700 }}>AT RISK</span>}
                    </div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:2, display:"flex", gap:8, alignItems:"center" }}>
                      <span>{s.usn || s.email}</span>
                      {pct !== undefined && (
                        <span style={{ color:atRisk?C.rose:C.textDim, fontWeight:500 }}>· {pct.toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                  {/* Overall attendance mini-bar */}
                  {pct !== undefined && (
                    <div style={{ width:70, flexShrink:0 }}>
                      <div style={{ height:4, background:C.border, borderRadius:99, overflow:"hidden", marginBottom:3 }}>
                        <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:pct<75?C.rose:pct>=90?C.teal:C.amber, borderRadius:99, transition:"width 0.5s" }}/>
                      </div>
                    </div>
                  )}
                  {/* Status toggle */}
                  <button type="button" onClick={()=>toggle(s.studentId)}
                    className={flashStudent===s.studentId ? "btn-att-toggle" : ""}
                    style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:99,
                      border:`1.5px solid ${color}50`,
                      background:colorDim,
                      color, fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer",
                      minWidth:110, justifyContent:"center",
                      boxShadow:`0 0 0 0px ${color}30`,
                      transition:"all 0.2s ease" }}
                    onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 0 0 3px ${color}30`; e.currentTarget.style.transform="scale(1.03)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.boxShadow=`0 0 0 0px ${color}30`; e.currentTarget.style.transform="scale(1)"; }}
                  >
                    {isPresent
                      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Present</>
                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Absent</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ textAlign:"center", padding:"56px 0", color:C.textMuted }}>
          <div style={{ fontSize:48, marginBottom:14 }}>📅</div>
          <div style={{ fontSize:16, fontWeight:500, color:C.text, marginBottom:6 }}>Select a course above</div>
          <div style={{ fontSize:13 }}>Choose a course to start marking attendance</div>
        </div>
      )}
    </div>
  );
}

function SubmissionsViewer({ assignmentId, assignmentTitle, C }) {
  const [open,       setOpen]       = useState(false);
  const [subs,       setSubs]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [gradeMap,   setGradeMap]   = useState({});   // submissionId -> { grade, comment }
  const [savingId,   setSavingId]   = useState(null);
  const [savedId,    setSavedId]    = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/submissions/assignment/${assignmentId}`).then(r=>r.json())
      .then(d=>{
        const list = Array.isArray(d)?d:[];
        setSubs(list);
        // pre-fill existing grades
        const m = {};
        list.forEach(s => { m[s.submissionId] = { grade:s.grade||"", comment:s.comment||"" }; });
        setGradeMap(m);
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  };

  const handleOpen = () => { load(); setOpen(true); };

  const setField = (id, field, val) =>
    setGradeMap(m => ({ ...m, [id]: { ...m[id], [field]: val } }));

  const handleGrade = async (submissionId) => {
    setSavingId(submissionId);
    const { grade, comment } = gradeMap[submissionId] || {};
    await fetch(`${API}/api/submissions/${submissionId}/grade`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ grade, comment })
    });
    setSavingId(null);
    setSavedId(submissionId);
    // Close panel after showing "Saved!" briefly
    setTimeout(() => { setSavedId(null); setOpen(false); }, 1200);
  };

  return (
    <>
      <button type="button" onClick={handleOpen} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:10, border:"none", background:C.tealDim, color:C.teal, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <NavGlyph name="clipboard" color={C.teal} />
        Submissions
      </button>

      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:1000 }}>
          <button type="button" aria-label="Close panel" onClick={()=>setOpen(false)} className="submissions-backdrop" style={{ position:"absolute", inset:0, border:"none", padding:0, cursor:"pointer", background:"rgba(10,12,16,0.45)", backdropFilter:"blur(6px)" }}/>
          <aside className="slide-panel-in" style={{ position:"absolute", top:0, right:0, height:"100%", width:"min(520px, 100vw)", background:`linear-gradient(200deg, ${C.surface} 0%, ${C.surface2} 100%)`, boxShadow:"-28px 0 60px rgba(0,0,0,0.35)", display:"flex", flexDirection:"column", borderTopLeftRadius:22, borderBottomLeftRadius:22, overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 22px", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontFamily:font, fontSize:17, fontWeight:700, color:C.text }}>Submissions</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>{assignmentTitle}</div>
              </div>
              <button type="button" onClick={()=>setOpen(false)} style={{ width:36, height:36, borderRadius:10, border:"none", background:C.surface2, color:C.textMuted, cursor:"pointer", fontSize:18 }}>×</button>
            </div>
            <div className="slide-panel-body" style={{ overflowY:"auto", padding:"18px 22px", flex:1 }}>
              {loading ? (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <SkeletonBlock C={C} h={72} />
                  <SkeletonBlock C={C} h={72} />
                  <SkeletonBlock C={C} h={72} />
                </div>
              ) : subs.length===0 ? (
                <div style={{ color:C.textMuted, fontSize:13, padding:"24px 0" }}>No submissions yet.</div>
              ) : (
                subs.map((s,i) => {
                  const g = gradeMap[s.submissionId] || { grade:"", comment:"" };
                  const isSaving = savingId===s.submissionId;
                  const isSaved  = savedId===s.submissionId;
                  return (
                    <div key={i} className="fade-stagger" style={{ background:C.surface2, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                        <UserAvatar role="student" id={s.student?.studentId} name={s.student?.name} size={40} C={C}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{s.student?.name}</div>
                          <div style={{ fontSize:11, color:C.textMuted }}>{s.student?.usn || s.student?.email}</div>
                        </div>
                        <div style={{ fontSize:11, color:C.textMuted, flexShrink:0 }}>{new Date(s.submittedAt).toLocaleDateString()}</div>
                        <a href={`${API}/api/submissions/download/${s.submissionId}`} target="_blank" rel="noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, border:"none", background:C.tealDim, color:C.teal, fontSize:12, fontWeight:600, textDecoration:"none", flexShrink:0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                          File
                        </a>
                      </div>
                      <div style={{ display:"flex", gap:10, alignItems:"flex-end", flexWrap:"wrap" }}>
                        <div style={{ width:90 }}>
                          <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>Grade</label>
                          <input value={g.grade} onChange={e=>setField(s.submissionId,"grade",e.target.value)}
                            placeholder="e.g. A+"
                            style={{ width:"100%", padding:"9px 11px", background:C.surface, borderRadius:11, fontSize:13, color:C.text, fontFamily:body, outline:"none", border:`1px solid ${C.border}` }}/>
                        </div>
                        <div style={{ flex:1, minWidth:160 }}>
                          <label style={{ display:"block", fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>Comment</label>
                          <input value={g.comment} onChange={e=>setField(s.submissionId,"comment",e.target.value)}
                            placeholder="Feedback for student…"
                            style={{ width:"100%", padding:"9px 11px", background:C.surface, borderRadius:11, fontSize:13, color:C.text, fontFamily:body, outline:"none", border:`1px solid ${C.border}` }}/>
                        </div>
                        <button type="button" onClick={()=>handleGrade(s.submissionId)} disabled={isSaving}
                          className={isSaved ? "grade-saved-pop" : ""}
                          style={{ padding:"9px 16px", borderRadius:11, border:"none", background:isSaved?C.teal:"linear-gradient(135deg, #e8b96a, #c4973a)", color:"#0f1117", fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                          {isSaving ? "Saving…" : isSaved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function TeacherAssignments({ user, C }) {
  const [courses,     setCourses]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState({ title:"", courseId:"", dueDate:"", description:"" });
  const [saving,      setSaving]      = useState(false);
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/courses/teacher/${user?.teacherId}`).then(r=>r.json()),
      fetch(`${API}/api/assignments`).then(r=>r.json()),
    ]).then(([c,a]) => {
      const myCourses = Array.isArray(c)?c:[];
      const myCourseIds = new Set(myCourses.map(c=>c.courseId));
      setCourses(myCourses);
      // filter assignments to only this teacher's courses
      setAssignments((Array.isArray(a)?a:[]).filter(a=>myCourseIds.has(a.course?.courseId)));
      setLoading(false);
    }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ if(user?.teacherId) load(); }, [user?.teacherId]);

  const handleCreate = async () => {
    if (!form.title || !form.courseId || !form.dueDate) return;
    setSaving(true);
    await fetch(`${API}/api/assignments`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ title:form.title, description:form.description, dueDate:form.dueDate, course:{courseId:parseInt(form.courseId)} })
    });
    setSaving(false); setShowForm(false); setForm({ title:"", courseId:"", dueDate:"", description:"" }); load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    await fetch(`${API}/api/assignments/${id}`, { method:"DELETE" });
    load();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.purpleDim||C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <NavGlyph name="clipboard" color={C.purple||C.gold}/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Assignment Management</div>
            <div style={{ fontSize:11, color:C.textMuted }}>{assignments.length} assignment{assignments.length!==1?"s":""} created</div>
          </div>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,185,106,0.3)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Assignment
        </button>
      </div>

      {showForm && (
        <div style={{ padding:22, background:C.surface, border:`1px solid ${C.goldMid}`, borderRadius:16, boxShadow:`0 4px 24px rgba(0,0,0,0.08)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <NavGlyph name="clipboard" color={C.gold}/>
            </div>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>New Assignment</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["Title","title","e.g. Lab Assignment 4","text"],["Due Date","dueDate","","date"]].map(([l,k,p,t]) => (
              <div key={k}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
                <input value={form[k]} onChange={e=>s(k,e.target.value)} placeholder={p} type={t}
                  min={t==="date" ? new Date().toISOString().split("T")[0] : undefined}
                  style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none" }}/>
              </div>
            ))}
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Course</label>
              <select value={form.courseId} onChange={e=>s("courseId",e.target.value)}
                style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:form.courseId?C.text:C.textMuted, fontFamily:body, outline:"none", cursor:"pointer" }}>
                <option value="">Select course</option>
                {courses.map(c=><option key={c.courseId} value={c.courseId} style={{ background:C.surface2 }}>{c.courseName}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Instructions</label>
              <textarea value={form.description} onChange={e=>s("description",e.target.value)} placeholder="Describe the assignment requirements…" rows={3}
                style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", resize:"vertical" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleCreate} disabled={saving}
              style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>
              {saving ? "Publishing…" : "Publish Assignment"}
            </button>
            <button onClick={()=>setShowForm(false)}
              style={{ padding:"10px 20px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <Panel C={C}>
        <PH title={`All Assignments (${assignments.length})`} C={C}/>
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <SkeletonBlock C={C} h={64}/><SkeletonBlock C={C} h={64}/>
          </div>
        ) : assignments.length === 0 ? (
          <div style={{ textAlign:"center", padding:"32px 0", color:C.textMuted }}>
            <div style={{ fontSize:32, marginBottom:10 }}>📝</div>
            <div style={{ fontSize:14 }}>No assignments yet. Create your first one above.</div>
          </div>
        ) : assignments.map((a,i) => {
          const tag = getTag(a.dueDate);
          const color = tag==="Overdue"?C.rose:tag==="Due Soon"?C.amber:C.teal;
          return (
            <div key={i} className="list-row" style={{ borderRadius:14, background:C.surface2, marginBottom:10, overflow:"hidden", boxShadow:`0 0 0 1px ${C.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px" }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <NavGlyph name="clipboard" color={color}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{a.title}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>
                    {a.course?.courseName}
                    <span style={{ margin:"0 6px", color:C.border }}>·</span>
                    Due {a.dueDate}
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:99, ...tagStyle(tag,C) }}>{tag}</span>
                <SubmissionsViewer assignmentId={a.assignmentId} assignmentTitle={a.title} C={C}/>
                <button onClick={()=>handleDelete(a.assignmentId)}
                  style={{ width:34, height:34, borderRadius:9, border:"none", background:C.roseDim, color:C.rose, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

function TeacherMarks({ user, C }) {
  const [courses,   setCourses]   = useState([]);
  const [students,  setStudents]  = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [marksMap,  setMarksMap]  = useState({});
  const [existingMap, setExistingMap] = useState({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    if (!user?.teacherId) return;
    const dept = encodeURIComponent(user?.department || "");
    Promise.all([
      fetch(`${API}/api/courses/teacher/${user.teacherId}`).then(r=>r.json()),
      fetch(`${API}/api/students/department/${dept}`).then(r=>r.json()).catch(() =>
        fetch(`${API}/api/students`).then(r=>r.json())
      ),
    ]).then(([c,s]) => {
      const courses = Array.isArray(c)?c:[];
      setCourses(courses);
      // Only show students from this teacher's department
      const deptStudents = (Array.isArray(s)?s:[]).filter(st => !user?.department || st.department === user.department);
      setStudents(deptStudents);
      if (courses.length>0) loadMarksForCourse(courses[0], deptStudents);
    }).catch(()=>{});
  }, [user?.teacherId]);

  const loadMarksForCourse = (course, studentList) => {
    setSelected(course); setSaved(false); setMarksMap({});
    fetch(`${API}/api/marks/course/${course.courseId}`).then(r=>r.json())
      .then(existing => {
        if (!Array.isArray(existing)) return;
        const map = {};
        existing.forEach(m => { map[m.student?.studentId] = { markId: m.markId, marks: m.marks }; });
        setExistingMap(map);
        // pre-fill marksMap with existing values
        const pre = {};
        existing.forEach(m => { pre[m.student?.studentId] = String(m.marks); });
        setMarksMap(pre);
      }).catch(()=>{});
  };

  const setMark = (id, val) => { setMarksMap(m=>({...m,[id]:val})); setSaved(false); };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await Promise.all(
      Object.entries(marksMap).filter(([,v])=>v).map(([studentId, marks]) => {
        const score = parseInt(marks);
        const grade = score>=90?"O":score>=80?"A+":score>=70?"A":score>=60?"B+":"B";
        const existing = existingMap[parseInt(studentId)];
        if (existing?.markId) {
          // update existing
          return fetch(`${API}/api/marks/${existing.markId}`, {
            method:"PUT", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ marks:score, grade })
          });
        } else {
          // create new
          return fetch(`${API}/api/marks`, {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ student:{studentId:parseInt(studentId)}, course:{courseId:selected.courseId}, marks:score, grade })
          });
        }
      })
    );
    setSaving(false); setSaved(true);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <NavGlyph name="chart" color={C.teal}/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Enter Student Marks</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{selected ? `Course: ${selected.courseName}` : "Select a course to begin"}</div>
            </div>
          </div>

        </div>
        <button onClick={handleSave} disabled={saving || !selected}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", borderRadius:12, border:"none", background:saved?"linear-gradient(135deg,#4ecdc4,#2d9e97)":(!selected?"transparent":"linear-gradient(135deg,#e8b96a,#c4973a)"), color:!selected?C.textDim:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:(!selected||saving)?"not-allowed":"pointer", opacity:saving?0.7:1, transition:"all 0.3s", border:!selected?`1px solid ${C.border}`:"none", boxShadow:selected&&!saved?"0 4px 20px rgba(232,185,106,0.3)":"none" }}>
          {saving ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Saving…</>
          : saved ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Save All Marks</>}
        </button>
      </div>

      {/* Course selector pills */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {courses.map((c,i) => {
          const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
          const isSel = selected?.courseId===c.courseId;
          return (
            <button key={c.courseId} onClick={()=>loadMarksForCourse(c, students)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:99, border:`1.5px solid ${isSel?color:C.border}`, background:isSel?`${color}18`:"transparent", color:isSel?color:C.textMuted, fontSize:13, fontWeight:isSel?700:400, cursor:"pointer", fontFamily:body, transition:"all 0.2s", boxShadow:isSel?`0 0 0 3px ${color}20`:"none" }}>
              <span style={{ fontSize:15 }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</span>
              {c.courseName}
              {isSel && <span style={{ width:6, height:6, borderRadius:"50%", background:color, marginLeft:2 }}/>}
            </button>
          );
        })}
      </div>

      <BulkImportPanel 
        type="marks" 
        courses={courses} 
        C={C}
        selectedCourseId={selected?.courseId}
        onCourseChange={(newId) => {
          const c = courses.find(x => String(x.courseId) === String(newId));
          if (c) loadMarksForCourse(c, students);
        }}
        onImportSuccess={(importedCourseId) => {
          const c = courses.find(x => String(x.courseId) === String(importedCourseId));
          if (c) loadMarksForCourse(c, students);
        }}
      />

      {selected && students.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"start" }}>

          {/* Left — student list */}
          <div>
            {/* Grade distribution bar */}
            <div style={{ padding:"16px 20px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, marginBottom:16, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Grade Distribution</div>
              <div style={{ display:"flex", height:8, borderRadius:99, overflow:"hidden", marginBottom:10, gap:2 }}>
                {[
                  [students.filter(s=>parseInt(marksMap[s.studentId]||0)>=90).length, C.gold],
                  [students.filter(s=>{ const m=parseInt(marksMap[s.studentId]||0); return m>=80&&m<90; }).length, C.teal],
                  [students.filter(s=>{ const m=parseInt(marksMap[s.studentId]||0); return m>=70&&m<80; }).length, C.purple],
                  [students.filter(s=>{ const m=parseInt(marksMap[s.studentId]||0); return m>=60&&m<70; }).length, C.blue],
                  [students.filter(s=>{ const m=parseInt(marksMap[s.studentId]||0); return m>0&&m<60; }).length, C.rose],
                  [students.filter(s=>!marksMap[s.studentId]).length, C.surface3],
                ].map(([n,c],i) => n>0 && (
                  <div key={i} style={{ flex:n, height:"100%", background:c, borderRadius:99, transition:"flex 0.4s ease" }}/>
                ))}
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[["O","≥90",C.gold],["+A","80-89",C.teal],["A","70-79",C.purple],["B+","60-69",C.blue],["B","<60",C.rose],["—","Not entered",C.textDim]].map(([g,r,c])=>(
                  <div key={g} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.textMuted }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
                    <span style={{ fontWeight:600, color:c }}>{g}</span> {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Student rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {students.map((s,i) => {
                const raw = marksMap[s.studentId] || "";
                const m   = parseInt(raw) || 0;
                const grade = m>=90?"O":m>=80?"A+":m>=70?"A":m>=60?"B+":"B";
                const gc  = m>=90?C.gold:m>=80?C.teal:m>=70?C.purple:m>=60?C.blue:C.rose;
                const pct = Math.min(100, m);
                const ac  = C[COURSE_COLORS[i%COURSE_COLORS.length]];
                const initials = s.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

                return (
                  <div key={s.studentId} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, background:C.surface2, boxShadow:`0 0 0 1.5px ${m>0?gc+"35":C.border}`, transition:"box-shadow 0.2s" }}>
                    <UserAvatar role="student" id={s.studentId} name={s.name} size={40} C={C}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{s.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{s.usn || s.email}</div>
                    </div>
                    {/* Mini bar */}
                    <div style={{ width:90, flexShrink:0 }}>
                      <div style={{ height:4, background:C.border, borderRadius:99, overflow:"hidden", marginBottom:3 }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:m>0?`linear-gradient(90deg,${gc},${gc}88)`:"transparent", borderRadius:99, transition:"width 0.5s ease" }}/>
                      </div>
                      <div style={{ fontSize:10, color:C.textDim, textAlign:"right" }}>{m>0?`${m}/100`:""}</div>
                    </div>
                    {/* Input */}
                    <input type="number" min="0" max="100" value={raw} onChange={e=>setMark(s.studentId,e.target.value)} placeholder="—"
                      style={{ width:76, padding:"9px 10px", background:C.surface, border:`1.5px solid ${m>0?gc+"70":C.border}`, borderRadius:10, fontSize:15, fontWeight:700, color:m>0?gc:C.text, fontFamily:mono, outline:"none", textAlign:"center", transition:"border-color 0.2s, color 0.2s" }}/>
                    {/* Grade badge */}
                    <div style={{ width:46, height:46, borderRadius:13, background:m>0?`${gc}18`:C.surface3, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:16, fontWeight:700, color:m>0?gc:C.textDim, flexShrink:0, transition:"all 0.3s", boxShadow:m>0?`0 2px 12px ${gc}30`:"none" }}>
                      {m>0?grade:"—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — live summary panel */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, position:"sticky", top:20 }}>
            <div style={{ padding:20, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Live Summary</div>
              {(() => {
                const entered = students.filter(s=>marksMap[s.studentId]);
                const avg = entered.length>0 ? Math.round(entered.reduce((sum,s)=>sum+parseInt(marksMap[s.studentId]||0),0)/entered.length) : 0;
                const highest = entered.length>0 ? Math.max(...entered.map(s=>parseInt(marksMap[s.studentId]||0))) : 0;
                const lowest  = entered.length>0 ? Math.min(...entered.map(s=>parseInt(marksMap[s.studentId]||0))) : 0;
                return (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                      {[["Entered",`${entered.length}/${students.length}`,C.teal],["Average",avg>0?`${avg}%`:"—",C.gold],["Highest",highest>0?highest:"—",C.purple],["Lowest",lowest>0?lowest:"—",C.rose]].map(([l,v,c])=>(
                        <div key={l} style={{ padding:"12px 10px", borderRadius:12, background:C.surface3, textAlign:"center" }}>
                          <div style={{ fontFamily:mono, fontSize:20, fontWeight:700, color:c }}>{v}</div>
                          <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {/* Grade counts */}
                    {[["O",C.gold],["A+",C.teal],["A",C.purple],["B+",C.blue],["B",C.rose]].map(([g,c])=>{
                      const count = students.filter(s=>{
                        const mv=parseInt(marksMap[s.studentId]||0);
                        return g==="O"?mv>=90:g==="A+"?mv>=80&&mv<90:g==="A"?mv>=70&&mv<80:g==="B+"?mv>=60&&mv<70:mv>0&&mv<60;
                      }).length;
                      const pct = students.length>0?Math.round((count/students.length)*100):0;
                      return (
                        <div key={g} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:`${c}18`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:13, fontWeight:700, color:c, flexShrink:0 }}>{g}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
                              <div style={{ width:`${pct}%`, height:"100%", background:c, borderRadius:99, transition:"width 0.4s ease" }}/>
                            </div>
                          </div>
                          <div style={{ fontFamily:mono, fontSize:12, fontWeight:600, color:c, minWidth:20, textAlign:"right" }}>{count}</div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>

            {/* Course info */}
            {selected && (
              <div style={{ padding:16, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:14, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Course Info</div>
                {[["Course",selected.courseName],["Credits",`${selected.credits} Cr`],["Students",students.length]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                    <span style={{ color:C.textMuted }}>{k}</span>
                    <span style={{ color:C.text, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ textAlign:"center", padding:"48px 0", color:C.textMuted }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
          <div style={{ fontSize:15, fontWeight:500, color:C.text, marginBottom:6 }}>Select a course above</div>
          <div style={{ fontSize:13 }}>Choose a course to start entering marks for students</div>
        </div>
      )}

      {selected && students.length===0 && (
        <div style={{ textAlign:"center", padding:"48px 0", color:C.textMuted }}>
          <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
          <div style={{ fontSize:14 }}>No students found.</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADMIN PAGES
══════════════════════════════════════════════ */

function LiveSystemStatus({ C }) {
  const [apiStatus,  setApiStatus]  = useState("checking");
  const [dbStatus,   setDbStatus]   = useState("checking");
  const [settings,   setSettings]   = useState(null);
  const [lastCheck,  setLastCheck]  = useState(null);

  const check = () => {
    setApiStatus("checking");
    setDbStatus("checking");

    // Check API + settings
    const start = Date.now();
    fetch(`${API}/api/system/settings`)
      .then(r => {
        const ms = Date.now() - start;
        if (r.ok) {
          setApiStatus(`Online · ${ms}ms`);
          return r.json();
        } else {
          setApiStatus("Error");
          return null;
        }
      })
      .then(data => {
        if (data) setSettings(data);
        setLastCheck(new Date().toLocaleTimeString());
      })
      .catch(() => {
        setApiStatus("Offline");
        setLastCheck(new Date().toLocaleTimeString());
      });

    // Check DB independently via real query
    fetch(`${API}/api/health/db`)
      .then(r => r.json())
      .then(data => {
        setDbStatus(data.status === "Connected" ? "Connected" : "Disconnected");
      })
      .catch(() => {
        setDbStatus("Unreachable");
      });
  };

  useEffect(() => { check(); }, []);

  const isOnline = apiStatus !== "Offline" && apiStatus !== "Error" && apiStatus !== "checking";

  const items = [
    {
      label: "API Server",
      status: apiStatus === "checking" ? "Checking…" : apiStatus,
      color: apiStatus === "checking" ? C.textDim : isOnline ? C.teal : C.rose,
      dot: apiStatus === "checking" ? C.textDim : isOnline ? C.teal : C.rose,
      pulse: isOnline,
    },
    {
      label: "Database",
      status: dbStatus === "checking" ? "Checking…" : dbStatus,
      color: dbStatus === "Connected" ? C.teal : dbStatus === "checking" ? C.textDim : C.rose,
      dot: dbStatus === "Connected" ? C.teal : dbStatus === "checking" ? C.textDim : C.rose,
      pulse: dbStatus === "Connected",
    },
    {
      label: "Academic Year",
      status: settings?.activeYear || "—",
      color: C.gold,
      dot: null,
    },
    {
      label: "Active Semester",
      status: settings ? (settings.activeSemester === "Even" ? "Even Sem" : "Odd Sem") : "—",
      color: C.purple,
      dot: null,
    },
    {
      label: "Maintenance",
      status: settings ? (settings.maintenanceMode ? "ON" : "OFF") : "—",
      color: settings?.maintenanceMode ? C.rose : C.teal,
      dot: null,
    },
    {
      label: "Registrations",
      status: settings ? (settings.registrationOpen ? "Open" : "Closed") : "—",
      color: settings?.registrationOpen ? C.teal : C.rose,
      dot: null,
    },
  ];

  return (
    <Panel C={C}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <span style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>System Status</span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {lastCheck && <span style={{ fontSize:11, color:C.textDim }}>Last checked: {lastCheck}</span>}
          <button onClick={check}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.teal+"60"; e.currentTarget.style.color=C.teal; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {items.map(item => (
          <div key={item.label} style={{ padding:"14px 16px", borderRadius:14, background:C.surface2, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:item.dot || item.color }}/>
              {item.pulse && (
                <div style={{ position:"absolute", inset:-3, borderRadius:"50%", border:`2px solid ${item.dot}`, opacity:0.4, animation:"ping 1.5s ease-in-out infinite" }}/>
              )}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:11, color:C.textMuted, fontWeight:500 }}>{item.label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:item.color, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.6);opacity:0} }`}</style>
    </Panel>
  );
}

function AdminDashboard({ setActive, C }) {
  const [stats,   setStats]   = useState({ students:0, teachers:0, courses:0, departments:0 });
  const [loading, setLoading] = useState(true);
  const redAd = useReducedMotion();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/students`).then(r=>r.json()),
      fetch(`${API}/api/teachers`).then(r=>r.json()),
      fetch(`${API}/api/courses`).then(r=>r.json()),
    ]).then(([students, teachers, courses]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        courses:  Array.isArray(courses)  ? courses.length  : 0,
        departments: 2,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label:"Total Students", field:"students",    sub:"registered",    color:C.teal,   glyph:"grad",  page:"Students" },
    { label:"Total Teachers",  field:"teachers",    sub:"registered",    color:C.gold,   glyph:"users", page:"Teachers" },
    { label:"Total Courses",   field:"courses",     sub:"this semester", color:C.purple, glyph:"book",  page:"Courses"  },
    { label:"Departments",     field:"departments", sub:"active",        color:C.blue,   glyph:"grid" },
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {cards.map((s,i) => (
          <div key={s.label} className="stat-card" onClick={()=>setActive(s.page||"Dashboard")}
            style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:0, position:"relative", overflow:"hidden", animationDelay:`${i*0.08}s`, boxShadow:`${C.cardGlow},${C.cardShadow}`, cursor:s.page?"pointer":"default" }}>
            {/* Top accent bar */}
            <div style={{ height:3, background:`linear-gradient(90deg,${s.color},${s.color}44)`, borderRadius:"18px 18px 0 0" }}/>
            <div style={{ padding:"18px 20px 16px", position:"relative" }}>
              <div style={{ position:"absolute", top:0, right:0, width:90, height:90, background:`radial-gradient(circle at 80% 20%,${s.color}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${s.color}25` }}>
                  <NavGlyph name={s.glyph} color={s.color} />
                </div>
                {s.page && (
                  <div style={{ width:26, height:26, borderRadius:8, background:`${s.color}14`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:mono, fontSize:36, fontWeight:700, lineHeight:1, marginBottom:8, color:s.color }}>
                <AnimatedNumber value={stats[s.field]} decimals={0} reducedMotion={redAd} loading={loading} />
              </div>
              <div style={{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:s.color, opacity:0.7 }}/>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:18, marginBottom:18 }}>
        {/* Department breakdown bar chart */}
        <Panel C={C}>
          <PH title="Platform Overview" C={C}/>
          {loading ? <SkeletonBlock C={C} h={120}/> : (
            <>
              {/* Ratio bar */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textMuted, marginBottom:8 }}>
                  <span>User distribution</span>
                  <span>{stats.students + stats.teachers} total users</span>
                </div>
                <div style={{ height:10, borderRadius:99, overflow:"hidden", background:C.surface3, display:"flex" }}>
                  {stats.students+stats.teachers > 0 && <>
                    <div style={{ width:`${(stats.students/(stats.students+stats.teachers))*100}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.teal}88)`, transition:"width 0.8s ease" }}/>
                    <div style={{ flex:1, height:"100%", background:`linear-gradient(90deg,${C.gold}88,${C.gold})` }}/>
                  </>}
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8 }}>
                  {[[C.teal,"Students",stats.students],[C.gold,"Teachers",stats.teachers]].map(([c,l,n])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textMuted }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
                      {l}: <span style={{ fontWeight:700, color:c }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {[
                  ["Avg per course", stats.courses>0?Math.round(stats.students/stats.courses):0, "students", C.purple],
                  ["Departments",    stats.departments, "active", C.blue],
                  ["Courses",        stats.courses, "total", C.teal],
                ].map(([l,v,sub,c])=>(
                  <div key={l} style={{ padding:"12px 10px", borderRadius:12, background:C.surface2, textAlign:"center" }}>
                    <div style={{ fontFamily:mono, fontSize:22, fontWeight:700, color:c }}>{v}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

        {/* Quick actions + system info */}
        <Panel C={C}>
          <PH title="Quick Actions" C={C}/>
          {[
            { glyph:"grad",  label:"Manage Students", sub:`${stats.students} registered`, color:C.teal,   page:"Students" },
            { glyph:"users", label:"Manage Teachers", sub:`${stats.teachers} registered`, color:C.gold,   page:"Teachers" },
            { glyph:"book",  label:"View Courses",    sub:`${stats.courses} total`,        color:C.purple, page:"Courses"  },
          ].map((a,i) => (
            <div key={i} onClick={()=>setActive(a.page)} className="list-row" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:C.surface2, borderRadius:14, marginBottom:8, cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <NavGlyph name={a.glyph} color={a.color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{a.label}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{a.sub}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          ))}
        </Panel>
      </div>

      {/* System status — live */}
      <LiveSystemStatus C={C} />
    </div>
  );
}

function AdminStudents({ C }) {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name:"", email:"", password:"", department:"", year:"3rd Year", phone:"", usn:"", semester:"Sem 5" });
  const [saving,   setSaving]   = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMsg,  setEditMsg]  = useState("");

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/students`)
      .then(r=>r.json()).then(d=>{ setStudents(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    setDeleting(id);
    await fetch(`${API}/api/students/${id}`, { method:"DELETE" });
    setDeleting(null); load();
  };

  const handleAdd = async () => {
    if (!form.name||!form.email||!form.password||!form.department) return;
    setSaving(true);
    await fetch(`${API}/api/auth/admin/add-student`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    setSaving(false); setShowForm(false);
    setForm({ name:"", email:"", password:"", department:"", year:"3rd Year", phone:"", usn:"", semester:"Sem 5" });
    load();
  };

  const startEdit = (s) => {
    setEditUser(s);
    setEditForm({ name:s.name||"", email:s.email||"", phone:s.phone||"", usn:s.usn||"", department:s.department||"", year:s.year||"3rd Year", semester:s.semester||"Sem 1", newPassword:"" });
    setEditMsg("");
    document.body.style.overflow = "hidden"; const pc = document.getElementById("page-content"); if(pc) pc.style.overflow = "hidden";
  };

  const closeEdit = () => { setEditUser(null); document.body.style.overflow = ""; const pc = document.getElementById("page-content"); if(pc) pc.style.overflow = "auto"; };

  const handleEdit = async () => {
    setSaving(true); setEditMsg("");
    const payload = { name:editForm.name, phone:editForm.phone };
    try {
      const res = await fetch(`${API}/api/students/${editUser.studentId}`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      if (!res.ok) { setSaving(false); setEditMsg("Failed to save."); return; }
      if (editForm.newPassword) {
        await fetch(`${API}/api/students/${editUser.studentId}/reset-password`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ newPassword:editForm.newPassword })
        });
      }
      // Update the student in local state immediately (no re-fetch needed)
      setStudents(prev => prev.map(s =>
        s.studentId === editUser.studentId ? { ...s, ...payload } : s
      ));
      setSaving(false); setEditMsg("Saved!");
      setTimeout(()=>{ closeEdit(); setEditMsg(""); }, 1200);
    } catch { setSaving(false); setEditMsg("Failed to save."); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { width:"100%", padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, fontFamily:body, outline:"none" };
  const labelStyle = { display:"block", fontSize:10, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:5 };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <NavGlyph name="grad" color={C.teal}/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Student Management</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{students.length} student{students.length!==1?"s":""} registered</div>
            </div>
          </div>

        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowForm(!showForm)}
            style={{ padding:"10px 20px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#4ecdc4,#2d9e97)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 16px rgba(78,205,196,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Student
          </button>
        </div>
      </div>
      {/* Import Student Roster */}
      <AdminRosterImport type="students" accentColor={C.teal} accentDim={C.tealDim} load={load} C={C}/>


      {showForm && (
        <Panel C={C}>
          <PH title="New Student" C={C}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","text"],["USN / Reg. No","usn","text"]].map(([l,k,t]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} type={t} style={inputStyle}/>
              </div>
            ))}
            <div>
              <label style={labelStyle}>Department</label>
              <select value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                <option value="">Select</option>
                {["Computer Science and Engineering","Artificial Intelligence and Machine Learning"].map(d=><option key={d} value={d} style={{background:C.surface2}}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <select value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                {["1st Year","2nd Year","3rd Year","4th Year"].map(y=><option key={y} value={y} style={{background:C.surface2}}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Semester</label>
              <select value={form.semester} onChange={e=>setForm(f=>({...f,semester:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                {({"1st Year":["Sem 1","Sem 2"],"2nd Year":["Sem 3","Sem 4"],"3rd Year":["Sem 5","Sem 6"],"4th Year":["Sem 7","Sem 8"]})[form.year]?.map(s=><option key={s} value={s} style={{background:C.surface2}}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleAdd} disabled={saving} style={{ padding:"10px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#4ecdc4,#2d9e97)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>{saving?"Saving…":"Add Student"}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </Panel>
      )}

      {/* Edit modal */}
      {editUser && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }}
          onClick={e=>{ if(e.target===e.currentTarget) closeEdit(); }}>
          <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)", position:"relative" }}>

            {/* Header */}
            <div style={{ padding:"22px 28px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, zIndex:1, borderRadius:"20px 20px 0 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <UserAvatar role="student" id={editUser.studentId} name={editUser.name} size={40} C={C}/>
                <div>
                  <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Edit Student</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{editUser.email}</div>
                </div>
              </div>
              <button onClick={closeEdit}
                style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.roseDim; e.currentTarget.style.color=C.rose; e.currentTarget.style.borderColor=C.rose+"40"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; e.currentTarget.style.borderColor=C.border; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding:"22px 28px" }}>
              {/* Section: Basic Info */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Basic Information</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                {/* Editable: Name */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Full Name</label>
                  <input value={editForm.name||""} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} type="text"
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e=>{ e.target.style.borderColor=C.teal+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.teal}18`; }}
                    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
                </div>
                {/* Read-only: Email */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Email</label>
                  <div style={{ width:"100%", padding:"10px 14px", background:C.surface3||C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMuted, fontFamily:body, cursor:"not-allowed", opacity:0.7 }}>
                    {editForm.email || "—"}
                  </div>
                </div>
                {/* Editable: Phone */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Phone</label>
                  <input value={editForm.phone||""} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} type="text"
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e=>{ e.target.style.borderColor=C.teal+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.teal}18`; }}
                    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
                </div>
                {/* Read-only: USN */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>USN / Reg. No</label>
                  <div style={{ width:"100%", padding:"10px 14px", background:C.surface3||C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMuted, fontFamily:body, cursor:"not-allowed", opacity:0.7 }}>
                    {editForm.usn || "—"}
                  </div>
                </div>
              </div>


              {/* Section: Academic */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Academic Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
                {[["Department", editForm.department], ["Year", editForm.year], ["Semester", editForm.semester]].map(([lbl, val]) => (
                  <div key={lbl}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{lbl}</label>
                    <div style={{ width:"100%", padding:"10px 14px", background:C.surface3||C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMuted, fontFamily:body, cursor:"not-allowed", opacity:0.7 }}>
                      {val || "—"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section: Security */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Security</div>
              <div style={{ padding:"14px 16px", background:C.surface2, borderRadius:12, border:`1px solid ${C.border}`, marginBottom:24 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>New Password <span style={{ color:C.textDim, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(leave blank to keep current)</span></label>
                <input value={editForm.newPassword||""} onChange={e=>setEditForm(f=>({...f,newPassword:e.target.value}))} type="password" placeholder="Enter new password to reset"
                  style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={e=>{ e.target.style.borderColor=C.teal+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.teal}18`; }}
                  onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <button onClick={handleEdit} disabled={saving}
                  style={{ flex:2, padding:"12px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#4ecdc4,#2d9e97)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 20px rgba(78,205,196,0.3)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                  onMouseEnter={e=>{ if(!saving){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(78,205,196,0.4)"; }}}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(78,205,196,0.3)"; }}>
                  {saving ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Saving…</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save Changes</>}
                </button>
                <button onClick={closeEdit}
                  style={{ flex:1, padding:"12px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.text; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}>
                  Cancel
                </button>
                {editMsg && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:editMsg==="Saved!"?C.teal:C.rose, padding:"8px 14px", background:editMsg==="Saved!"?C.tealDim:C.roseDim, borderRadius:99, flexShrink:0 }}>
                    {editMsg==="Saved!"
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    {editMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Panel C={C}>
        {/* Search bar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:11, padding:"10px 16px", marginBottom:18 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or department…"
            style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:13.5, color:C.text, fontFamily:body }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:C.textDim, fontSize:18, lineHeight:1 }}>×</button>}
          <div style={{ fontSize:11, color:C.textDim, fontWeight:500, borderLeft:`1px solid ${C.border}`, paddingLeft:12 }}>{filtered.length} result{filtered.length!==1?"s":""}</div>
        </div>




        {loading ? <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>Loading…</div> :
         filtered.length===0 ? <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>No students found.</div> :
         filtered.map((s,i) => (
          <div key={s.studentId||i} className="list-row"
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, border:`1px solid ${C.border}`, borderRadius:14, marginBottom:8, position:"relative", overflow:"hidden" }}>
            {/* Left accent */}
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${C.teal},${C.teal}44)`, borderRadius:"14px 0 0 14px" }}/>
            <UserAvatar role="student" id={s.studentId} name={s.name} size={40} C={C}/>
            {/* Name + meta */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{s.name}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.email}</div>
            </div>
            {/* USN chip */}
            {s.usn && <div style={{ fontSize:11, padding:"4px 10px", borderRadius:99, background:C.surface3||C.surface2, color:C.textDim, fontWeight:600, border:`1px solid ${C.border}`, whiteSpace:"nowrap", flexShrink:0 }}>{s.usn}</div>}
            {/* Dept */}
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:99, background:C.tealDim, color:C.teal, fontWeight:600, flexShrink:0, whiteSpace:"nowrap" }}>{s.department?.split(" ")[0]}</div>
            {/* Year · Sem */}
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:99, background:C.goldDim, color:C.gold, fontWeight:600, flexShrink:0, whiteSpace:"nowrap" }}>{s.year} · {s.semester}</div>
            {/* Actions */}
            <div style={{ display:"flex", gap:7, flexShrink:0 }}>
              <button onClick={()=>startEdit(s)}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${C.gold}35`, background:C.goldDim, color:C.gold, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer" }}>Edit</button>
              <button onClick={()=>handleDelete(s.studentId)} disabled={deleting===s.studentId}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid rgba(248,113,113,0.25)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", opacity:deleting===s.studentId?0.6:1 }}>
                {deleting===s.studentId ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function AdminTeachers({ C }) {
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name:"", email:"", password:"", department:"", phone:"", employeeId:"" });
  const [saving,   setSaving]   = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMsg,  setEditMsg]  = useState("");

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/teachers`)
      .then(r=>r.json()).then(d=>{ setTeachers(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    setDeleting(id);
    await fetch(`${API}/api/teachers/${id}`, { method:"DELETE" });
    setDeleting(null); load();
  };

  const handleAdd = async () => {
    if (!form.name||!form.email||!form.password||!form.department) return;
    setSaving(true);
    await fetch(`${API}/api/auth/admin/add-teacher`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    setSaving(false); setShowForm(false);
    setForm({ name:"", email:"", password:"", department:"", phone:"", employeeId:"" });
    load();
  };

  const startEdit = (t) => {
    setEditUser(t);
    setEditForm({ name:t.name||"", email:t.email||"", phone:t.phone||"", employeeId:t.employeeId||"", department:t.department||"", newPassword:"" });
    setEditMsg("");
    document.body.style.overflow = "hidden"; const pc = document.getElementById("page-content"); if(pc) pc.style.overflow = "hidden";
  };

  const closeEdit = () => { setEditUser(null); document.body.style.overflow = ""; const pc = document.getElementById("page-content"); if(pc) pc.style.overflow = "auto"; };

  const handleEdit = async () => {
    setSaving(true); setEditMsg("");
    try {
      const tid = editUser?.teacherId;
      if (!tid) { setSaving(false); setEditMsg("Error: no teacher ID"); return; }
      const payload = {
        name: editForm.name,
        phone: editForm.phone || null,
        employeeId: editForm.employeeId || null,
      };
      const res = await fetch(`${API}/api/teachers/${tid}`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSaving(false);
        setEditMsg(data.message || "Failed to save. Check for duplicate email.");
        return;
      }
      if (editForm.newPassword) {
        await fetch(`${API}/api/teachers/${tid}/reset-password`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ newPassword:editForm.newPassword })
        });
      }
      setTeachers(prev => prev.map(t =>
        t.teacherId === tid ? { ...t, ...payload } : t
      ));
      setSaving(false); setEditMsg("Saved!");
      setTimeout(()=>{ closeEdit(); setEditMsg(""); }, 1200);
    } catch(e) {
      setSaving(false); setEditMsg("Error: " + e.message);
    }
  };

  const filtered = teachers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.department?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { width:"100%", padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, fontFamily:body, outline:"none" };
  const labelStyle = { display:"block", fontSize:10, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:5 };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <NavGlyph name="users" color={C.gold}/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Teacher Management</div>
            <div style={{ fontSize:11, color:C.textMuted }}>{teachers.length} teacher{teachers.length!==1?"s":""} registered</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowForm(!showForm)} style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Teacher</button>
        </div>
      </div>
      {/* Import Teacher Roster */}
      <AdminRosterImport type="teachers" accentColor={C.gold} accentDim={C.goldDim} load={load} C={C}/>


      {showForm && (
        <Panel C={C}>
          <PH title="New Teacher" C={C}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","text"],["Employee ID","employeeId","text"]].map(([l,k,t]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} type={t} style={inputStyle}/>
              </div>
            ))}
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Department</label>
              <select value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                <option value="">Select</option>
                {["Computer Science and Engineering","Artificial Intelligence and Machine Learning"].map(d=><option key={d} value={d} style={{background:C.surface2}}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleAdd} disabled={saving} style={{ padding:"10px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>{saving?"Saving…":"Add Teacher"}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </Panel>
      )}

      {/* Edit modal */}
      {editUser && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }}
          onClick={e=>{ if(e.target===e.currentTarget) setEditUser(null); }}>
          <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)" }}>

            {/* Header */}
            <div style={{ padding:"22px 28px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, zIndex:1, borderRadius:"20px 20px 0 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <UserAvatar role="teacher" id={editUser.teacherId} name={editUser.name} size={40} C={C}/>
                <div>
                  <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Edit Teacher</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{editUser.email}</div>
                </div>
              </div>
              <button onClick={()=>setEditUser(null)}
                style={{ width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.roseDim; e.currentTarget.style.color=C.rose; e.currentTarget.style.borderColor=C.rose+"40"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; e.currentTarget.style.borderColor=C.border; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding:"22px 28px" }}>
              {/* Basic Info */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Basic Information</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                {/* Editable: Name */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Full Name</label>
                  <input value={editForm.name||""} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} type="text"
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e=>{ e.target.style.borderColor=C.gold+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.gold}18`; }}
                    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
                </div>
                {/* Read-only: Email */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Email</label>
                  <div style={{ width:"100%", padding:"10px 14px", background:C.surface3||C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMuted, fontFamily:body, cursor:"not-allowed", opacity:0.7 }}>
                    {editForm.email || "—"}
                  </div>
                </div>
                {/* Editable: Phone */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Phone</label>
                  <input value={editForm.phone||""} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} type="text"
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e=>{ e.target.style.borderColor=C.gold+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.gold}18`; }}
                    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
                </div>
                {/* Editable: Employee ID */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Employee ID</label>
                  <input value={editForm.employeeId||""} onChange={e=>setEditForm(f=>({...f,employeeId:e.target.value}))} type="text"
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e=>{ e.target.style.borderColor=C.gold+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.gold}18`; }}
                    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
                </div>
              </div>


              {/* Department */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Academic Details</div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Department</label>
                <div style={{ width:"100%", padding:"10px 14px", background:C.surface3||C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.textMuted, fontFamily:body, cursor:"not-allowed", opacity:0.7 }}>
                  {editForm.department || "—"}
                </div>
              </div>


              {/* Security */}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:12 }}>Security</div>
              <div style={{ padding:"14px 16px", background:C.surface2, borderRadius:12, border:`1px solid ${C.border}`, marginBottom:24 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>New Password <span style={{ color:C.textDim, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(leave blank to keep current)</span></label>
                <input value={editForm.newPassword||""} onChange={e=>setEditForm(f=>({...f,newPassword:e.target.value}))} type="password" placeholder="Enter new password to reset"
                  style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={e=>{ e.target.style.borderColor=C.gold+"80"; e.target.style.boxShadow=`0 0 0 3px ${C.gold}18`; }}
                  onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}/>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <button onClick={handleEdit} disabled={saving}
                  style={{ flex:2, padding:"12px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 20px rgba(232,185,106,0.3)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                  onMouseEnter={e=>{ if(!saving){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(232,185,106,0.4)"; }}}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(232,185,106,0.3)"; }}>
                  {saving ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Saving…</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save Changes</>}
                </button>
                <button onClick={()=>setEditUser(null)}
                  style={{ flex:1, padding:"12px", borderRadius:11, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.text; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}>
                  Cancel
                </button>
                {editMsg && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:editMsg==="Saved!"?C.teal:C.rose, padding:"8px 14px", background:editMsg==="Saved!"?C.tealDim:C.roseDim, borderRadius:99, flexShrink:0 }}>
                    {editMsg==="Saved!"
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    {editMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Panel C={C}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 14px", marginBottom:16 }}>
          <span style={{ color:C.textDim }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or department…"
            style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:13, color:C.text, fontFamily:body }}/>
        </div>
        {loading ? <div style={{ textAlign:"center", padding:32, color:C.textMuted }}>Loading…</div> :
         filtered.length===0 ? <div style={{ textAlign:"center", padding:32, color:C.textMuted }}>No teachers found.</div> :
         filtered.map((t,i) => (
          <div key={t.teacherId||i} className="list-row"
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, border:`1px solid ${C.border}`, borderRadius:14, marginBottom:8, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${C.gold},${C.gold}44)`, borderRadius:"14px 0 0 14px" }}/>
            <UserAvatar role="teacher" id={t.teacherId} name={t.name} size={40} C={C}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{t.name}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{t.email}</div>
            </div>
            {t.employeeId && <div style={{ fontSize:11, padding:"4px 10px", borderRadius:99, background:C.surface3||C.surface2, color:C.textDim, fontWeight:600, border:`1px solid ${C.border}`, whiteSpace:"nowrap", flexShrink:0 }}>ID: {t.employeeId}</div>}
            <div style={{ fontSize:11, padding:"4px 12px", borderRadius:99, background:C.goldDim, color:C.gold, fontWeight:600, flexShrink:0, whiteSpace:"nowrap" }}>{t.department}</div>
            <div style={{ display:"flex", gap:7, flexShrink:0 }}>
              <button onClick={()=>startEdit(t)}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${C.gold}35`, background:C.goldDim, color:C.gold, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer" }}>Edit</button>
              <button onClick={()=>handleDelete(t.teacherId)} disabled={deleting===t.teacherId}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid rgba(248,113,113,0.25)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", opacity:deleting===t.teacherId?0.6:1 }}>
                {deleting===t.teacherId ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function AdminCourses({ C }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [deleting,setDeleting]= useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/courses`)
      .then(r=>r.json()).then(d=>{ setCourses(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    setDeleting(id);
    await fetch(`${API}/api/courses/${id}`, { method:"DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = courses.filter(c =>
    c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    c.teacher?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Panel C={C}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <PH title={`Courses (${courses.length})`} C={C}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 14px", marginBottom:18 }}>
        <NavGlyph name="book" color={C.textDim}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by course name or teacher…"
          style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:13, color:C.text, fontFamily:body }}/>
      </div>
      {loading ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <SkeletonBlock C={C} h={72}/><SkeletonBlock C={C} h={72}/><SkeletonBlock C={C} h={72}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"32px 0", color:C.textMuted }}>
          <div style={{ fontSize:32, marginBottom:10 }}>📖</div>
          <div>No courses found.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {filtered.map((c,i) => {
            const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
            const icon  = COURSE_ICONS[i%COURSE_ICONS.length];
            return (
              <div key={c.courseId||i} className="course-card-glass" style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:16, padding:18, position:"relative", overflow:"hidden", boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
                <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${color}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:`${color}18`, color, fontWeight:600 }}>{c.credits} Cr</span>
                </div>
                <div style={{ fontFamily:font, fontSize:14, fontWeight:600, color:C.text, marginBottom:3 }}>{c.courseName}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>{c.teacher?.name || "—"}</div>
                <button onClick={()=>handleDelete(c.courseId)} disabled={deleting===c.courseId}
                  style={{ width:"100%", padding:"7px", borderRadius:9, border:`1px solid rgba(248,113,113,0.3)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, cursor:"pointer" }}>
                  {deleting===c.courseId ? "Deleting…" : "Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

const PasswordField = ({ label, value, setter, show, setShow, placeholder, C, accentColor, body }) => (
  <div style={{ marginBottom:18 }}>
    <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:8 }}>{label}</label>
    <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surface2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px 14px", transition:"border-color 0.2s, box-shadow 0.2s" }}
      onFocus={e=>{ e.currentTarget.style.borderColor=accentColor+"80"; e.currentTarget.style.boxShadow=`0 0 0 3px ${accentColor}15`; }}
      onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" style={{ flexShrink:0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <input value={value} onChange={e=>setter(e.target.value)} type={show?"text":"password"} placeholder={placeholder}
        style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
      <button type="button" onClick={()=>setShow(!show)}
        style={{ background:"none", border:"none", cursor:"pointer", color:C.textDim, display:"flex", alignItems:"center", padding:0, transition:"color 0.2s", flexShrink:0 }}
        onMouseEnter={e=>e.currentTarget.style.color=accentColor}
        onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
        {show
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  </div>
);

function ChangePasswordModal({ role, user, C, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  const strength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 4 : 3;
  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["",C.rose,C.amber,C.teal,C.gold];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const id  = role === "student" ? user?.studentId : role === "teacher" ? user?.teacherId : user?.adminId;
      
      // Debug logging
      console.log("Password change attempt:", { role, userId: id, apiUrl: `${API}/api/${role}s/${id}/change-password` });
      
      if (!id) {
        setError("User ID not found. Please log out and log back in.");
        return;
      }
      
      const apiUrl = role === "admin"
        ? `${API}/api/auth/change-password/admin`
        : `${API}/api/${role}s/${id}/change-password`;
      const requestBody = role === "admin"
        ? { id, currentPassword, newPassword }
        : { currentPassword, newPassword };
      const res = await fetch(apiUrl, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(requestBody),
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response:", errorText);
        setError(`Server error (${res.status}): ${errorText || "Unknown error"}`);
        return;
      }
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.success) { 
        setSuccess("Password changed successfully!"); 
        setTimeout(()=>onClose(), 1800); 
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch (error) { 
      console.error("Password change error:", error);
      setError("Cannot connect to server. Check if the backend is running.");
    }
    finally { setLoading(false); }
  };

  const accentColor = role === "student" ? C.teal : role === "admin" ? C.purple : C.gold;
  const accentDim   = role === "student" ? C.tealDim : role === "admin" ? C.purpleDim : C.goldDim;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:24, width:"100%", maxWidth:480, boxShadow:`0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`, position:"relative", overflow:"hidden" }}>

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle,${accentColor}14 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle,${accentColor}08 0%,transparent 70%)`, pointerEvents:"none" }}/>

        {/* Header */}
        <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:14, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${accentColor}30`, boxShadow:`0 4px 16px ${accentColor}20` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:font, fontSize:18, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>Change Password</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Keep your account secure</div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width:34, height:34, borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.roseDim; e.currentTarget.style.color=C.rose; e.currentTarget.style.borderColor=C.rose+"40"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; e.currentTarget.style.borderColor=C.border; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding:"24px 28px", position:"relative", zIndex:1 }}>
          <PasswordField label="Current Password"     value={currentPassword} setter={setCurrentPassword} show={showCurrent} setShow={setShowCurrent} placeholder="Enter current password" C={C} accentColor={accentColor} body={body}/>
          <PasswordField label="New Password"         value={newPassword}     setter={setNewPassword}     show={showNew}     setShow={setShowNew}     placeholder="Min 6 characters" C={C} accentColor={accentColor} body={body}/>

          {/* Strength bar */}
          {newPassword.length > 0 && (
            <div style={{ marginTop:-10, marginBottom:18 }}>
              <div style={{ display:"flex", gap:5, marginBottom:6 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<=strength?strengthColor[strength]:C.surface3, transition:"background 0.35s ease" }}/>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:strengthColor[strength], transition:"background 0.35s" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:strengthColor[strength], transition:"color 0.35s" }}>{strengthLabel[strength]} password</span>
              </div>
            </div>
          )}

          <PasswordField label="Confirm New Password" value={confirmPassword} setter={setConfirmPassword} show={showConfirm} setShow={setShowConfirm} placeholder="Re-enter new password" C={C} accentColor={accentColor} body={body}/>

          {/* Match indicator */}
          {confirmPassword.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, marginTop:-10, marginBottom:18, color:newPassword===confirmPassword?C.teal:C.rose }}>
              {newPassword===confirmPassword
                ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Passwords match</>
                : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Passwords don't match</>
              }
            </div>
          )}

          {/* Error / Success */}
          {error   && <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.rose, marginBottom:18, padding:"11px 14px", background:C.roseDim, borderRadius:11, border:`1px solid ${C.rose}30` }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
          {success && <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.teal, marginBottom:18, padding:"11px 14px", background:C.tealDim, borderRadius:11, border:`1px solid ${C.teal}30` }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{success}</div>}

          {/* Actions */}
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:"13px", borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.surface3; e.currentTarget.style.color=C.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textMuted; }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex:2, padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`, color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.8:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 6px 24px ${accentColor}35`, transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
              onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.transform="translateY(-2px) scale(1.01)"; e.currentTarget.style.boxShadow=`0 12px 32px ${accentColor}50`; }}}
              onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 6px 24px ${accentColor}35`; }}>
              {loading
                ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Updating…</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Update Password</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Settings({ role, user, setUser, onLogout, C }) {
  const [showChangePwd,setShowChangePwd]= useState(false);
  const [name,         setName]         = useState(user?.name||"");
  const [phone,        setPhone]        = useState(user?.phone||"");
  const [employeeId,   setEmployeeId]   = useState(user?.employeeId||"");
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");
  const [activeTab,    setActiveTab]    = useState("profile");
  const isStudent = role==="student";
  const isAdmin   = role==="admin";
  const isTeacher = role==="teacher";

  const userId  = role==="student" ? user?.studentId : role==="teacher" ? user?.teacherId : user?.adminId;

  // System settings state (admin only)
  const [activeYear,    setActiveYear]    = useState("2025-26");
  const [activeSem,     setActiveSem]     = useState("Even");
  const [maintenance,   setMaintenance]   = useState(false);
  const [regOpen,       setRegOpen]       = useState(true);

  // Load system settings from server on mount (admin only)
  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API}/api/system/settings`)
      .then(r=>r.json())
      .then(s=>{
        setActiveYear(s.activeYear || "2025-26");
        setActiveSem(s.activeSemester || "Even");
        setMaintenance(s.maintenanceMode || false);
        setRegOpen(s.registrationOpen !== false);
      }).catch(()=>{});
  }, [isAdmin]);

  const saveSystemSettings = async () => {
    try {
      await fetch(`${API}/api/system/settings`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          activeYear,
          activeSemester: activeSem,
          maintenanceMode: maintenance,
          registrationOpen: regOpen,
        })
      });
      setSaveMsg("System settings saved!");
    } catch {
      setSaveMsg("Failed to save settings.");
    }
    setTimeout(()=>setSaveMsg(""), 2500);
  };

  const handleSave = async () => {
    if (isAdmin) {
      // Admin only updates name (no separate admin profile endpoint, update via admin entity)
      setSaving(true);
      try {
        if (setUser) setUser(u => ({ ...u, name }));
        setSaveMsg("Saved successfully!");
      } catch { setSaveMsg("Failed to save."); }
      setSaving(false);
      setTimeout(()=>setSaveMsg(""), 2500);
      return;
    }
    setSaving(true);
    const id  = isStudent ? user?.studentId : user?.teacherId;
    const url = isStudent ? `${API}/api/students/${id}` : `${API}/api/teachers/${id}`;
    const body = isStudent ? { name, phone } : { name, phone, employeeId };
    try {
      const res = await fetch(url, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      if (res.ok) {
        if (setUser) setUser(u => ({ ...u, name, phone, ...(isTeacher ? { employeeId } : {}) }));
        setSaveMsg("Saved successfully!");
      } else {
        setSaveMsg("Failed to save.");
      }
    } catch { setSaveMsg("Failed to save."); }
    setSaving(false);
    setTimeout(()=>setSaveMsg(""), 2500);
  };

  const inputStyle = { width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" };
  const labelStyle = { display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 };

  const accentColor = isStudent ? C.teal : isAdmin ? C.purple : C.gold;
  const accentDim   = isStudent ? C.tealDim : isAdmin ? C.purpleDim : C.goldDim;
  const avatarGrad  = isStudent ? "linear-gradient(135deg,#4ecdc4,#2d9e97)" : isAdmin ? "linear-gradient(135deg,#a78bfa,#7c3aed)" : "linear-gradient(135deg,#e8b96a,#c4973a)";
  const initials    = user?.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : (isStudent?"ST":isAdmin?"AD":"TC");

  const inputSt = { width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:11, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" };
  const labelSt = { display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 };

  const tabs = [
    { id:"profile",  icon:"👤", label:"Profile"  },
    { id:"security", icon:"🔒", label:"Security" },
    ...(isAdmin ? [{ id:"system", icon:"⚙️", label:"System" }] : []),
  ];

  return (
    <div style={{ display:"flex", gap:24 }}>
      {showChangePwd && <ChangePasswordModal role={role} user={user} C={C} onClose={()=>setShowChangePwd(false)}/>}

      <style>{`
        .settings-input:focus { border-color: ${accentColor}80 !important; box-shadow: 0 0 0 3px ${accentColor}18 !important; }
        .settings-tab { transition: all 0.2s ease !important; }
        .settings-tab:hover { background: ${C.surface2} !important; color: ${C.text} !important; }
        .settings-save-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .settings-save-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 28px ${accentColor}40 !important; }
        .settings-save-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .settings-danger-btn { transition: all 0.2s ease !important; }
        .settings-danger-btn:hover { background: ${C.roseDim} !important; border-color: ${C.rose}60 !important; color: ${C.rose} !important; transform: translateY(-1px); }
        @keyframes settingsFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .settings-panel { animation: settingsFadeIn 0.3s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Left sidebar ── */}
      <div style={{ width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {/* Avatar card */}
        <div style={{ padding:"22px 18px", background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, boxShadow:`${C.cardGlow},${C.cardShadow}`, marginBottom:8, textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:`radial-gradient(circle at 90% 10%,${accentColor}14,transparent 70%)`, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, width:80, height:80, background:`radial-gradient(circle at 10% 90%,${accentColor}0a,transparent 70%)`, pointerEvents:"none" }}/>
          {/* Avatar ring */}
          <div style={{ width:80, height:80, borderRadius:"50%", background:avatarGrad, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:26, color:"#0d1117", margin:"0 auto 14px", boxShadow:`0 0 0 4px ${accentColor}25, 0 8px 28px ${accentColor}40` }}>
            {initials}
          </div>
          <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:C.text }}>{user?.name || "User"}</div>
          <div style={{ fontSize:11, color:C.textMuted, marginTop:3, marginBottom:12 }}>{user?.email}</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:99, background:accentDim, border:`1px solid ${accentColor}30`, marginBottom:16 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:accentColor }}/>
            <span style={{ fontSize:11, fontWeight:700, color:accentColor }}>{isStudent?"Student":isAdmin?"Super Admin":"Teacher"}</span>
          </div>
          {/* Quick info chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:6, textAlign:"left" }}>
            {isStudent && user?.usn && <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 12px", background:C.surface3, borderRadius:9, fontSize:11 }}><span style={{ color:C.textMuted }}>USN</span><span style={{ color:C.text, fontWeight:600, fontFamily:mono }}>{user.usn}</span></div>}
            {isStudent && user?.department && <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 12px", background:C.surface3, borderRadius:9, fontSize:11 }}><span style={{ color:C.textMuted }}>Dept</span><span style={{ color:C.text, fontWeight:600 }}>{user.department.replace("Computer Science and Engineering","CSE").replace("Artificial Intelligence and Machine Learning","AIML")}</span></div>}
            {isTeacher && user?.employeeId && <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 12px", background:C.surface3, borderRadius:9, fontSize:11 }}><span style={{ color:C.textMuted }}>EMP ID</span><span style={{ color:C.text, fontWeight:600, fontFamily:mono }}>{user.employeeId}</span></div>}
            {isAdmin && <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 12px", background:C.surface3, borderRadius:9, fontSize:11 }}><span style={{ color:C.textMuted }}>Role</span><span style={{ color:C.text, fontWeight:600 }}>Super Admin</span></div>}
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:14, padding:6, boxShadow:C.cardShadow, marginBottom:2 }}>
        {tabs.map(t => {
          const tabIcons = {
            profile:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            security: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
            system:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
          };
          return (
            <button key={t.id} className="settings-tab" onClick={()=>setActiveTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:9, border:"none", background:activeTab===t.id?accentDim:"transparent", color:activeTab===t.id?accentColor:C.textMuted, fontFamily:body, fontSize:13.5, fontWeight:activeTab===t.id?600:500, cursor:"pointer", textAlign:"left", boxShadow:activeTab===t.id?`0 0 0 1px ${accentColor}25`:"none", position:"relative", width:"100%", transition:"all 0.18s" }}>
              {activeTab===t.id && <div style={{ position:"absolute", left:0, top:"15%", height:"70%", width:3, background:`linear-gradient(180deg,${accentColor},${accentColor}66)`, borderRadius:"0 3px 3px 0" }}/>}
              <div style={{ width:28, height:28, borderRadius:8, background:activeTab===t.id?`${accentColor}20`:C.surface3, display:"flex", alignItems:"center", justifyContent:"center", color:activeTab===t.id?accentColor:C.textDim, flexShrink:0, transition:"all 0.18s" }}>{tabIcons[t.id]}</div>
              {t.label}
            </button>
          );
        })}
        </div>

        {/* Sign out */}
        <button className="settings-danger-btn" onClick={onLogout}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:11, border:`1px solid ${C.rose}25`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left", marginTop:4, width:"100%", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.background=C.rose;e.currentTarget.style.color="#0f172a";}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.roseDim;e.currentTarget.style.color=C.rose;}}>
          <div style={{ width:28, height:28, borderRadius:8, background:`${C.rose}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="3" y2="12"/></svg>
          </div>
          Sign Out
        </button>
      </div>

      {/* ── Right content ── */}
      <div style={{ flex:1, minWidth:0 }}>

        {/* Profile tab */}
        {activeTab==="profile" && (
          <div className="settings-panel" style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:28, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👤</div>
              <div>
                <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Personal Information</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>Update your name and contact details</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={labelSt}>Full Name</label>
                <input className="settings-input" value={name} onChange={e=>setName(e.target.value)} readOnly={isAdmin} style={{...inputSt, opacity:isAdmin?0.6:1, cursor:isAdmin?"not-allowed":"text"}}/>
              </div>
              <div>
                <label style={labelSt}>Email Address</label>
                <input value={user?.email||""} readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/>
              </div>
              {!isAdmin && (
                <div>
                  <label style={labelSt}>Phone Number</label>
                  <input className="settings-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 9876543210" style={inputSt}/>
                </div>
              )}
            </div>
            {isStudent && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
                  {[["Department",user?.department||"—"],["Year",user?.year||"—"],["Semester",user?.semester||"—"]].map(([l,v]) => (
                    <div key={l}><label style={labelSt}>{l}</label><input value={v} readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/></div>
                  ))}
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={labelSt}>USN / Registration No.</label>
                  <input value={user?.usn||"—"} readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/>
                </div>
              </>
            )}
            {isTeacher && (
              <div style={{ marginBottom:16 }}>
                <label style={labelSt}>Department</label>
                <input value={user?.department||"—"} readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/>
              </div>
            )}
            {isAdmin && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div><label style={labelSt}>Admin ID</label><input value={user?.adminId?`ADMIN-${user.adminId}`:"—"} readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/></div>
                <div><label style={labelSt}>Role</label><input value="Super Administrator" readOnly style={{...inputSt, opacity:0.6, cursor:"not-allowed"}}/></div>
              </div>
            )}
            {!isAdmin && (
              <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                <button className="settings-save-btn" onClick={handleSave} disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`, color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:saving?"not-allowed":"pointer", boxShadow:`0 4px 20px ${accentColor}30` }}>
                  {saving ? <><span style={{ width:14, height:14, border:"2px solid #0d1117", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Saving…</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>}
                </button>
                {saveMsg && <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.teal, padding:"8px 14px", background:C.tealDim, borderRadius:99, border:`1px solid ${C.teal}30` }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{saveMsg}</div>}
              </div>
            )}
          </div>
        )}

        {/* Security tab */}
        {activeTab==="security" && (
          <>
          <div className="settings-panel" style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:28, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:C.purpleDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🔒</div>
              <div><div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>Security</div><div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>Manage your password and account security</div></div>
            </div>
            <div style={{ padding:20, background:C.surface2, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:C.purpleDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🔑</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text }}>Password</div>
                    <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Minimum 6 characters required</div>
                  </div>
                </div>
                <button onClick={()=>setShowChangePwd(true)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:10, border:`1px solid ${C.purple}40`, background:C.purpleDim, color:C.purple, fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 6px 20px ${C.purple}30`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Change Password
                </button>
              </div>
            </div>
            <div style={{ padding:16, background:`${accentColor}08`, borderRadius:12, border:`1px solid ${accentColor}20` }}>
              <div style={{ fontSize:12, fontWeight:600, color:accentColor, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Security Tips</div>
              {["Use a strong password with letters, numbers, and symbols","Never share your password or OTP with anyone","Log out from shared or public devices after use"].map((tip,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8, fontSize:13, color:C.textMuted }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" style={{ flexShrink:0, marginTop:1 }}><polyline points="20 6 9 17 4 12"/></svg>
                  {tip}
                </div>
              ))}
            </div>
          </div>
          </>  

        )}

        {/* System tab (Admin only) */}
        {activeTab==="system" && isAdmin && (
          <div className="settings-panel" style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, borderRadius:18, padding:28, boxShadow:`${C.cardGlow},${C.cardShadow}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:C.purpleDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚙️</div>
              <div><div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:C.text }}>System Settings</div><div style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>Platform-wide configuration</div></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <div><label style={labelSt}>Academic Year</label><select value={activeYear} onChange={e=>setActiveYear(e.target.value)} style={{...inputSt, cursor:"pointer"}}>{["2023-24","2024-25","2025-26","2026-27"].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
              <div><label style={labelSt}>Active Semester</label><select value={activeSem} onChange={e=>setActiveSem(e.target.value)} style={{...inputSt, cursor:"pointer"}}><option value="Odd">Odd Semester</option><option value="Even">Even Semester</option></select></div>
            </div>
            {[
              { key:"maintenance", icon:"🔧", label:"Maintenance Mode",     desc:"Disables student & teacher logins", val:maintenance, set:setMaintenance, color:C.rose },
              { key:"reg",         icon:"📋", label:"Allow Registrations",  desc:"Controls whether new students can sign up", val:regOpen, set:setRegOpen, color:C.teal },
            ].map(item => (
              <div key={item.key} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:C.surface2, borderRadius:12, marginBottom:10, cursor:"pointer" }} onClick={()=>item.set(v=>!v)}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${item.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:C.text }}>{item.label}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{item.desc}</div></div>
                <div style={{ width:48, height:26, borderRadius:13, background:item.val?item.color:C.surface3, border:`1px solid ${item.val?item.color:C.border}`, position:"relative", flexShrink:0, transition:"all 0.3s", boxShadow:item.val?`0 2px 10px ${item.color}40`:"none" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"white", position:"absolute", top:3, left:item.val?25:3, transition:"left 0.3s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 1px 6px rgba(0,0,0,0.25)" }}/>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
              <button className="settings-save-btn" onClick={saveSystemSettings}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#a78bfa,#7c3aed)", color:"white", fontFamily:body, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(167,139,250,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                Save Settings
              </button>
              {saveMsg && <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.teal, padding:"8px 14px", background:C.tealDim, borderRadius:99 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{saveMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════
   MAIN DASHBOARD SHELL
══════════════════════════════════════════════ */

function AdminRosterImport({ type, accentColor, accentDim, load, C }) {
  const [file,    setFile]    = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const [drag,    setDrag]    = useState(false);

  const isStudents = type === "students";
  const label      = isStudents ? "Import Student Roster" : "Import Teacher Roster";
  const endpoint   = `${API}/api/bulk/${type}`;
  const template   = isStudents
    ? `name,email,password,department,year,semester,phone,usn\nNaveen Kumar,naveen@college.edu,Test@123,Computer Science and Engineering,3rd Year,Sem 5,9876543210,1VT22CS001\nPriya Sharma,priya@college.edu,Test@123,Artificial Intelligence and Machine Learning,2nd Year,Sem 3,9876543211,1VT23AI002`
    : `name,email,password,department,phone,employeeId\nProf. Ravi Kumar,ravi@college.edu,Test@123,Computer Science and Engineering,9876543210,TCH001\nProf. Anita Rao,anita@college.edu,Test@123,Artificial Intelligence and Machine Learning,9876543211,TCH002`;
  const columns    = isStudents
    ? ["name","email","password","department","year","semester","phone","usn"]
    : ["name","email","password","department","phone","employeeId"];

  const downloadTemplate = () => {
    const blob = new Blob([template], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${type}_template.csv`; a.click();
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true); setResult(null);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch(endpoint, { method:"POST", body:fd });
      const data = await res.json();
      setResult(data);
      if (data.success) load();
    } catch { setResult({ success:false, message:"Cannot connect to server." }); }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) { setFile(f); setResult(null); }
  };

  return (
    <div style={{ marginBottom:14 }}>
      {/* ── Accordion Toggle ── */}
      <button onClick={()=>{ setOpen(o=>!o); setResult(null); }}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px", borderRadius:14,
          border:`1px solid ${open ? accentColor+"50" : C.border}`,
          background: open ? `linear-gradient(135deg,${accentDim},${accentColor}10)` : C.surface2,
          color: open ? accentColor : C.text, fontFamily:body, fontSize:13.5, fontWeight:600,
          cursor:"pointer", transition:"all 0.25s", width:"100%",
          boxShadow: open ? `0 4px 20px ${accentColor}18` : "none" }}>
        {/* Icon */}
        <div style={{ width:34, height:34, borderRadius:10, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${accentColor}25`, flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <span style={{ flex:1, textAlign:"left" }}>{label}</span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background:accentDim, color:accentColor, fontWeight:700, border:`1px solid ${accentColor}20` }}>CSV</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform:open?"rotate(180deg)":"none", transition:"transform 0.25s ease" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ marginTop:10, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`,
          border:`1px solid ${accentColor}25`, borderRadius:18,
          boxShadow:`0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${accentColor}08`, overflow:"hidden" }}>

          {/* ── Panel header ── */}
          <div style={{ padding:"16px 22px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Bulk Import via CSV</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>Upload a CSV file to register multiple {isStudents?"students":"teachers"} at once</div>
            </div>
            <button onClick={downloadTemplate}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:10,
                border:`1px solid ${C.teal}30`, background:C.tealDim, color:C.teal,
                fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.background=C.teal;e.currentTarget.style.color="#0f172a";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.tealDim;e.currentTarget.style.color=C.teal;}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Template
            </button>
          </div>

          <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:16 }}>

            {/* ── Drop Zone ── */}
            <label
              onDragOver={e=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={handleDrop}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:10, padding:"32px 20px", borderRadius:14,
                border:`2px dashed ${file ? accentColor : drag ? accentColor+"80" : C.border}`,
                background: file ? `${accentColor}0a` : drag ? `${accentColor}06` : C.surface2,
                cursor:"pointer", transition:"all 0.25s", position:"relative" }}>

              {/* Upload icon */}
              <div style={{ width:52, height:52, borderRadius:16, background: file ? accentDim : C.surface3,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`1px solid ${file ? accentColor+"40" : C.border}`, transition:"all 0.25s" }}>
                {file
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                }
              </div>

              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:700, color: file ? accentColor : C.text, marginBottom:4 }}>
                  {file ? file.name : drag ? "Drop it here!" : "Drag & drop or click to upload"}
                </div>
                <div style={{ fontSize:12, color:C.textMuted }}>
                  {file ? `${(file.size/1024).toFixed(1)} KB · CSV file ready` : "Only .csv files accepted"}
                </div>
              </div>

              {file && (
                <button onClick={e=>{e.preventDefault();setFile(null);setResult(null);}}
                  style={{ position:"absolute", top:10, right:10, width:26, height:26, borderRadius:8,
                    background:C.roseDim, border:`1px solid ${C.rose}30`, color:C.rose,
                    fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ✕
                </button>
              )}

              <input type="file" accept=".csv" style={{ display:"none" }}
                onChange={e=>{ setFile(e.target.files[0]); setResult(null); }}/>
            </label>

            {/* ── Required columns ── */}
            <div style={{ background:C.surface2, borderRadius:12, padding:"12px 16px", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:10 }}>
                Required CSV Columns
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {columns.map((col,i) => (
                  <span key={i} style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600,
                    background:`${accentColor}12`, color:accentColor, border:`1px solid ${accentColor}25`,
                    fontFamily:mono }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Import button ── */}
            <button onClick={handleImport} disabled={loading || !file}
              style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
                background: !file
                  ? C.surface3
                  : `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                color: !file ? C.textDim : "#0f172a",
                fontFamily:body, fontSize:14, fontWeight:700,
                cursor: !file ? "not-allowed" : "pointer",
                transition:"all 0.25s", opacity:loading?0.8:1,
                boxShadow: file ? `0 6px 24px ${accentColor}35` : "none",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading
                ? <><span style={{ width:16, height:16, border:"2px solid #0f172a", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Importing…</>
                : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Now</>
              }
            </button>

            {/* ── Result banner ── */}
            {result && (
              <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${result.success ? C.teal+"40" : C.rose+"40"}` }}>
                <div style={{ padding:"14px 18px", background: result.success ? C.tealDim : C.roseDim,
                  display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9,
                    background: result.success ? C.teal+"20" : C.rose+"20",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {result.success
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color: result.success ? C.teal : C.rose }}>
                      {result.success ? `${result.imported} ${type} imported successfully` : "Import failed"}
                    </div>
                    {!result.success && <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{result.message}</div>}
                    {result.success && result.errors?.length>0 && (
                      <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{result.errors.length} row{result.errors.length!==1?"s":""} skipped</div>
                    )}
                  </div>
                </div>
                {result.errors?.length>0 && (
                  <div style={{ padding:"10px 18px 14px", background:C.surface, borderTop:`1px solid ${C.rose}20` }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Skipped rows</div>
                    {result.errors.slice(0,5).map((e,i) => (
                      <div key={i} style={{ fontSize:11, color:C.rose, marginBottom:4, display:"flex", alignItems:"flex-start", gap:6 }}>
                        <span style={{ opacity:0.5, flexShrink:0 }}>•</span>{e}
                      </div>
                    ))}
                    {result.errors.length>5 && <div style={{ fontSize:11, color:C.textDim }}>…and {result.errors.length-5} more</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BulkImportPanel({ type, courses, C, selectedCourseId, onCourseChange, onImportSuccess, selectedDate, onDateChange }) {
  const [courseId, setCourseId] = useState("");
  useEffect(() => { 
    if (selectedCourseId) {
      setCourseId(selectedCourseId);
    } else if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].courseId); 
    }
  }, [courses, selectedCourseId]);
  
  const [date,    setDate]    = useState(new Date().toISOString().split("T")[0]);
  
  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate]);
  const [file,    setFile]    = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const isAtt = type === "attendance";
  const accent = isAtt ? C.teal : C.purple;
  const accentDim = isAtt ? C.tealDim : C.purpleDim;
  const icon = isAtt ? "📅" : "📊";
  const label = isAtt ? "Batch Attendance" : "Batch Marks";
  const templateRows = isAtt
    ? "usn,status\n1VT22CS001,Present\n1VT22CS002,Absent\n1VT22CS003,Present"
    : "usn,marks\n1VT22CS001,85\n1VT22CS002,92\n1VT22CS003,78";

  const downloadTemplate = () => {
    const blob = new Blob([templateRows], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `template_${type}.csv`; a.click();
  };

  const handleImport = async () => {
    if (!file || !courseId) return;
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    const url = isAtt
      ? `${API}/api/bulk/attendance?courseId=${courseId}&date=${date}`
      : `${API}/api/bulk/marks?courseId=${courseId}`;
    try {
      const res = await fetch(url, { method:"POST", body:fd });
      const data = await res.json();
      setResult(data);
      if (data.success && onImportSuccess) {
        onImportSuccess(courseId);
      }
    } catch { setResult({ success:false, message:"Cannot connect to server." }); }
    setLoading(false);
  };

  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) { setFile(f); setResult(null); }
  };

  return (
    <div style={{ marginBottom:14 }}>
      {/* ── Toggle button ── */}
      <button onClick={()=>{ setOpen(o=>!o); setResult(null); }}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px", borderRadius:14,
          border:`1px solid ${open ? accent+"50" : C.border}`,
          background: open ? `linear-gradient(135deg,${accentDim},${accent}10)` : C.surface2,
          color: open ? accent : C.text, fontFamily:body, fontSize:13.5, fontWeight:600,
          cursor:"pointer", transition:"all 0.25s", width:"100%",
          boxShadow: open ? `0 4px 20px ${accent}18` : "none" }}>
        <div style={{ width:34, height:34, borderRadius:10, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${accent}25`, flexShrink:0 }}>
          {isAtt
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          }
        </div>
        <span style={{ flex:1, textAlign:"left" }}>{label}</span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background:accentDim, color:accent, fontWeight:700, border:`1px solid ${accent}20` }}>CSV</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform:open?"rotate(180deg)":"none", transition:"transform 0.25s ease" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ marginTop:10, background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`,
          border:`1px solid ${accent}25`, borderRadius:18,
          boxShadow:`0 8px 32px rgba(0,0,0,0.2)`, overflow:"hidden" }}>

          {/* Panel header */}
          <div style={{ padding:"16px 22px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Bulk {isAtt ? "Attendance" : "Marks"} Import</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>
                Upload a CSV to {isAtt ? "record attendance for multiple students" : "enter marks for all students at once"}
              </div>
            </div>
            <button onClick={downloadTemplate}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:10,
                border:`1px solid ${C.teal}30`, background:C.tealDim, color:C.teal,
                fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.background=C.teal;e.currentTarget.style.color="#0f172a";}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.tealDim;e.currentTarget.style.color=C.teal;}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Template
            </button>
          </div>

          <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Course + Date selectors */}
            <div style={{ display:"grid", gridTemplateColumns:isAtt?"1fr 1fr":"1fr", gap:14 }}>
              <div>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:8 }}>Course</label>
                <select value={courseId} onChange={e=>{ setCourseId(e.target.value); if(onCourseChange) onCourseChange(e.target.value); }}
                  style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, fontFamily:body, outline:"none", cursor:"pointer" }}>
                  {courses.map(c => <option key={c.courseId} value={c.courseId} style={{ background:C.surface }}>{c.courseName}</option>)}
                </select>
              </div>
              {isAtt && (
                <div>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:8 }}>Session Date</label>
                  <input type="date" value={date} onChange={e=>{ setDate(e.target.value); if(onDateChange) onDateChange(e.target.value); }}
                    style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, fontFamily:body, outline:"none" }}/>
                </div>
              )}
            </div>

            {/* Drop zone */}
            <label
              onDragOver={e=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={handleDrop}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:10, padding:"28px 20px", borderRadius:14,
                border:`2px dashed ${file ? accent : drag ? accent+"80" : C.border}`,
                background: file ? `${accent}0a` : drag ? `${accent}06` : C.surface2,
                cursor:"pointer", transition:"all 0.25s", position:"relative" }}>
              <div style={{ width:52, height:52, borderRadius:16, background: file ? accentDim : C.surface3,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`1px solid ${file ? accent+"40" : C.border}`, transition:"all 0.25s" }}>
                {file
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                }
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:700, color: file ? accent : C.text, marginBottom:4 }}>
                  {file ? file.name : drag ? "Drop it here!" : "Drag & drop or click to upload"}
                </div>
                <div style={{ fontSize:12, color:C.textMuted }}>
                  {file ? `${(file.size/1024).toFixed(1)} KB · Ready to import` : "Only .csv files accepted"}
                </div>
              </div>
              {file && (
                <button onClick={e=>{e.preventDefault();setFile(null);setResult(null);}}
                  style={{ position:"absolute", top:10, right:10, width:26, height:26, borderRadius:8,
                    background:C.roseDim, border:`1px solid ${C.rose}30`, color:C.rose,
                    fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ✕
                </button>
              )}
              <input type="file" accept=".csv" style={{ display:"none" }} onChange={e=>{ setFile(e.target.files[0]); setResult(null); }}/>
            </label>

            {/* Format hint chips */}
            <div style={{ background:C.surface2, borderRadius:12, padding:"12px 16px", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:10 }}>
                Required CSV Columns
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(isAtt ? ["usn","status (Present / Absent)"] : ["usn","marks (0–100)"]).map((col,i) => (
                  <span key={i} style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600,
                    background:`${accent}12`, color:accent, border:`1px solid ${accent}25`, fontFamily:mono }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Import button */}
            <button onClick={handleImport} disabled={loading || !file || !courseId}
              style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
                background: (!file||!courseId) ? C.surface3 : `linear-gradient(135deg,${accent},${accent}bb)`,
                color: (!file||!courseId) ? C.textDim : "#0f172a",
                fontFamily:body, fontSize:14, fontWeight:700,
                cursor: (!file||!courseId) ? "not-allowed" : "pointer",
                transition:"all 0.25s", opacity:loading?0.8:1,
                boxShadow: (file&&courseId) ? `0 6px 24px ${accent}35` : "none",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading
                ? <><span style={{ width:16, height:16, border:"2px solid #0f172a", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Importing…</>
                : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Now</>
              }
            </button>

            {/* Result banner */}
            {result && (
              <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${result.success ? C.teal+"40" : C.rose+"40"}` }}>
                <div style={{ padding:"14px 18px", background:result.success ? C.tealDim : C.roseDim,
                  display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9,
                    background:result.success ? C.teal+"20" : C.rose+"20",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {result.success
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:result.success ? C.teal : C.rose }}>
                      {result.success ? `${result.imported} records imported successfully` : "Import failed"}
                    </div>
                    {!result.success && <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{result.message}</div>}
                    {result.success && result.errors?.length>0 && <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{result.errors.length} row{result.errors.length!==1?"s":""} skipped</div>}
                  </div>
                </div>
                {result.errors?.length>0 && (
                  <div style={{ padding:"10px 18px 14px", background:C.surface, borderTop:`1px solid ${C.rose}20` }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Skipped rows</div>
                    {result.errors.slice(0,5).map((e,i) => (
                      <div key={i} style={{ fontSize:11, color:C.rose, marginBottom:4, display:"flex", alignItems:"flex-start", gap:6 }}>
                        <span style={{ opacity:0.5, flexShrink:0 }}>•</span>{e}
                      </div>
                    ))}
                    {result.errors.length>5 && <div style={{ fontSize:11, color:C.textDim }}>…and {result.errors.length-5} more</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherMaterials({ user, C }) {
  const [courses,    setCourses]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [materials,  setMaterials]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [formType,   setFormType]   = useState("FILE"); // FILE or LINK
  const [title,      setTitle]      = useState("");
  const [desc,       setDesc]       = useState("");
  const [url,        setUrl]        = useState("");
  const [file,       setFile]       = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState("");

  useEffect(() => {
    if (!user?.teacherId) return;
    fetch(`${API}/api/courses/teacher/${user.teacherId}`).then(r=>r.json())
      .then(d=>{ const c=Array.isArray(d)?d:[]; setCourses(c); if(c.length>0) loadMaterials(c[0]); })
      .catch(()=>{});
  }, [user?.teacherId]);

  const loadMaterials = (course) => {
    setSelected(course); setLoading(true);
    fetch(`${API}/api/materials/course/${course.courseId}`).then(r=>r.json())
      .then(d=>{ setMaterials(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };

  const handleUpload = async () => {
    if (!title || (!file && formType==="FILE") || (!url && formType==="LINK")) return;
    setSaving(true); setMsg("");
    if (formType === "FILE") {
      const fd = new FormData();
      fd.append("courseId", selected.courseId);
      fd.append("teacherId", user.teacherId);
      fd.append("title", title);
      fd.append("description", desc);
      fd.append("file", file);
      const res = await fetch(`${API}/api/materials/upload`, { method:"POST", body:fd });
      const data = await res.json();
      setMsg(data.success ? "✓ Uploaded" : data.message);
    } else {
      const res = await fetch(`${API}/api/materials/link`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ courseId:String(selected.courseId), teacherId:String(user.teacherId), title, description:desc, url })
      });
      const data = await res.json();
      setMsg(data.success ? "✓ Link added" : data.message);
    }
    setSaving(false);
    setTitle(""); setDesc(""); setUrl(""); setFile(null); setShowForm(false);
    loadMaterials(selected);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    await fetch(`${API}/api/materials/${id}`, { method:"DELETE" });
    loadMaterials(selected);
  };

  const inputStyle = { width:"100%", padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, fontFamily:body, outline:"none" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <NavGlyph name="folder" color={C.gold}/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Upload and manage learning resources</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{selected ? `Active course: ${selected.courseName}` : "Select a course to view materials"}</div>
            </div>
          </div>

        </div>
        {selected && (
          <button onClick={()=>setShowForm(!showForm)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,185,106,0.3)", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(232,185,106,0.4)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 16px rgba(232,185,106,0.3)"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Material
          </button>
        )}
      </div>

      {/* Course tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {courses.map((c,i) => {
          const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
          const isSel = selected?.courseId===c.courseId;
          return (
            <button key={c.courseId} onClick={()=>loadMaterials(c)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:12, border:`1.5px solid ${isSel?color:C.border}`, background:isSel?`linear-gradient(135deg,${color}22,${color}0a)`:C.surface2, color:isSel?color:C.textMuted, fontSize:13, fontWeight:isSel?700:500, cursor:"pointer", fontFamily:body, transition:"all 0.2s", boxShadow:isSel?`0 0 0 3px ${color}18, 0 4px 12px ${color}15`:"none" }}>
              <span style={{ fontSize:15 }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</span>
              {c.courseName}
              {isSel && <span style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}` }}/>}
            </button>
          );
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ padding:28, background:`linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)`, border:`1px solid ${C.gold}40`, borderRadius:20, boxShadow:`${C.cardGlow}, ${C.cardShadow}`, marginBottom: 24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <NavGlyph name="folder" color={C.gold}/>
            </div>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>Add Material</div>
          </div>

          {/* Type toggle */}
          <div style={{ display:"flex", gap:8, marginBottom:22, padding:6, background:C.surface2, borderRadius:14 }}>
            {[["FILE","📄 File Upload"],["LINK","🔗 External Link"]].map(([t,label]) => (
              <button key={t} onClick={()=>setFormType(t)}
                style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"none", background:formType===t?"linear-gradient(135deg,#e8b96a,#c4973a)":"transparent", color:formType===t?"#0d1117":C.textMuted, fontFamily:body, fontSize:13, fontWeight:formType===t?700:500, cursor:"pointer", transition:"all 0.25s", boxShadow:formType===t?"0 4px 16px rgba(232,185,106,0.3)":"none" }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:20 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Week 1 Lecture Notes"
                style={{ width:"100%", padding:"12px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.gold}20`; }}
                onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}
              />
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Description (optional)</label>
              <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Brief description…"
                style={{ width:"100%", padding:"12px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.gold}20`; }}
                onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}
              />
            </div>
            {formType==="FILE" ? (
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>File</label>
                <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"32px", borderRadius:16, border:`2px dashed ${file?C.gold:C.border}`, background:file?C.goldDim:`linear-gradient(165deg, ${C.surface} 0%, ${C.surface2} 100%)`, cursor:"pointer", transition:"all 0.2s", boxShadow:file?`0 0 0 4px ${C.gold}15`:"none" }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:file?`${C.gold}30`:C.surface3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:4, transition:"all 0.2s" }}>
                    {file ? "📄" : "☁️"}
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:file?C.gold:C.text }}>{file ? file.name : "Click to upload a file"}</span>
                  <span style={{ fontSize:12, color:C.textMuted }}>{file ? `${(file.size/1024/1024).toFixed(2)} MB` : "PDF, PPTX, DOCX, ZIP files supported"}</span>
                  <input type="file" style={{ display:"none" }} onChange={e=>setFile(e.target.files[0])}/>
                </label>
              </div>
            ) : (
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>URL</label>
                <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…"
                  style={{ width:"100%", padding:"12px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, fontSize:14, color:C.text, fontFamily:body, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                  onFocus={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.gold}20`; }}
                  onBlur={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}
                />
              </div>
            )}
          </div>

          {msg && <div style={{ fontSize:12, color:C.teal, marginBottom:12, padding:"8px 12px", background:C.tealDim, borderRadius:8 }}>{msg}</div>}

          <div style={{ display:"flex", gap:12 }}>
            <button onClick={handleUpload} disabled={saving}
              style={{ padding:"12px 26px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,185,106,0.3)", transition:"all 0.2s", opacity:saving?0.7:1 }}
              onMouseEnter={e=>{ if(!saving){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(232,185,106,0.4)"; } }}
              onMouseLeave={e=>{ if(!saving){ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 16px rgba(232,185,106,0.3)"; } }}
            >
              {saving ? "Saving…" : "Save Material"}
            </button>
            <button onClick={()=>setShowForm(false)}
              style={{ padding:"12px 24px", borderRadius:12, border:`1px solid ${C.border}`, background:C.surface2, color:C.textMuted, fontFamily:body, fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.surface3; e.currentTarget.style.color=C.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.textMuted; }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Materials list */}
      <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden", boxShadow:C.cardShadow }}>
        {/* Panel header */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{selected ? selected.courseName : "Select a course"}</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{materials.length} resource{materials.length!==1?"s":""} available</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:10, background:C.goldDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <NavGlyph name="folder" color={C.gold}/>
          </div>
        </div>
        <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {loading ? (
          <><SkeletonBlock C={C} h={68}/><SkeletonBlock C={C} h={68}/></>
        ) : materials.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:C.textMuted }}>
            <div style={{ fontSize:36, marginBottom:10 }}>📂</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>No materials yet</div>
            <div style={{ fontSize:12 }}>Add your first resource using the button above.</div>
          </div>
        ) : materials.map((m,i) => {
          const isLink = m.type==="LINK";
          const accent = isLink ? C.purple : C.teal;
          const accentDim = isLink ? C.purpleDim : C.tealDim;
          const uploadDate = m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "";
          return (
            <div key={m.materialId} className="list-row"
              style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, borderRadius:14, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden", transition:"box-shadow 0.2s" }}>
              {/* Left accent bar */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${accent},${accent}44)`, borderRadius:"14px 0 0 14px" }}/>
              {/* Icon */}
              <div style={{ width:46, height:46, borderRadius:13, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:`1px solid ${accent}20` }}>
                {isLink ? "🔗" : "📄"}
              </div>
              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</div>
                {m.description && <div style={{ fontSize:12, color:C.textMuted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.description}</div>}
                <div style={{ fontSize:11, color:C.textDim, marginTop:3, display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:accent, opacity:0.6 }}/>
                  {uploadDate}
                </div>
              </div>
              {/* Type badge */}
              <span style={{ fontSize:10, padding:"4px 10px", borderRadius:99, background:accentDim, color:accent, fontWeight:700, border:`1px solid ${accent}22`, flexShrink:0, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                {isLink ? "Link" : "File"}
              </span>
              {/* Action */}
              {isLink
                ? <a href={m.url||m.content} target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${C.purple||"#a78bfa"},#7c3aed)`, color:"white", fontFamily:body, fontSize:12, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Open
                  </a>
                : <a href={`${API}/api/materials/download/${m.materialId}`} target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${C.teal},#2d9e97)`, color:"#0d1117", fontFamily:body, fontSize:12, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </a>
              }
              <button onClick={()=>handleDelete(m.materialId)}
                style={{ width:34, height:34, borderRadius:9, border:`1px solid ${C.rose}22`, background:C.roseDim, color:C.rose, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.rose;e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.roseDim;e.currentTarget.style.color=C.rose;}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

function StudentMaterials({ user, C }) {
  const [courses,   setCourses]   = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    const dept = user?.department;
    const url = dept ? `${API}/api/courses/department/${encodeURIComponent(dept)}` : `${API}/api/courses`;
    fetch(url).then(r=>r.json())
      .then(d=>{ const c=Array.isArray(d)?d:[]; setCourses(c); if(c.length>0) loadMaterials(c[0]); })
      .catch(()=>{});
  }, [user?.department]);

  const loadMaterials = (course) => {
    setSelected(course); setLoading(true);
    fetch(`${API}/api/materials/course/${course.courseId}`).then(r=>r.json())
      .then(d=>{ setMaterials(Array.isArray(d)?d:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <NavGlyph name="layers" color={C.teal}/>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Browse learning resources from your teachers</div>
          <div style={{ fontSize:11, color:C.textMuted }}>{selected ? `Viewing: ${selected.courseName}` : "Select a course to view materials"}</div>
        </div>
      </div>

      </div>

      {/* Course tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {courses.map((c,i) => {
          const color = C[COURSE_COLORS[i%COURSE_COLORS.length]];
          const isSel = selected?.courseId===c.courseId;
          return (
            <button key={c.courseId} onClick={()=>loadMaterials(c)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:11, border:`1.5px solid ${isSel?color:C.border}`, background:isSel?`${color}18`:"transparent", color:isSel?color:C.textMuted, fontSize:13, fontWeight:isSel?700:400, cursor:"pointer", fontFamily:body, transition:"all 0.2s", boxShadow:isSel?`0 0 0 3px ${color}20`:"none" }}>
              <span style={{ fontSize:15 }}>{COURSE_ICONS[i%COURSE_ICONS.length]}</span>
              {c.courseName}
              {isSel && <span style={{ width:6, height:6, borderRadius:"50%", background:color }}/>}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div style={{ background:`linear-gradient(165deg,${C.surface} 0%,${C.surface2} 100%)`, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden", boxShadow:C.cardShadow }}>
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{selected ? selected.courseName : "Select a course"}</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{materials.length} resource{materials.length!==1?"s":""} uploaded by teacher</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:10, background:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <NavGlyph name="layers" color={C.teal}/>
          </div>
        </div>
        <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {loading ? (
          <><SkeletonBlock C={C} h={68}/><SkeletonBlock C={C} h={68}/></>
        ) : materials.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:C.textMuted }}>
            <div style={{ fontSize:36, marginBottom:10 }}>📂</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>No materials yet</div>
            <div style={{ fontSize:12 }}>Your teacher hasn't uploaded any resources for this course.</div>
          </div>
        ) : materials.map((m,i) => {
          const isLink = m.type==="LINK";
          const accent = isLink ? C.purple : C.teal;
          const accentDim = isLink ? C.purpleDim : C.tealDim;
          const uploadDate = m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "";
          return (
            <div key={m.materialId} className="list-row"
              style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, borderRadius:14, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${accent},${accent}44)`, borderRadius:"14px 0 0 14px" }}/>
              <div style={{ width:46, height:46, borderRadius:13, background:accentDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:`1px solid ${accent}20` }}>
                {isLink ? "🔗" : "📄"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</div>
                {m.description && <div style={{ fontSize:12, color:C.textMuted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.description}</div>}
                <div style={{ fontSize:11, color:C.textDim, marginTop:3, display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:accent, opacity:0.6 }}/>
                  {uploadDate}
                </div>
              </div>
              <span style={{ fontSize:10, padding:"4px 10px", borderRadius:99, background:accentDim, color:accent, fontWeight:700, border:`1px solid ${accent}22`, flexShrink:0, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                {isLink ? "Link" : "File"}
              </span>
              {isLink
                ? <a href={m.url||m.content} target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${C.purple||"#a78bfa"},#7c3aed)`, color:"white", fontFamily:body, fontSize:12, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Open
                  </a>
                : <a href={`${API}/api/materials/download/${m.materialId}`} target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:11, border:"none", background:`linear-gradient(135deg,${C.teal},#2d9e97)`, color:"#0d1117", fontFamily:body, fontSize:12, fontWeight:700, textDecoration:"none", flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </a>
              }
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ role="student", user=null, setUser, onLogout }) {
 const { theme: C } = useTheme();

  const isStudent = role==="student";
  const isAdmin   = role==="admin";
  const navItems  = isStudent ? STUDENT_NAV : isAdmin ? ADMIN_NAV : TEACHER_NAV;

  const [active, setActive] = useState("Dashboard");

  const getPage = () => {
    if (isAdmin) {
      switch(active) {
        case "Dashboard": return <AdminDashboard setActive={setActive} C={C}/>;
        case "Students":  return <AdminStudents C={C}/>;
        case "Teachers":  return <AdminTeachers C={C}/>;
        case "Courses":   return <AdminCourses C={C}/>;
        case "Settings":  return <Settings role={role} user={user} setUser={setUser} onLogout={onLogout} C={C}/>;
        default:          return <AdminDashboard setActive={setActive} C={C}/>;
      }
    }
    if (isStudent) {
      switch(active) {
        case "Dashboard":   return <StudentDashboard user={user} setActive={setActive} C={C}/>;
        case "My Courses":  return <StudentCourses user={user} C={C}/>;
        case "Attendance":  return <StudentAttendance user={user} C={C}/>;
        case "Assignments": return <StudentAssignments user={user} C={C}/>;
        case "My Marks":    return <StudentMarks user={user} C={C}/>;
        case "Materials":   return <StudentMaterials user={user} C={C}/>;
        case "Settings":    return <Settings role={role} user={user} setUser={setUser} onLogout={onLogout} C={C}/>;
        default:            return <StudentDashboard user={user} setActive={setActive} C={C}/>;
      }
    }
    switch(active) {
      case "Dashboard":       return <TeacherDashboard user={user} setActive={setActive} C={C}/>;
      case "Manage Courses":  return <TeacherCourses user={user} C={C}/>;
      case "Mark Attendance": return <TeacherAttendance user={user} C={C}/>;
      case "Assignments":     return <TeacherAssignments user={user} C={C}/>;
      case "Enter Marks":       return <TeacherMarks user={user} C={C}/>;
      case "Course Materials": return <TeacherMaterials user={user} C={C}/>;
      case "Settings":         return <Settings role={role} user={user} setUser={setUser} onLogout={onLogout} C={C}/>;
      default:                return <TeacherDashboard user={user} setActive={setActive} C={C}/>;
    }
  };

  const userInitials = user?.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : (isStudent?"AK": isAdmin?"AD":"RS");
  const profilePicUrl = null;
  const userName     = user?.name || (isStudent ? "Student" : isAdmin ? "Admin" : "Teacher");
  const userSub      = isStudent
    ? (user?.department && user?.year ? `${user.department} · ${user.year}` : "CSE · 3rd Year")
    : isAdmin ? "System Administrator"
    : (user?.department || "Computer Science and Engineering");
  const avatarBg = isStudent
    ? "linear-gradient(135deg,#4ecdc4,#2d9e97)"
    : isAdmin ? "linear-gradient(135deg,#a78bfa,#7c3aed)"
    : "linear-gradient(135deg,#e8b96a,#c4973a)";

  const portalColor  = isStudent ? C.teal   : isAdmin ? C.purple : C.gold;
  const portalDim    = isStudent ? C.tealDim: isAdmin ? C.purpleDim : C.goldDim;
  const portalBorder = isStudent ? C.tealDim: isAdmin ? C.purpleDim : C.goldMid;
  const portalIconKey = isStudent ? "grad" : isAdmin ? "grid" : "layers";
  const portalLabel  = isStudent ? "Student Portal" : isAdmin ? "Admin Portal" : "Teacher Portal";
  const badgeLabel   = isStudent ? (user?.semester || user?.year || "Sem") : isAdmin ? "Admin" : "AY 25–26";

  return (
    <>
      <style>{`
        ${FONTS_IMPORT}
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; color:${C.text}; transition: background 0.3s, color 0.3s; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:${C.surface3}; border-radius:6px; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pageIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ringPulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.08); } }
        @keyframes shimmer { 0% { background-position: -120% 0; } 100% { background-position: 120% 0; } }
        @keyframes filterFade { from { opacity:0; } to { opacity:1; } }
        @keyframes barIn { from { transform: scaleX(0.2); opacity:0.5; } to { transform: scaleX(1); opacity:1; } }
        @keyframes rowFlash { 0% { box-shadow: 0 0 0 0 ${C.teal}55; } 100% { box-shadow: 0 0 0 0 transparent; } }
        @keyframes btnPop { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        @keyframes savedPop { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .stat-card { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .page-fade { animation: pageIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-panel-in { animation: slideInRight 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        .att-ring-wrap { animation: ringPulse 2.8s ease-in-out infinite; }
        .skeleton-shimmer {
          background: linear-gradient(90deg, ${C.surface3} 0%, ${C.surface2} 40%, ${C.surface3} 80%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .filter-cross { animation: filterFade 0.35s ease both; }
        .fade-stagger { animation: fadeUp 0.45s ease both; }
        .bar-grow { transform-origin: left center; animation: barIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .course-card-glass:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,0.18) !important; }
        .row-attn-flash { animation: rowFlash 0.55s ease-out; }
        .btn-att-toggle { animation: btnPop 0.45s ease; }
        .grade-saved-pop { animation: savedPop 0.45s ease; }
        .nav-item:hover { background:${C.surface2} !important; color:${C.text} !important; }
        .list-row:hover { box-shadow: 0 0 0 1px ${C.goldMid} !important; transition: box-shadow 0.2s ease, transform 0.2s ease; }
        input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 2px ${C.teal}55; border-color: ${C.teal}99 !important; }
        @media (prefers-reduced-motion: reduce) {
          .stat-card, .page-fade, .slide-panel-in, .filter-cross, .fade-stagger, .bar-grow, .skeleton-shimmer, .att-ring-wrap, .row-attn-flash, .btn-att-toggle, .grade-saved-pop, .course-card-glass:hover {
            animation: none !important; transition: none !important;
          }
          .course-card-glass:hover { transform: none !important; }
        }
      `}</style>

      <div style={{ display:"flex", height:"100vh", fontFamily:body, background:C.bg, color:C.text, overflow:"hidden", transition:"background 0.3s" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:252, background:`linear-gradient(180deg,${C.surface} 0%,${C.surface2} 100%)`, boxShadow:`4px 0 32px rgba(0,0,0,0.18)`, display:"flex", flexDirection:"column", flexShrink:0, position:"relative", overflow:"hidden", transition:"background 0.3s", borderRight:`1px solid ${C.border}` }}>

          {/* Ambient glows */}
          <div style={{ position:"absolute", top:-100, left:-60, width:280, height:280, background:`radial-gradient(circle,${C.gold}14 0%,transparent 65%)`, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-80, right:-60, width:220, height:220, background:`radial-gradient(circle,${C.teal}10 0%,transparent 65%)`, pointerEvents:"none" }}/>
          {/* Dot grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle, ${C.border} 1px, transparent 1px)`, backgroundSize:"20px 20px", pointerEvents:"none" }}/>

          {/* ── Logo header ── */}
          <div style={{ padding:"22px 20px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`linear-gradient(135deg,${C.goldDim},${C.surface2})`, border:`1.5px solid ${C.goldMid}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 18px ${C.gold}22, 0 4px 12px rgba(0,0,0,0.2)` }}>
                <img src={logoSrc} alt="EduTrack" style={{ width:28, height:28, borderRadius:7, objectFit:"cover" }}/>
              </div>
              {/* Online dot */}
              <div style={{ position:"absolute", bottom:-1, right:-1, width:10, height:10, borderRadius:"50%", background:"#22c55e", border:`2px solid ${C.surface}`, boxShadow:"0 0 6px rgba(34,197,94,0.5)" }}/>
            </div>
            <div>
              <div style={{ fontFamily:font, fontSize:17, fontWeight:700, color:C.text, letterSpacing:"-0.02em", lineHeight:1 }}>Edu<span style={{ color:C.gold }}>Track</span></div>
              <div style={{ fontSize:10, color:C.textDim, marginTop:3, fontWeight:500, letterSpacing:"0.04em" }}>Academic Platform</div>
            </div>
          </div>

          {/* ── Portal badge ── */}
          <div style={{ margin:"12px 14px 0", padding:"10px 14px", background:`linear-gradient(135deg,${portalColor}18,${portalColor}06)`, borderRadius:12, border:`1px solid ${portalColor}28`, display:"flex", alignItems:"center", gap:10, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-8, top:-8, width:44, height:44, borderRadius:"50%", background:`${portalColor}12`, pointerEvents:"none" }}/>
            <div style={{ width:28, height:28, borderRadius:8, background:`${portalColor}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <NavGlyph name={portalIconKey} color={portalColor} />
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:portalColor }}>{portalLabel}</div>
              <div style={{ fontSize:10, color:C.textDim, marginTop:1 }}>Active session</div>
            </div>
          </div>

          {/* ── Nav items ── */}
          <div style={{ padding:"8px 12px", flex:1, overflowY:"auto" }}>
            {["Overview", isStudent?"Academic": isAdmin?"Manage":"Manage", "Account"].map(section => {
              const items = navItems.filter(n=>n.section===section);
              if (!items.length) return null;
              return (
                <div key={section}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:C.textMuted, padding:"0 10px", marginBottom:4, marginTop:18 }}>{section}</div>
                  {items.map(n => {
                    const isActive = active === n.label;
                    return (
                      <div key={n.label} className="nav-item" onClick={()=>setActive(n.label)}
                        style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 13px", borderRadius:11, cursor:"pointer", marginBottom:3, fontSize:"14px", fontWeight:isActive?700:500, color:isActive?C.gold:C.text, background:isActive?C.goldDim:"transparent", position:"relative", transition:"all 0.18s", border:`1px solid ${isActive?C.goldMid:"transparent"}` }}>
                        {/* Active left bar */}
                        {isActive && <div style={{ position:"absolute", left:0, top:"20%", height:"60%", width:3, background:`linear-gradient(180deg,${C.gold},${C.goldMid})`, borderRadius:"0 3px 3px 0" }}/>}
                        {/* Icon chip */}
                        <div style={{ width:30, height:30, borderRadius:8, background:isActive?C.goldDim:C.surface2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s", border:`1px solid ${isActive?C.goldMid:C.border}` }}>
                          <NavGlyph name={n.iconKey} color={isActive ? C.gold : C.textDim} />
                        </div>
                        {n.label}
                        {n.badge && <span style={{ marginLeft:"auto", background:C.rose, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>{n.badge}</span>}
                        {isActive && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:C.gold, opacity:0.8 }}/>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* ── User card ── */}
          <div style={{ margin:"10px 12px 14px", padding:"12px 14px", background:`linear-gradient(165deg,${C.surface2} 0%,${C.surface} 100%)`, borderRadius:14, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-12, top:-12, width:56, height:56, borderRadius:"50%", background:`${avatarBg}14`, pointerEvents:"none" }}/>
            <div style={{ width:36, height:36, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#0d1117", flexShrink:0, boxShadow:`0 0 0 2px ${avatarBg}40, 0 4px 12px rgba(0,0,0,0.15)` }}>{userInitials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userName}</div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:1 }}>{userSub}</div>
            </div>
            <button onClick={onLogout} title="Sign out"
              style={{ background:"none", border:"none", cursor:"pointer", color:C.textDim, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:7, transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background=C.roseDim;e.currentTarget.style.color=C.rose;}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.textDim;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </aside>


        {/* ── Main ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 28px", boxShadow:`0 1px 0 ${C.border}, 0 4px 24px rgba(0,0,0,0.25)`, display:"flex", alignItems:"center", justifyContent:"space-between", background:`linear-gradient(180deg, ${C.surface} 0%, ${C.surface2}cc 100%)`, backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", flexShrink:0, transition:"background 0.3s", position:"relative", zIndex:10 }}>
            <div>
              <h1 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>{active}</h1>
              <p style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>
                {isStudent
                  ? `${user?.semester || ""} · ${user?.year || ""} · ${user?.department || "CSE"}`
                  : isAdmin
                  ? `System Administrator · EduTrack Platform`
                  : `Academic Year 2025–26 · ${user?.department || "Computer Science and Engineering"}`}
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <ThemeToggle/>
              <button onClick={onLogout} title="Sign out"
                style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 15px", borderRadius:10, border:`1px solid ${C.rose}30`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.rose;e.currentTarget.style.color="#0f172a";}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.roseDim;e.currentTarget.style.color=C.rose;}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </div>

          <div key={active} id="page-content" className="page-fade"
            style={{ flex:1, overflowY:"auto", padding:"24px 28px", background:C.bg, transition:"background 0.3s", position:"relative" }}>
            {/* Ambient mesh overlay */}
            <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
              background:`radial-gradient(ellipse 55% 40% at 80% 10%, ${C.teal}07 0%, transparent 65%),
                          radial-gradient(ellipse 45% 35% at 10% 90%, ${C.purple}07 0%, transparent 65%)` }}/>
            <div style={{ position:"relative", zIndex:1 }}>
              {getPage()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
