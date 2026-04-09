import { Ticket, STATUS_COLORS, PRIO_COLORS, TYPE_ICONS, Developer } from "./types";
import { Modal } from "./Modal";
import { Badge } from "./Badge";
import { Timeline } from "./Timeline";

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  developers?: Developer[];
  onAssign?: (ticketId: string, developerId: string) => void;
  onCompleteAndReassign?: (ticketId: string, nextDeveloperId: string) => void;
}

export function TicketDetail(props: TicketDetailProps) {
  const t = props.ticket;
  const overdue = t.dueDate && new Date(t.dueDate) < new Date();
  
  return (
    <Modal open={true} onClose={props.onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 20 }}>{TYPE_ICONS[t.type]}</span>
          <Badge color={STATUS_COLORS[t.status]}>{t.status}</Badge>
          <Badge color={PRIO_COLORS[t.priority]}>{t.priority}</Badge>
          <Badge color="#64748b">{t.type}</Badge>
        </div>
      </div>
      <h3 style={{ margin: "0 0 12px", color: "#e2e8f0", fontSize: 18 }}>{t.title}</h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, fontSize: 12, color: "#94a3b8" }}>
        {t.sprint && <span>{"Sprint " + t.sprint}</span>}
        {t.dueDate && <span style={{ color: overdue ? "#ef4444" : "#94a3b8" }}>{"Due: " + t.dueDate}</span>}
      </div>

      {t.description && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Description</div>
          <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, background: "#0f172a", borderRadius: 8, padding: 12 }}>{t.description}</div>
        </div>
      )}

      {t.acceptanceCriteria && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Acceptance Criteria</div>
          <pre style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, background: "#0f172a", borderRadius: 8, padding: 12, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{t.acceptanceCriteria}</pre>
        </div>
      )}

      {t.adoLink && (
        <a href={t.adoLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8b5cf6", textDecoration: "none", background: "#8b5cf622", padding: "6px 14px", borderRadius: 8, fontWeight: 600 }}>
          {"Open in ADO Board ↗"}
        </a>
      )}

      {/* Timeline */}
      <Timeline ticket={t} />

      {/* Assignment Actions */}
      {props.developers && props.onAssign && !t.devId && (
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #2a2a3e" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
            Assign To
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {props.developers.map(function(dev) {
              return (
                <button key={dev.id} onClick={function() { props.onAssign!(t.id, dev.id); props.onClose(); }} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                  {dev.role === "Designer" ? "🎨" : dev.role === "Developer" ? "💻" : "🧪"} {dev.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {props.developers && props.onCompleteAndReassign && t.devId && (
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #2a2a3e" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
            Complete & Reassign To
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {props.developers.filter(function(dev) { return dev.id !== t.devId; }).map(function(dev) {
              return (
                <button key={dev.id} onClick={function() { props.onCompleteAndReassign!(t.id, dev.id); props.onClose(); }} style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                  {dev.role === "Designer" ? "🎨" : dev.role === "Developer" ? "💻" : "🧪"} {dev.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 14, borderTop: "1px solid #2a2a3e" }}>
        <button onClick={function() { props.onDelete(t.id); props.onClose() }} style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Delete</button>
        <button onClick={function() { props.onEdit(t) }} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Edit</button>
      </div>
    </Modal>
  );
}
