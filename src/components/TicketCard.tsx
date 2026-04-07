import { DragEvent } from "react";
import { Ticket, PRIO_COLORS, TYPE_ICONS } from "./types";
import { Badge } from "./Badge";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export function TicketCard(props: TicketCardProps) {
  const t = props.ticket;
  
  function onDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("ticketId", t.id);
    e.dataTransfer.effectAllowed = "move";
  }
  
  const title = t.title.length > 50 ? t.title.slice(0, 50) + "…" : t.title;
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={function() { props.onClick(t) }}
      style={{
        background: "#151525",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 8,
        border: "1px solid #2a2a3e",
        cursor: "pointer",
        transition: "all .15s"
      }}
      onMouseEnter={function(e) { 
        e.currentTarget.style.borderColor = "#6366f155";
        e.currentTarget.style.background = "#1a1a30";
      }}
      onMouseLeave={function(e) { 
        e.currentTarget.style.borderColor = "#2a2a3e";
        e.currentTarget.style.background = "#151525";
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8, lineHeight: 1.35 }}>{title}</div>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ fontSize: 13 }}>{TYPE_ICONS[t.type]}</span>
        <Badge color="#475569" small={true}>{t.type}</Badge>
        <span style={{ flex: 1 }} />
        <Badge color={PRIO_COLORS[t.priority]} small={true}>{t.priority}</Badge>
      </div>
    </div>
  );
}
