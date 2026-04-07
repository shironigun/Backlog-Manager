import { ChangeEvent } from "react";

interface TextAreaFieldProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export function TextAreaField(props: TextAreaFieldProps) {
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
      <textarea 
        value={props.value} 
        onChange={props.onChange} 
        placeholder={props.placeholder} 
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#e2e8f0",
          fontSize: 14,
          outline: "none",
          minHeight: 70,
          resize: "vertical",
          boxSizing: "border-box",
          fontFamily: "inherit"
        }} 
      />
    </div>
  );
}
