interface BadgeProps {
  color: string;
  small?: boolean;
  children: React.ReactNode;
}

export function Badge(props: BadgeProps) {
  const bg = props.color + "22";
  const bdr = "1px solid " + props.color + "44";
  return (
    <span 
      style={{
        background: bg,
        color: props.color,
        borderRadius: 6,
        padding: props.small ? "1px 6px" : "2px 10px",
        fontSize: props.small ? 10 : 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        border: bdr
      }}
    >
      {props.children}
    </span>
  );
}
