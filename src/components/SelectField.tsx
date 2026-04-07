interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}

export function SelectField(props: SelectFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {props.label && (
        <label 
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#94a3b8",
            marginBottom: 4
          }}
        >
          {props.label}
        </label>
      )}
      <select 
        value={props.value} 
        onChange={function(e) { props.onChange(e.target.value) }} 
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#e2e8f0",
          fontSize: 14,
          outline: "none"
        }}
      >
        {props.options.map(function(o: string) {
          return <option key={o} value={o}>{o}</option>;
        })}
      </select>
    </div>
  );
}
