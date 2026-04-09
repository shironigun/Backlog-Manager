import { Ticket, PHASE_COLORS, ROLE_ICONS } from "./types";
import { getTimelineSummary } from "./utils";

interface TimelineProps {
  ticket: Ticket;
}

export function Timeline(props: TimelineProps) {
  const summary = getTimelineSummary(props.ticket);
  const total = summary.total || 1; // Avoid division by zero

  // Calculate percentages for visual display
  const designPercent = ((summary.designer || 0) / total) * 100;
  const devPercent = ((summary.developer || 0) / total) * 100;
  const qaPercent = ((summary.qa || 0) / total) * 100;

  // Format dates for display
  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
        TIMELINE
      </h4>

      {/* Visual Timeline Bar */}
      {summary.total > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", background: "#1e1e2e" }}>
            {summary.designer && summary.designer > 0 && (
              <div 
                style={{ 
                  width: `${designPercent}%`, 
                  background: PHASE_COLORS.Design, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: "#fff",
                  minWidth: designPercent > 15 ? 'auto' : 0
                }}
                title={`Design: ${summary.designer} days`}
              >
                {designPercent > 15 && `${ROLE_ICONS.Designer} ${summary.designer}d`}
              </div>
            )}
            {summary.developer && summary.developer > 0 && (
              <div 
                style={{ 
                  width: `${devPercent}%`, 
                  background: PHASE_COLORS.Development, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: "#fff",
                  minWidth: devPercent > 15 ? 'auto' : 0
                }}
                title={`Development: ${summary.developer} days`}
              >
                {devPercent > 15 && `${ROLE_ICONS.Developer} ${summary.developer}d`}
              </div>
            )}
            {summary.qa && summary.qa > 0 && (
              <div 
                style={{ 
                  width: `${qaPercent}%`, 
                  background: PHASE_COLORS.QA, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: "#fff",
                  minWidth: qaPercent > 15 ? 'auto' : 0
                }}
                title={`QA: ${summary.qa} days`}
              >
                {qaPercent > 15 && `${ROLE_ICONS.QA} ${summary.qa}d`}
              </div>
            )}
          </div>
          {summary.current && (
            <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
              Currently in {props.ticket.currentPhase} phase for {summary.current.days} day{summary.current.days !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Assignment History List */}
      {props.ticket.assignmentHistory && props.ticket.assignmentHistory.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
            Assignment History
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {props.ticket.assignmentHistory.map(function(assignment, index) {
              const days = assignment.completedAt 
                ? Math.ceil((new Date(assignment.completedAt).getTime() - new Date(assignment.assignedAt).getTime()) / (1000 * 60 * 60 * 24))
                : Math.ceil((new Date().getTime() - new Date(assignment.assignedAt).getTime()) / (1000 * 60 * 60 * 24));
              
              const roleColor = assignment.role === "Designer" ? PHASE_COLORS.Design : 
                                assignment.role === "Developer" ? PHASE_COLORS.Development : 
                                PHASE_COLORS.QA;
              
              return (
                <div 
                  key={index} 
                  style={{ 
                    background: "#1e1e2e", 
                    borderLeft: `3px solid ${roleColor}`, 
                    padding: "8px 12px", 
                    borderRadius: 6,
                    fontSize: 12 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{ROLE_ICONS[assignment.role]}</span>
                    <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{assignment.devName}</span>
                    <span style={{ color: "#64748b" }}>({assignment.role})</span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>
                    {formatDate(assignment.assignedAt)} → {assignment.completedAt ? formatDate(assignment.completedAt) : "Ongoing"}
                    <span style={{ marginLeft: 8, color: "#64748b" }}>
                      ({days} day{days !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {summary.total === 0 && (!props.ticket.assignmentHistory || props.ticket.assignmentHistory.length === 0) && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#475569", fontSize: 12 }}>
          No timeline data yet — assign this ticket to start tracking
        </div>
      )}

      {/* Phase Dates Summary (if no assignment history) */}
      {(!props.ticket.assignmentHistory || props.ticket.assignmentHistory.length === 0) && summary.total > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: "#64748b", display: "flex", flexDirection: "column", gap: 4 }}>
            {summary.designer && summary.designer > 0 && (
              <div>{ROLE_ICONS.Designer} Design: {summary.designer} days</div>
            )}
            {summary.developer && summary.developer > 0 && (
              <div>{ROLE_ICONS.Developer} Development: {summary.developer} days</div>
            )}
            {summary.qa && summary.qa > 0 && (
              <div>{ROLE_ICONS.QA} QA: {summary.qa} days</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
