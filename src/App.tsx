import { useState, DragEvent } from "react";
import { 
  Developer, 
  Ticket, 
  TicketForm, 
  Status, 
  Priority, 
  Role,
  STATUSES, 
  TYPES, 
  PRIORITIES,
  ROLES,
  STATUS_COLORS,
  PRIO_COLORS,
  TYPE_ICONS
} from "./components/types";
import { uid } from "./components/utils";
import { Modal } from "./components/Modal";
import { Badge } from "./components/Badge";
import { InputField } from "./components/InputField";
import { SelectField } from "./components/SelectField";
import { TextAreaField } from "./components/TextAreaField";
import { TicketDetail } from "./components/TicketDetail";
import { TicketCard } from "./components/TicketCard";

/* ── Main App ── */
export default function App(){
  const [devs, setDevs] = useState<Developer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDev, setSelectedDev] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showAddDev, setShowAddDev] = useState(false);
  const [newDevName, setNewDevName] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [newDevRole, setNewDevRole] = useState<Role>("Developer");

  const emptyForm: TicketForm = {title:"",description:"",acceptanceCriteria:"",adoLink:"",type:"Story",status:"New",priority:"Medium",dueDate:"",sprint:""};
  const [form, setForm] = useState<TicketForm>(emptyForm);

  const priorityOrder: Record<Priority, number> = {"High":0,"Medium":1,"Low":2};
  function sortByPriority(arr: Ticket[]): Ticket[]{
    return arr.slice().sort(function(a,b){return (priorityOrder[a.priority]||1)-(priorityOrder[b.priority]||1)});
  }

  function addDev(){
    if(!newDevName.trim()) return;
    setDevs(function(p){return p.concat([{id:uid(),name:newDevName.trim(),role:newDevRole}])});
    setNewDevName("");
    setNewDevRole("Developer");
    setShowAddDev(false);
  }
  function removeDev(id: string){
    if(!confirm("Remove this developer and all their tickets?")) return;
    setDevs(function(p){return p.filter(function(d){return d.id!==id})});
    setTickets(function(p){return p.filter(function(t){return t.devId!==id})});
    if(selectedDev===id) setSelectedDev(null);
  }
  function openNewTicket(){
    setEditingTicket(null);
    setForm(emptyForm);
    setShowTicketModal(true);
  }
  function openEditTicket(t: Ticket){
    setViewingTicket(null);
    setEditingTicket(t);
    setForm({title:t.title,description:t.description||"",acceptanceCriteria:t.acceptanceCriteria||"",adoLink:t.adoLink||"",type:t.type,status:t.status,priority:t.priority,dueDate:t.dueDate||"",sprint:t.sprint||""});
    setShowTicketModal(true);
  }
  function saveTicket(){
    if(!form.title.trim()) return;
    if(editingTicket){
      setTickets(function(p){return p.map(function(t){
        if(t.id===editingTicket.id) return Object.assign({},t,form);
        return t;
      })});
    } else {
      const newT: Ticket = Object.assign({id:uid(),devId:selectedDev,createdAt:new Date().toISOString()},form) as Ticket;
      setTickets(function(p){return p.concat([newT])});
    }
    setShowTicketModal(false);
  }
  function deleteTicket(id: string){
    setTickets(function(p){return p.filter(function(t){return t.id!==id})});
  }
  function handleDrop(status: Status, e: DragEvent<HTMLDivElement>){
    e.preventDefault();
    setDragOver(null);
    const ticketId = e.dataTransfer.getData("ticketId");
    if(ticketId) setTickets(function(p){return p.map(function(t){
      if(t.id===ticketId) return Object.assign({},t,{status:status});
      return t;
    })});
  }

  const dev = devs.find(function(d){return d.id===selectedDev});
  const devTickets = tickets.filter(function(t){return t.devId===selectedDev});

  /* ════ DASHBOARD ════ */
  if(!selectedDev){
    return (
      <div style={{minHeight:"100vh",background:"#0b0b1a",color:"#e2e8f0",fontFamily:"system-ui",padding:20}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{margin:0,fontSize:24,fontWeight:700,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Backlog Manager</h1>
              <p style={{margin:"4px 0 0",fontSize:13,color:"#64748b"}}>Track tickets per developer across all statuses</p>
            </div>
            <button onClick={function(){setShowAddDev(true)}} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:600,cursor:"pointer",fontSize:14}}>+ Add Member</button>
          </div>

          {devs.length===0 && (
            <div style={{textAlign:"center",padding:60,color:"#475569"}}>
              <div style={{fontSize:48,marginBottom:12}}>{"👥"}</div>
              <div style={{fontSize:16,fontWeight:600}}>No team members yet</div>
              <div style={{fontSize:13,marginTop:4}}>Add a team member (Developer, QA, or Designer) to start tracking their backlog</div>
            </div>
          )}

          {ROLES.map(function(role){
            const members = devs.filter(function(d){return (d.role||"Developer")===role});
            if(members.length===0 && devs.length>0) return null;
            if(members.length===0) return null;
            const roleIcon = role==="Developer" ? "💻" : role==="QA" ? "🧪" : "🎨";
            const roleGrad = role==="Developer" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : role==="QA" ? "linear-gradient(135deg,#06b6d4,#0ea5e9)" : "linear-gradient(135deg,#ec4899,#f97316)";
            const roleLabel = role==="QA" ? "QA Members" : role==="Designer" ? "Designers" : "Developers";
            return (
              <div key={role} style={{marginBottom:28}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:18}}>{roleIcon}</span>
                  <h2 style={{margin:0,fontSize:18,fontWeight:700,color:"#e2e8f0"}}>{roleLabel}</h2>
                  <span style={{fontSize:12,color:"#64748b"}}>{"("+members.length+")"}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
                  {members.map(function(d){
                    const dt = tickets.filter(function(t){return t.devId===d.id});
                    const counts: Record<Status, number> = {} as Record<Status, number>;
                    STATUSES.forEach(function(s){counts[s]=dt.filter(function(t){return t.status===s}).length});
                    const active = dt.filter(function(t){return t.status!=="Closed"&&t.status!=="Waiting for Release"}).length;
                    const blocked = (counts["Blocked"]||0)+(counts["Discussion Required"]||0);
                    const sub = dt.length+" tickets · "+active+" active"+(blocked>0?" · "+blocked+" blocked":"");
                    return (
                      <div key={d.id} onClick={function(){setSelectedDev(d.id)}} style={{background:"#151525",borderRadius:14,padding:20,border:"1px solid #2a2a3e",cursor:"pointer",transition:"all .2s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=role==="QA"?"#06b6d4":role==="Designer"?"#ec4899":"#6366f1";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="#2a2a3e";e.currentTarget.style.transform="none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:36,height:36,borderRadius:"50%",background:roleGrad,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#fff"}}>{d.name[0].toUpperCase()}</div>
                            <div>
                              <div style={{fontWeight:700,fontSize:15}}>{d.name}</div>
                              <div style={{fontSize:11,color:"#64748b"}}>{sub}</div>
                            </div>
                          </div>
                          <button onClick={function(e){e.stopPropagation();removeDev(d.id)}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,lineHeight:1}}>{"×"}</button>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {STATUSES.map(function(s){
                            if(counts[s]<=0) return null;
                            return <Badge key={s} color={STATUS_COLORS[s]} small={true}>{s+": "+counts[s]}</Badge>;
                          })}
                        </div>
                        {dt.length>0 && (
                          <div style={{marginTop:10,height:6,borderRadius:3,background:"#1e1e2e",overflow:"hidden",display:"flex"}}>
                            {STATUSES.map(function(s){
                              if(counts[s]<=0) return null;
                              return <div key={s} style={{height:"100%",background:STATUS_COLORS[s],width:(counts[s]/dt.length*100)+"%"}} />;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <Modal open={showAddDev} onClose={function(){setShowAddDev(false)}}>
          <h3 style={{margin:"0 0 16px",color:"#e2e8f0"}}>Add Team Member</h3>
          <InputField label="Name" value={newDevName} onChange={function(e){setNewDevName(e.target.value)}} placeholder="e.g. John Smith" autoFocus={true} onKeyDown={function(e){if(e.key==="Enter") addDev()}} />
          <SelectField label="Role" options={ROLES} value={newDevRole} onChange={function(v){setNewDevRole(v as Role)}} />
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={function(){setShowAddDev(false)}} style={{background:"#1e293b",color:"#94a3b8",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer"}}>Cancel</button>
            <button onClick={addDev} style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontWeight:600,cursor:"pointer"}}>Add</button>
          </div>
        </Modal>
      </div>
    );
  }

  /* ════ DEVELOPER DETAIL ════ */
  return (
    <div style={{minHeight:"100vh",background:"#0b0b1a",color:"#e2e8f0",fontFamily:"system-ui",padding:20}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={function(){setSelectedDev(null)}} style={{background:"#1e293b",color:"#94a3b8",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13}}>{"← Back"}</button>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff"}}>{dev?dev.name[0].toUpperCase():""}</div>
            <h2 style={{margin:0,fontSize:20,fontWeight:700}}>{dev?dev.name:""}</h2>
            <span style={{fontSize:12,color:"#64748b"}}>{devTickets.length+" tickets"}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:"#151525",borderRadius:8,display:"flex",overflow:"hidden",border:"1px solid #2a2a3e"}}>
              <button onClick={function(){setViewMode("kanban")}} style={{background:viewMode==="kanban"?"#6366f1":"transparent",color:viewMode==="kanban"?"#fff":"#94a3b8",border:"none",padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{"📋 Kanban"}</button>
              <button onClick={function(){setViewMode("list")}} style={{background:viewMode==="list"?"#6366f1":"transparent",color:viewMode==="list"?"#fff":"#94a3b8",border:"none",padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>{"📊 List"}</button>
            </div>
            <button onClick={openNewTicket} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontWeight:600,cursor:"pointer",fontSize:13}}>+ New Ticket</button>
          </div>
        </div>

        {/* Summary badges */}
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {STATUSES.map(function(s){
            const c = devTickets.filter(function(t){return t.status===s}).length;
            return <Badge key={s} color={STATUS_COLORS[s]}>{s+": "+c}</Badge>;
          })}
        </div>

        {/* ── KANBAN ── */}
        {viewMode==="kanban" && (
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:20}}>
            {STATUSES.map(function(status){
              const col = sortByPriority(devTickets.filter(function(t){return t.status===status}));
              const isOver = dragOver===status;
              return (
                <div key={status} onDragOver={function(e){e.preventDefault();setDragOver(status)}} onDragLeave={function(){setDragOver(null)}} onDrop={function(e){handleDrop(status,e)}} style={{minWidth:200,maxWidth:240,flex:"1 0 200px",background:isOver?"#1a1a35":"#111122",borderRadius:12,padding:10,border:"1px solid "+(isOver?"#6366f1":"#1e1e2e"),transition:"all .15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,paddingBottom:8,borderBottom:"2px solid "+STATUS_COLORS[status]}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[status]}} />
                    <span style={{fontSize:11,fontWeight:700,flex:1}}>{status}</span>
                    <span style={{fontSize:11,color:"#64748b",background:"#1e1e2e",borderRadius:10,padding:"1px 7px"}}>{col.length}</span>
                  </div>
                  {col.map(function(t){
                    return <TicketCard key={t.id} ticket={t} onClick={function(tk){setViewingTicket(tk)}} />;
                  })}
                  {col.length===0 && <div style={{textAlign:"center",padding:"20px 0",fontSize:12,color:"#334155"}}>Drop here</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIST ── */}
        {viewMode==="list" && (
          <div>
            {STATUSES.map(function(status){
              const col = sortByPriority(devTickets.filter(function(t){return t.status===status}));
              if(col.length===0) return null;
              return (
                <div key={status} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:STATUS_COLORS[status]}} />
                    <h3 style={{margin:0,fontSize:15,fontWeight:700}}>{status}</h3>
                    <span style={{fontSize:12,color:"#64748b"}}>{"("+col.length+")"}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {col.map(function(t){
                      const title = t.title.length>60 ? t.title.slice(0,60)+"…" : t.title;
                      return (
                        <div key={t.id} onClick={function(){setViewingTicket(t)}} style={{background:"#151525",borderRadius:10,padding:"10px 14px",border:"1px solid #2a2a3e",display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:"all .15s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="#6366f155"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="#2a2a3e"}}>
                          <span style={{fontSize:14}}>{TYPE_ICONS[t.type]}</span>
                          <span style={{fontWeight:600,fontSize:14,flex:1,minWidth:120}}>{title}</span>
                          <Badge color="#475569" small={true}>{t.type}</Badge>
                          <Badge color={PRIO_COLORS[t.priority]} small={true}>{t.priority}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {devTickets.length===0 && <div style={{textAlign:"center",padding:40,color:"#475569",fontSize:14}}>{"No tickets yet — add one to get started"}</div>}
          </div>
        )}
      </div>

      {/* ── Viewing ticket detail ── */}
      {viewingTicket && (
        <TicketDetail
          ticket={viewingTicket}
          onClose={function(){setViewingTicket(null)}}
          onEdit={openEditTicket}
          onDelete={deleteTicket}
        />
      )}

      {/* ── Create / Edit form ── */}
      <Modal open={showTicketModal} onClose={function(){setShowTicketModal(false)}}>
        <h3 style={{margin:"0 0 18px",color:"#e2e8f0"}}>{editingTicket?"Edit Ticket":"New Ticket"}</h3>
        <InputField label="Title *" value={form.title} onChange={function(e){setForm(Object.assign({},form,{title:e.target.value}))}} placeholder="Ticket title" autoFocus={true} />
        <InputField label="ADO Board Link" value={form.adoLink} onChange={function(e){setForm(Object.assign({},form,{adoLink:e.target.value}))}} placeholder="https://dev.azure.com/..." />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <SelectField label="Type" options={TYPES} value={form.type} onChange={function(v){setForm(Object.assign({},form,{type:v}))}} />
          <SelectField label="Status" options={STATUSES} value={form.status} onChange={function(v){setForm(Object.assign({},form,{status:v}))}} />
          <SelectField label="Priority" options={PRIORITIES} value={form.priority} onChange={function(v){setForm(Object.assign({},form,{priority:v}))}} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Due Date" type="date" value={form.dueDate} onChange={function(e){setForm(Object.assign({},form,{dueDate:e.target.value}))}} />
          <InputField label="Sprint" value={form.sprint} onChange={function(e){setForm(Object.assign({},form,{sprint:e.target.value}))}} placeholder="e.g. 24" />
        </div>
        <TextAreaField label="Description" value={form.description} onChange={function(e){setForm(Object.assign({},form,{description:e.target.value}))}} placeholder="Brief description..." />
        <TextAreaField label="Acceptance Criteria" value={form.acceptanceCriteria} onChange={function(e){setForm(Object.assign({},form,{acceptanceCriteria:e.target.value}))}} placeholder="Given... When... Then..." />
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <button onClick={function(){setShowTicketModal(false)}} style={{background:"#1e293b",color:"#94a3b8",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer"}}>Cancel</button>
          <button onClick={saveTicket} style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontWeight:600,cursor:"pointer"}}>{editingTicket?"Save Changes":"Create Ticket"}</button>
        </div>
      </Modal>
    </div>
  );
}
