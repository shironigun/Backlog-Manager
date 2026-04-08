import { ChangeEvent } from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export function InputField(props: InputFieldProps) {
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
      <input 
        type={props.type || "text"} 
        value={props.value} 
        onChange={props.onChange} 
        placeholder={props.placeholder} 
        autoFocus={props.autoFocus} 
        onKeyDown={props.onKeyDown} 
        onPaste={props.onPaste} 
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#e2e8f0",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box"
        }} 
      />
    </div>
  );
}
