import { useState } from "react";
import { font, body, mono, FONTS_IMPORT } from "./theme";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle.jsx";

/* ═══════════════════════════════════════════════════════
   SDD Section 3.2 – System Modules
   Student Module:  login, view courses, attendance, assignments, marks
   Teacher Module:  login, manage courses, create assignments, mark attendance, enter marks
═══════════════════════════════════════════════════════ */

// ── Nav configs per role ──
const STUDENT_NAV = [
  { icon:"⊞", label:"Dashboard",   section:"Overview" },
  { icon:"📖", label:"My Courses",  section:"Overview" },
  { icon:"📅", label:"Attendance",  section:"Academic" },
  { icon:"📝", label:"Assignments", section:"Academic", badge:3 },
  { icon:"📋", label:"My Marks",    section:"Academic" },
  { icon:"⚙️", label:"Settings",    section:"Account"  },
];

const TEACHER_NAV = [
  { icon:"⊞", label:"Dashboard",       section:"Overview" },
  { icon:"📖", label:"Manage Courses",  section:"Manage"   },
  { icon:"📅", label:"Mark Attendance", section:"Manage"   },
  { icon:"📝", label:"Assignments",     section:"Manage",  badge:2 },
  { icon:"📋", label:"Enter Marks",     section:"Manage"   },
  { icon:"⚙️", label:"Settings",        section:"Account"  },
];

/* ── Static data (no C references here) ── */
const COURSES_DATA = [
  { id:1, icon:"🔬", name:"Data Structures",      credits:4, teacher:"Prof. R. Sharma",  enrolled:62, progress:78, colorKey:"teal"   },
  { id:2, icon:"⚙️", name:"Operating Systems",    credits:3, teacher:"Prof. K. Menon",   enrolled:58, progress:65, colorKey:"gold"   },
  { id:3, icon:"🧮", name:"Discrete Mathematics", credits:4, teacher:"Prof. A. Iyer",    enrolled:70, progress:55, colorKey:"purple" },
  { id:4, icon:"🌐", name:"Computer Networks",    credits:3, teacher:"Dr. S. Nair",      enrolled:55, progress:82, colorKey:"rose"   },
  { id:5, icon:"💾", name:"Database Systems",     credits:3, teacher:"Prof. P. Reddy",   enrolled:48, progress:70, colorKey:"blue"   },
  { id:6, icon:"🖥️", name:"Software Engineering",credits:2, teacher:"Dr. M. Krishnan",  enrolled:65, progress:90, colorKey:"green"  },
];

const ATTENDANCE = [
  { course:"Data Structures",      present:23, total:25, pct:92 },
  { course:"Operating Systems",    present:21, total:25, pct:84 },
  { course:"Discrete Mathematics", present:20, total:25, pct:80 },
  { course:"Computer Networks",    present:18, total:24, pct:74, warn:true },
  { course:"Database Systems",     present:22, total:25, pct:88 },
  { course:"Software Engineering", present:24, total:25, pct:96 },
];

const WEEK_ATT = [
  { day:"MON", present:true,  h:68 },
  { day:"TUE", present:true,  h:56 },
  { day:"WED", present:false, h:20 },
  { day:"THU", present:true,  h:62 },
  { day:"FRI", present:true,  h:50 },
];

const MARKS_DATA = [
  { course:"Data Structures",      icon:"🔬", marks:91, max:100, grade:"O",  colorKey:"teal"   },
  { course:"Operating Systems",    icon:"⚙️", marks:84, max:100, grade:"A+", colorKey:"gold"   },
  { course:"Discrete Mathematics", icon:"🧮", marks:76, max:100, grade:"A",  colorKey:"purple" },
  { course:"Computer Networks",    icon:"🌐", marks:88, max:100, grade:"A+", colorKey:"rose"   },
  { course:"Database Systems",     icon:"💾", marks:79, max:100, grade:"A",  colorKey:"blue"   },
  { course:"Software Engineering", icon:"🖥️", marks:92, max:100, grade:"O",  colorKey:"green"  },
];

const ASSIGNMENTS = [
  { id:1, course_id:1, course:"Data Structures",      title:"Linked List Implementation – Lab 3",     due:"3 days ago", dueDate:"2026-03-13", status:"late",      tag:"Overdue",   marks:null    },
  { id:2, course_id:2, course:"Operating Systems",    title:"Process Scheduling Algorithms – Report", due:"2 days",     dueDate:"2026-03-18", status:"pending",   tag:"Due Soon",  marks:null    },
  { id:3, course_id:3, course:"Discrete Mathematics", title:"Graph Theory Problem Set – Week 8",      due:"5 days",     dueDate:"2026-03-21", status:"pending",   tag:"Due Soon",  marks:null    },
  { id:4, course_id:4, course:"Computer Networks",    title:"OSI Model Presentation Slides",          due:"3 days ago", dueDate:"2026-03-13", status:"submitted", tag:"Submitted", marks:"18/20" },
  { id:5, course_id:1, course:"Data Structures",      title:"Binary Search Tree – Coding Assignment", due:"Last week",  dueDate:"2026-03-09", status:"submitted", tag:"Submitted", marks:"45/50" },
  { id:6, course_id:5, course:"Database Systems",     title:"ER Diagram for Library System",          due:"2 weeks ago",dueDate:"2026-03-02", status:"submitted", tag:"Submitted", marks:"38/40" },
  { id:7, course_id:6, course:"Software Engineering", title:"Software Requirement Specification",     due:"1 week",     dueDate:"2026-03-23", status:"pending",   tag:"Due Soon",  marks:null    },
];

const STUDENTS = [
  { id:"21CS001", name:"Arjun Kumar",  dept:"CSE", year:"3rd Year", attendance:89 },
  { id:"21CS002", name:"Priya Sharma", dept:"CSE", year:"3rd Year", attendance:94 },
  { id:"21CS003", name:"Ravi Teja",    dept:"CSE", year:"3rd Year", attendance:72, warn:true },
  { id:"21CS004", name:"Sneha Reddy",  dept:"CSE", year:"3rd Year", attendance:85 },
  { id:"21CS005", name:"Kiran Menon",  dept:"CSE", year:"3rd Year", attendance:91 },
  { id:"21CS006", name:"Divya Iyer",   dept:"CSE", year:"3rd Year", attendance:68, warn:true },
];

/* ── Helper functions that accept C ── */
const tagStyle = (t, C) =>
  t==="Overdue"  ? { background:C.roseDim, color:C.rose } :
  t==="Due Soon" ? { background:C.goldDim, color:C.gold } :
                   { background:C.tealDim, color:C.teal };

const statusDot = (s, C) =>
  s==="late"    ? { background:C.rose, boxShadow:`0 0 6px ${C.rose}` } :
  s==="pending" ? { background:C.gold, boxShadow:`0 0 6px ${C.gold}` } :
                  { background:C.teal };

/* ── Reusable Panel — accepts C as prop ── */
const Panel = ({ children, style={}, C }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, ...style }}>{children}</div>
);

const PH = ({ title, link, C }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
    <span style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>{title}</span>
    {link && <span style={{ fontSize:12, color:C.gold, cursor:"pointer" }}>{link} →</span>}
  </div>
);

/* ══════════════════════════════════════════════
   STUDENT PAGES — all accept C as prop
══════════════════════════════════════════════ */

function StudentDashboard({ C }) {
  const MARKS   = MARKS_DATA.map(m   => ({ ...m, color: C[m.colorKey] }));

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"CGPA",       value:"8.6", sub:"out of 10.0",   change:"↑ +0.3",      up:true,  color:C.gold   },
          { label:"Attendance", value:"89%", sub:"47/53 classes", change:"↑ Above min", up:true,  color:C.teal   },
          { label:"Pending",    value:"3",   sub:"assignments",   change:"↓ 1 overdue", up:false, color:C.rose   },
          { label:"Courses",    value:"6",   sub:"this semester", change:"↑ On track",  up:true,  color:C.purple },
        ].map((s,i) => (
          <div key={i} className="stat-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden", animationDelay:`${i*0.08}s` }}>
            <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${s.color}22 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>{s.label}</div>
            <div style={{ fontFamily:font, fontSize:32, fontWeight:700, lineHeight:1, marginBottom:8, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{s.sub}</div>
            <div style={{ display:"inline-flex", fontSize:11, fontWeight:500, padding:"2px 7px", borderRadius:20, marginTop:6, background:s.up?C.tealDim:C.roseDim, color:s.up?C.teal:C.rose }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:16, marginBottom:24 }}>
        <Panel C={C}>
          <PH title="Recent Marks" link="View All" C={C}/>
          {MARKS.slice(0,4).map((m,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, marginBottom:8, cursor:"default" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${m.color}18`, color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{m.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:500, color:C.text }}>{m.course}</div></div>
              <div style={{ width:80, height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
                <div style={{ width:`${m.marks}%`, height:"100%", background:m.color }}/>
              </div>
              <div style={{ fontFamily:mono, fontSize:13, color:m.color, minWidth:32, textAlign:"right" }}>{m.marks}</div>
              <div style={{ width:30, height:30, borderRadius:8, background:`${m.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:12, fontWeight:700, color:m.color }}>{m.grade}</div>
            </div>
          ))}
        </Panel>

        <Panel C={C}>
          <PH title="Attendance" link="Details" C={C}/>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80, marginBottom:12 }}>
            {WEEK_ATT.map((d,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
                <div style={{ width:"100%", height:d.h, borderRadius:"4px 4px 0 0", background:d.present?`linear-gradient(to top,${C.teal},${C.teal}80)`:`linear-gradient(to top,${C.rose},${C.rose}80)` }}/>
                <span style={{ fontSize:10, color:C.textDim, fontFamily:mono }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {[["47",C.teal,"Present"],["6",C.rose,"Absent"],["89%",C.gold,"Rate"]].map(([v,c,l]) => (
              <div key={l} style={{ flex:1, textAlign:"center", padding:"9px 6px", borderRadius:9, border:`1px solid ${C.border}`, background:C.surface2 }}>
                <div style={{ fontFamily:font, fontSize:18, fontWeight:600, color:c }}>{v}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel C={C}>
        <PH title="Pending Assignments" link="View All" C={C}/>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {ASSIGNMENTS.filter(a=>a.status!=="submitted").map((a,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
              <div style={{ width:9, height:9, borderRadius:"50%", flexShrink:0, ...statusDot(a.status,C) }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{a.course}</div>
              </div>
              <div style={{ fontSize:12, color:C.textMuted }}>Due: {a.due}</div>
              <div style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, ...tagStyle(a.tag,C) }}>{a.tag}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StudentCourses({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
      {COURSES.map((c,i) => (
        <div key={i} className="list-row" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden", cursor:"default" }}>
          <div style={{ position:"absolute", top:0, right:0, width:100, height:100, background:`radial-gradient(circle at 80% 20%,${c.color}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${c.color}18`, color:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{c.icon}</div>
            <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:`${c.color}15`, color:c.color }}>{c.credits} Cr</span>
          </div>
          <div style={{ fontFamily:font, fontSize:15, fontWeight:600, marginBottom:4, color:C.text }}>{c.name}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>{c.teacher}</div>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:11, color:C.textMuted }}>Progress</span>
              <span style={{ fontSize:11, fontFamily:mono, color:c.color }}>{c.progress}%</span>
            </div>
            <div style={{ height:5, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${c.progress}%`, height:"100%", background:c.color, borderRadius:3 }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentAttendance({ C }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[["47","Present",C.teal],["6","Absent",C.rose],["89%","Overall",C.gold]].map(([v,l,c]) => (
          <Panel key={l} C={C}>
            <div style={{ fontFamily:font, fontSize:36, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:13, color:C.textMuted, marginTop:6 }}>{l}</div>
          </Panel>
        ))}
      </div>
      <Panel C={C}>
        <PH title="Attendance by Course" C={C}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ATTENDANCE.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${a.warn?"rgba(248,113,113,0.25)":C.border}` }}>
              <div style={{ flex:1, fontSize:13.5, fontWeight:500, color:C.text }}>{a.course}</div>
              <span style={{ fontSize:12, color:C.textMuted, fontFamily:mono }}>{a.present}/{a.total} classes</span>
              <div style={{ width:120, height:5, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${a.pct}%`, height:"100%", background:a.pct<80?C.rose:a.pct>=90?C.teal:C.gold, borderRadius:3 }}/>
              </div>
              <span style={{ fontFamily:mono, fontSize:13, color:a.pct<80?C.rose:a.pct>=90?C.teal:C.gold, width:40, textAlign:"right" }}>{a.pct}%</span>
              {a.warn && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:C.roseDim, color:C.rose }}>⚠ Low</span>}
            </div>
          ))}
        </div>
      </Panel>
      <Panel C={C}>
        <PH title="This Week" C={C}/>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:90, marginBottom:12 }}>
          {WEEK_ATT.map((d,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
              <div style={{ width:"100%", height:d.h, borderRadius:"4px 4px 0 0", background:d.present?`linear-gradient(to top,${C.teal},${C.teal}80)`:`linear-gradient(to top,${C.rose},${C.rose}80)` }}/>
              <span style={{ fontSize:11, color:C.textDim, fontFamily:mono }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:14 }}>
          {[[C.teal,"Present"],[C.rose,"Absent"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textMuted }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>{l}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StudentAssignments({ C }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter==="All" ? ASSIGNMENTS
    : filter==="Pending"   ? ASSIGNMENTS.filter(a=>a.status==="pending")
    : filter==="Submitted" ? ASSIGNMENTS.filter(a=>a.status==="submitted")
    :                        ASSIGNMENTS.filter(a=>a.status==="late");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[["3","Pending",C.gold],["1","Overdue",C.rose],["3","Submitted",C.teal],["7","Total",C.purple]].map(([v,l,c]) => (
          <Panel key={l} C={C}>
            <div style={{ fontFamily:font, fontSize:32, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>{l}</div>
          </Panel>
        ))}
      </div>
      <Panel C={C}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontFamily:font, fontSize:15, fontWeight:600, color:C.text }}>All Assignments</span>
          <div style={{ display:"flex", gap:6 }}>
            {["All","Pending","Submitted","Overdue"].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                style={{ padding:"5px 12px", borderRadius:8, border:`1px solid ${filter===f?C.goldMid:C.border}`, background:filter===f?C.goldDim:"transparent", color:filter===f?C.gold:C.textMuted, fontSize:12, fontWeight:filter===f?600:400, cursor:"pointer", fontFamily:body }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((a,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
              <div style={{ width:9, height:9, borderRadius:"50%", flexShrink:0, marginTop:5, ...statusDot(a.status,C) }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{a.course} &nbsp;·&nbsp; Due: {a.due}</div>
              </div>
              {a.marks && <div style={{ fontSize:12, fontFamily:mono, color:C.teal, background:C.tealDim, padding:"3px 9px", borderRadius:20 }}>{a.marks}</div>}
              <div style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, flexShrink:0, ...tagStyle(a.tag,C) }}>{a.tag}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StudentMarks({ C }) {
  const MARKS = MARKS_DATA.map(m => ({ ...m, color: C[m.colorKey] }));
  const total = MARKS.reduce((s,m)=>s+m.marks,0);
  const avg   = Math.round(total/MARKS.length);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[["8.6","CGPA",C.gold],[avg+"%","Average Score",C.teal],["A+","Overall Grade",C.purple]].map(([v,l,c]) => (
          <Panel key={l} C={C}>
            <div style={{ fontFamily:font, fontSize:36, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:13, color:C.textMuted, marginTop:6 }}>{l}</div>
          </Panel>
        ))}
      </div>
      <Panel C={C}>
        <PH title="Marks per Course" C={C}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {MARKS.map((m,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${m.color}18`, color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{m.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{m.course}</div></div>
              <div style={{ width:100, height:5, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${m.marks}%`, height:"100%", background:m.color }}/>
              </div>
              <div style={{ fontFamily:mono, fontSize:14, color:m.color, minWidth:38, textAlign:"right" }}>{m.marks}/{m.max}</div>
              <div style={{ width:36, height:36, borderRadius:9, background:`${m.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:14, fontWeight:700, color:m.color }}>{m.grade}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEACHER PAGES
══════════════════════════════════════════════ */

function TeacherDashboard({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"My Courses",      value:"6",   sub:"this semester",  color:C.gold   },
          { label:"Total Students",  value:"358", sub:"across courses", color:C.teal   },
          { label:"Assignments",     value:"12",  sub:"created",        color:C.purple },
          { label:"Pending Reviews", value:"2",   sub:"assignments",    color:C.rose   },
        ].map((s,i) => (
          <div key={i} className="stat-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden", animationDelay:`${i*0.08}s` }}>
            <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 80% 20%,${s.color}22 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>{s.label}</div>
            <div style={{ fontFamily:font, fontSize:32, fontWeight:700, lineHeight:1, marginBottom:8, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <Panel C={C}>
          <PH title="My Courses" link="Manage" C={C}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {COURSES.slice(0,4).map((c,i) => (
              <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${c.color}18`, color:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{c.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{c.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{c.enrolled} students · {c.credits} credits</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel C={C}>
          <PH title="Low Attendance Alert" C={C}/>
          <div style={{ marginBottom:12, padding:"10px 14px", background:C.roseDim, border:`1px solid rgba(248,113,113,0.2)`, borderRadius:9 }}>
            <div style={{ fontSize:12.5, color:C.rose }}>⚠️ {STUDENTS.filter(s=>s.warn).length} students below 75% attendance</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {STUDENTS.filter(s=>s.warn).map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:9, background:C.surface2, border:`1px solid rgba(248,113,113,0.2)` }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:C.roseDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.rose }}>{s.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{s.id}</div>
                </div>
                <span style={{ fontFamily:mono, fontSize:13, color:C.rose }}>{s.attendance}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel C={C}>
        <PH title="Recent Assignments" link="Manage" C={C}/>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {ASSIGNMENTS.slice(0,4).map((a,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{a.course} &nbsp;·&nbsp; Due: {a.dueDate}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, ...tagStyle(a.tag,C) }}>{a.tag}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function TeacherCourses({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name:"", credits:"" });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:font, fontSize:18, fontWeight:600, color:C.text }}>Course Management</div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>
          + Add Course
        </button>
      </div>
      {showForm && (
        <Panel C={C}>
          <PH title="New Course" C={C}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["Course Name","name","e.g. Data Structures"],["Credits","credits","e.g. 4"]].map(([l,k,p]) => (
              <div key={k}>
                <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
                <input value={newCourse[k]} onChange={e=>setNewCourse(n=>({...n,[k]:e.target.value}))} placeholder={p}
                  style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" }}/>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>Save Course</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </Panel>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {COURSES.map((c,i) => (
          <div key={i} className="list-row" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:100, height:100, background:`radial-gradient(circle at 80% 20%,${c.color}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:11, background:`${c.color}18`, color:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{c.icon}</div>
              <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:`${c.color}15`, color:c.color }}>{c.credits} Cr</span>
            </div>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:600, marginBottom:4, color:C.text }}>{c.name}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:4 }}>{c.enrolled} students enrolled</div>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button style={{ flex:1, padding:"7px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:12, cursor:"pointer" }}>Edit</button>
              <button style={{ flex:1, padding:"7px", borderRadius:8, border:`1px solid rgba(248,113,113,0.3)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, cursor:"pointer" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherAttendance({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  const [selected, setSelected] = useState(COURSES[0].name);
  const [attMap,   setAttMap]   = useState({});
  const [saved,    setSaved]    = useState(false);

  const toggle = (id) => { setAttMap(m => ({ ...m, [id]: m[id]==="absent"?"present":"absent" })); setSaved(false); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Panel C={C}>
        <PH title="Mark Attendance" C={C}/>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Select Course</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {COURSES.map(c => (
              <button key={c.name} onClick={()=>setSelected(c.name)}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${selected===c.name?C.goldMid:C.border}`, background:selected===c.name?C.goldDim:"transparent", color:selected===c.name?C.gold:C.textMuted, fontSize:13, cursor:"pointer", fontFamily:body, transition:"all 0.2s" }}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:13, color:C.textMuted }}>Today: {new Date().toDateString()}</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ const m={}; STUDENTS.forEach(s=>m[s.id]="present"); setAttMap(m); setSaved(false); }}
              style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${C.tealDim}`, background:C.tealDim, color:C.teal, fontFamily:body, fontSize:12, cursor:"pointer" }}>Mark All Present</button>
            <button onClick={()=>setSaved(true)}
              style={{ padding:"6px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {saved ? "✓ Saved" : "Save Attendance"}
            </button>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {STUDENTS.map((s,i) => {
            const status = attMap[s.id] || "present";
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${status==="absent"?"rgba(248,113,113,0.25)":C.border}` }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:status==="absent"?C.roseDim:C.tealDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:status==="absent"?C.rose:C.teal }}>{s.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{s.id} &nbsp;·&nbsp; {s.year}</div>
                </div>
                <button onClick={()=>toggle(s.id)}
                  style={{ padding:"6px 16px", borderRadius:20, border:"none", background:status==="absent"?C.roseDim:C.tealDim, color:status==="absent"?C.rose:C.teal, fontFamily:body, fontSize:12, fontWeight:600, cursor:"pointer", minWidth:80, transition:"all 0.2s" }}>
                  {status==="absent" ? "Absent" : "Present"}
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function TeacherAssignments({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", course:"", dueDate:"", description:"" });
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:font, fontSize:18, fontWeight:600, color:C.text }}>Assignment Management</div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>
          + Create Assignment
        </button>
      </div>
      {showForm && (
        <Panel C={C}>
          <PH title="New Assignment" C={C}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["Title","title","e.g. Lab Assignment 4"],["Due Date","dueDate",""]].map(([l,k,p]) => (
              <div key={k}>
                <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
                <input value={form[k]} onChange={e=>s(k,e.target.value)} placeholder={p} type={k==="dueDate"?"date":"text"}
                  style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" }}/>
              </div>
            ))}
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Course</label>
              <select value={form.course} onChange={e=>s("course",e.target.value)}
                style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:form.course?C.text:C.textMuted, fontFamily:body, outline:"none", cursor:"pointer" }}>
                <option value="">Select course</option>
                {COURSES.map(c=><option key={c.name} value={c.name} style={{ background:C.surface2 }}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Description</label>
              <textarea value={form.description} onChange={e=>s("description",e.target.value)} placeholder="Assignment instructions..."
                rows={3} style={{ width:"100%", padding:"10px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none", resize:"vertical" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>Publish Assignment</button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </Panel>
      )}
      <Panel C={C}>
        <PH title="All Assignments" C={C}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ASSIGNMENTS.map((a,i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, cursor:"default" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{a.course} &nbsp;·&nbsp; Due: {a.dueDate}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, ...tagStyle(a.tag,C) }}>{a.tag}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ padding:"5px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:12, cursor:"pointer" }}>Edit</button>
                <button style={{ padding:"5px 12px", borderRadius:8, border:`1px solid rgba(248,113,113,0.3)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:12, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function TeacherMarks({ C }) {
  const COURSES = COURSES_DATA.map(c => ({ ...c, color: C[c.colorKey] }));
  const [selected, setSelected] = useState(COURSES[0].name);
  const [marksMap, setMarksMap] = useState({});
  const [saved, setSaved] = useState(false);
  const setMark = (id, val) => { setMarksMap(m=>({...m,[id]:val})); setSaved(false); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Panel C={C}>
        <PH title="Enter Student Marks" C={C}/>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:8 }}>Select Course</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {COURSES.map(c => (
              <button key={c.name} onClick={()=>setSelected(c.name)}
                style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${selected===c.name?C.goldMid:C.border}`, background:selected===c.name?C.goldDim:"transparent", color:selected===c.name?C.gold:C.textMuted, fontSize:13, cursor:"pointer", fontFamily:body, transition:"all 0.2s" }}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
          <button onClick={()=>setSaved(true)}
            style={{ padding:"8px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            {saved ? "✓ Marks Saved" : "Save All Marks"}
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                {["Student ID","Name","Marks (out of 100)","Grade"].map(h => (
                  <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, padding:"0 20px 14px 0", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s,i) => {
                const m = parseInt(marksMap[s.id]) || 0;
                const grade = m>=90?"O":m>=80?"A+":m>=70?"A":m>=60?"B+":"B";
                const gc = m>=90?C.gold:m>=80?C.teal:m>=70?C.purple:C.textMuted;
                return (
                  <tr key={i}>
                    <td style={{ padding:"12px 20px 12px 0", borderBottom:`1px solid ${C.border}`, fontSize:12, fontFamily:mono, color:C.textMuted }}>{s.id}</td>
                    <td style={{ padding:"12px 20px 12px 0", borderBottom:`1px solid ${C.border}`, fontSize:13, fontWeight:500, color:C.text }}>{s.name}</td>
                    <td style={{ padding:"12px 20px 12px 0", borderBottom:`1px solid ${C.border}` }}>
                      <input type="number" min="0" max="100" value={marksMap[s.id]||""} onChange={e=>setMark(s.id,e.target.value)} placeholder="0–100"
                        style={{ width:90, padding:"7px 10px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.text, fontFamily:mono, outline:"none" }}/>
                    </td>
                    <td style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                      {m > 0 && <span style={{ fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:20, background:`${gc}18`, color:gc }}>{grade}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function ChangePasswordModal({ role, user, C, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match."); return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters."); return;
    }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/auth/change-password/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: role === "student" ? user?.studentId : user?.teacherId,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Password changed successfully!");
        setTimeout(() => onClose(), 1800);
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" };
  const rowStyle   = { display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"11px 14px" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:28, width:420, maxWidth:"90vw", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ fontFamily:font, fontSize:17, fontWeight:600, color:C.text }}>Change Password</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.textDim, lineHeight:1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            ["Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent],
            ["New Password",     newPassword,     setNewPassword,     showNew,     setShowNew],
            ["Confirm New Password", confirmPassword, setConfirmPassword, showNew, setShowNew],
          ].map(([label, val, setter, show, setShow], i) => (
            <div key={label} style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{label}</label>
              <div style={rowStyle}>
                <input value={val} onChange={e=>setter(e.target.value)} type={show?"text":"password"} placeholder={`Enter ${label.toLowerCase()}`}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:C.text, fontFamily:body }}/>
                {i < 2 && (
                  <button type="button" onClick={()=>setShow(!show)}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, fontFamily:body }}>{show?"Hide":"Show"}</button>
                )}
              </div>
            </div>
          ))}

          {error   && <div style={{ fontSize:13, color:C.rose,  marginBottom:14, padding:"9px 12px", background:C.roseDim,  borderRadius:8 }}>⚠ {error}</div>}
          {success && <div style={{ fontSize:13, color:C.teal,  marginBottom:14, padding:"9px 12px", background:C.tealDim,  borderRadius:8 }}>✓ {success}</div>}

          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:"11px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:14, cursor:"pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:600, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
              {loading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Settings({ role, user, onLogout, C }) {
  const [notif, setNotif] = useState({ marks:true, attendance:true, assignments:true });
  const [showChangePwd, setShowChangePwd] = useState(false);
  const isStudent = role==="student";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:660 }}>
      {showChangePwd && <ChangePasswordModal role={role} user={user} C={C} onClose={()=>setShowChangePwd(false)}/>}
      <Panel C={C}>
        <PH title="Profile" C={C}/>
        <div style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 16px", background:C.surface2, borderRadius:11, border:`1px solid ${C.border}`, marginBottom:18 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${isStudent?"#4ecdc4,#2d9e97":"#e8b96a,#c4973a"})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:18, color:"#0d1117" }}>
            {user?.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : (isStudent?"AK":"RS")}
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{user?.name || (isStudent?"Student":"Teacher")}</div>
            <div style={{ fontSize:13, color:C.textMuted }}>{user?.email || ""}</div>
            <div style={{ fontSize:11, background:isStudent?C.tealDim:C.goldDim, color:isStudent?C.teal:C.gold, padding:"2px 9px", borderRadius:20, display:"inline-block", marginTop:5 }}>
              {isStudent ? `Student · ${user?.department||"CSE"} · ${user?.year||""}` : `Teacher · ${user?.department||"Computer Science"}`}
            </div>
          </div>
        </div>
        {[["Full Name","text",user?.name||""],["Email","email",user?.email||""],["Department","text",user?.department||""]].map(([l,t,v]) => (
          <div key={l} style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>{l}</label>
            <input defaultValue={v} type={t} style={{ width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" }}/>
          </div>
        ))}
        {isStudent && (
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textDim, marginBottom:7 }}>Year</label>
            <input defaultValue={user?.year||""} style={{ width:"100%", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, fontFamily:body, outline:"none" }}/>
          </div>
        )}
        <button style={{ padding:"11px 22px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:14, fontWeight:600, cursor:"pointer" }}>Save Changes</button>
      </Panel>

      <Panel C={C}>
        <PH title="Notifications" C={C}/>
        {[["marks","Marks & Grades"],["attendance","Attendance Alerts"],["assignments","Assignment Reminders"]].map(([k,l]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{l}</div>
            <div onClick={()=>setNotif(n=>({...n,[k]:!n[k]}))} style={{ width:44, height:24, borderRadius:12, background:notif[k]?C.gold:C.surface2, border:`1px solid ${notif[k]?C.goldMid:C.border}`, position:"relative", cursor:"pointer", transition:"all 0.3s" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute", top:3, left:notif[k]?23:3, transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
            </div>
          </div>
        ))}
      </Panel>

      <Panel C={C}>
        <PH title="Account" C={C}/>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setShowChangePwd(true)} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.textMuted, fontFamily:body, fontSize:13, cursor:"pointer" }}>Change Password</button>
          <button onClick={onLogout} style={{ padding:"10px 20px", borderRadius:9, border:`1px solid rgba(248,113,113,0.3)`, background:C.roseDim, color:C.rose, fontFamily:body, fontSize:13, cursor:"pointer" }}>Sign Out</button>
        </div>
      </Panel>
    </div>
  );
}

/* ── Semester Selector ── */
const SEM_MAP = {
  "1st Year": ["Sem 1", "Sem 2"],
  "2nd Year": ["Sem 3", "Sem 4"],
  "3rd Year": ["Sem 5", "Sem 6"],
  "4th Year": ["Sem 7", "Sem 8"],
};

function SemSelector({ user, onSelect, C }) {
  const year = user?.year || "1st Year";
  const sems = SEM_MAP[year] || ["Sem 1", "Sem 2"];
  const [selectedSem, setSelectedSem] = useState(sems[0]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, fontFamily:body }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:36, width:420, position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:-60, width:200, height:200, background:"radial-gradient(circle,rgba(232,185,106,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#e8b96a,#c4973a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontWeight:700, fontSize:14, color:"#0d1117" }}>E</div>
          <span style={{ fontFamily:font, fontSize:17, fontWeight:600, color:C.text }}>Edu<span style={{ color:C.gold }}>Track</span></span>
        </div>
        <h2 style={{ fontFamily:font, fontSize:22, fontWeight:600, color:C.text, marginBottom:6 }}>Welcome, {user?.name?.split(" ")[0]}! 👋</h2>
        <p style={{ fontSize:13.5, color:C.textMuted, marginBottom:28 }}>
          You are in <strong style={{ color:C.gold }}>{year}</strong>. Please select your current semester.
        </p>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>Your Year</div>
          <div style={{ padding:"11px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, color:C.text, display:"flex", alignItems:"center", gap:10 }}>
            <span>📅</span> {year}
          </div>
        </div>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textDim, marginBottom:10 }}>Select Current Semester</div>
          <div style={{ display:"flex", gap:10 }}>
            {sems.map(sem => (
              <button key={sem} onClick={() => setSelectedSem(sem)}
                style={{ flex:1, padding:"14px", borderRadius:11, border:`1px solid ${selectedSem===sem?C.goldMid:C.border}`, background:selectedSem===sem?C.goldDim:C.surface2, color:selectedSem===sem?C.gold:C.textMuted, fontFamily:body, fontSize:15, fontWeight:selectedSem===sem?600:400, cursor:"pointer", transition:"all 0.2s" }}>
                {sem}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => onSelect(selectedSem)}
          style={{ width:"100%", padding:"13px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#e8b96a,#c4973a)", color:"#0d1117", fontFamily:body, fontSize:15, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,185,106,0.3)" }}>
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN DASHBOARD SHELL
══════════════════════════════════════════════ */
export default function Dashboard({ role="student", user=null, onLogout }) {
 const { theme: C } = useTheme(); // ← theme hook here only

  const isStudent = role==="student";
  const navItems  = isStudent ? STUDENT_NAV : TEACHER_NAV;

  const [active,          setActive]          = useState("Dashboard");
  const [search,          setSearch]          = useState("");
  const [semester,        setSemester]        = useState(null);
  const [showSemSelector, setShowSemSelector] = useState(isStudent);

  const getPage = () => {
    if (isStudent) {
      switch(active) {
        case "Dashboard":   return <StudentDashboard C={C}/>;
        case "My Courses":  return <StudentCourses C={C}/>;
        case "Attendance":  return <StudentAttendance C={C}/>;
        case "Assignments": return <StudentAssignments C={C}/>;
        case "My Marks":    return <StudentMarks C={C}/>;
        case "Settings":    return <Settings role={role} user={user} onLogout={onLogout} C={C}/>;
        default:            return <StudentDashboard C={C}/>;
      }
    } else {
      switch(active) {
        case "Dashboard":       return <TeacherDashboard C={C}/>;
        case "Manage Courses":  return <TeacherCourses C={C}/>;
        case "Mark Attendance": return <TeacherAttendance C={C}/>;
        case "Assignments":     return <TeacherAssignments C={C}/>;
        case "Enter Marks":     return <TeacherMarks C={C}/>;
        case "Settings":        return <Settings role={role} user={user} onLogout={onLogout} C={C}/>;
        default:                return <TeacherDashboard C={C}/>;
      }
    }
  };

  const userInitials = user?.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : (isStudent?"AK":"RS");
  const userName     = user?.name || (isStudent ? "Student" : "Teacher");
  const userSub      = isStudent
    ? (user?.department && user?.year ? `${user.department} · ${user.year}` : "CSE · 3rd Year")
    : (user?.department || "Computer Science");
  const avatarBg = isStudent ? "linear-gradient(135deg,#4ecdc4,#2d9e97)" : "linear-gradient(135deg,#e8b96a,#c4973a)";

  return (
    <>
      {showSemSelector && isStudent && (
        <SemSelector user={user} C={C} onSelect={(sem) => { setSemester(sem); setShowSemSelector(false); }}/>
      )}

      <style>{`
        ${FONTS_IMPORT}
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; color:${C.text}; transition: background 0.3s, color 0.3s; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:${C.surface2}; border-radius:3px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .stat-card { animation: fadeUp 0.5s ease both; }
        .nav-item:hover { background:${C.surface2} !important; color:${C.text} !important; }
        .list-row:hover { border-color:${C.goldMid} !important; transition:border 0.2s; }
      `}</style>

      <div style={{ display:"flex", height:"100vh", fontFamily:body, background:C.bg, color:C.text, overflow:"hidden", transition:"background 0.3s" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:234, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, position:"relative", overflow:"hidden", transition:"background 0.3s" }}>
          <div style={{ position:"absolute", top:-80, left:-80, width:250, height:250, background:"radial-gradient(circle,rgba(232,185,106,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>

          <div style={{ padding:"24px 22px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"linear-gradient(135deg,#e8b96a,#c4973a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontWeight:700, fontSize:16, color:"#0d1117", boxShadow:"0 4px 14px rgba(232,185,106,0.35)", flexShrink:0 }}>E</div>
            <span style={{ fontFamily:font, fontSize:18, fontWeight:600, color:C.text }}>Edu<span style={{ color:C.gold }}>Track</span></span>
          </div>

          <div style={{ margin:"14px 14px 4px", padding:"8px 12px", background:isStudent?C.tealDim:C.goldDim, borderRadius:9, border:`1px solid ${isStudent?C.tealDim:C.goldMid}`, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>{isStudent?"🎓":"📚"}</span>
            <span style={{ fontSize:12, fontWeight:500, color:isStudent?C.teal:C.gold }}>{isStudent ? "Student Portal" : "Teacher Portal"}</span>
          </div>

          <div style={{ padding:"10px 12px", flex:1, overflowY:"auto" }}>
            {["Overview", isStudent?"Academic":"Manage", "Account"].map(section => {
              const items = navItems.filter(n=>n.section===section);
              if (!items.length) return null;
              return (
                <div key={section}>
                  <div style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:C.textDim, padding:"0 10px", marginBottom:6, marginTop:14 }}>{section}</div>
                  {items.map(n => (
                    <div key={n.label} className="nav-item" onClick={()=>setActive(n.label)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, cursor:"pointer", marginBottom:2, fontSize:"13.5px", fontWeight:active===n.label?500:400, color:active===n.label?C.gold:C.textMuted, background:active===n.label?C.goldDim:"transparent", position:"relative", transition:"all 0.2s" }}>
                      {active===n.label && <div style={{ position:"absolute", left:0, top:"25%", height:"50%", width:3, background:C.gold, borderRadius:"0 3px 3px 0" }}/>}
                      <span style={{ width:16, textAlign:"center", fontSize:14, flexShrink:0 }}>{n.icon}</span>
                      {n.label}
                      {n.badge && <span style={{ marginLeft:"auto", background:C.rose, color:"white", fontSize:10, fontWeight:600, padding:"1px 6px", borderRadius:20 }}>{n.badge}</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ margin:12, padding:"12px 14px", background:C.surface2, borderRadius:12, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:avatarBg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:12, color:"#0d1117", flexShrink:0 }}>{userInitials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userName}</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{userSub}</div>
            </div>
            <button onClick={onLogout} title="Sign out" style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:C.textDim, flexShrink:0 }}>↩</button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.surface, flexShrink:0, transition:"background 0.3s" }}>
            <div>
              <h1 style={{ fontFamily:font, fontSize:21, fontWeight:600, color:C.text }}>{active}</h1>
              <p style={{ fontSize:12.5, color:C.textMuted, marginTop:2 }}>
                {isStudent
                  ? `${semester || ""} · ${user?.year || ""} · ${user?.department || "CSE"}`
                  : `Academic Year 2025–26 · ${user?.department || "Computer Science"}`}
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:"7px 14px", fontSize:13, color:C.textMuted }}>
                🔍 &nbsp;
                <input placeholder="Search pages…" value={search} onChange={e=>setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter") { const match=navItems.find(n=>n.label.toLowerCase().includes(search.toLowerCase())); if(match){setActive(match.label);setSearch("");} }}}
                  style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:C.text, fontFamily:body, width:140 }}/>
              </div>
              {/* Theme Toggle */}
              <ThemeToggle/>
              <div style={{ padding:"6px 14px", borderRadius:9, background:isStudent?C.tealDim:C.goldDim, border:`1px solid ${isStudent?C.tealDim:C.goldMid}`, fontSize:12, fontWeight:500, color:isStudent?C.teal:C.gold, fontFamily:mono }}>
                {isStudent ? (semester || user?.year || "Sem") : "AY 25–26"}
              </div>
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"24px 28px", background:C.bg, transition:"background 0.3s" }}>
            {getPage()}
          </div>
        </div>
      </div>
    </>
  );
}
