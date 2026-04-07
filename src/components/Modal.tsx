interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal(props: ModalProps) {
  if (!props.open) return null;
  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.5)",
        backdropFilter: "blur(4px)"
      }} 
      onClick={props.onClose}
    >
      <div 
        onClick={function(e) { e.stopPropagation() }} 
        style={{
          background: "#1e1e2e",
          borderRadius: 14,
          padding: 28,
          width: "95%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid #333",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)"
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
