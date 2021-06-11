import React, { CSSProperties, useState } from "react";

export const InputComponent = (props: {
  value: string;
  onEnter: (value: string) => void;
  readonly?: boolean;
  style?: CSSProperties;
  className?: string;
}): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      props.onEnter(event.currentTarget.value);
      setInputValue("");
      setEditing(false);
      event.currentTarget.blur();
    }
  }
  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.currentTarget.value);
  }
  function onClick(event: React.MouseEvent<HTMLInputElement>): void {
    /* When focus gained allow editing. */
    if (!props.readonly && !editing) {
      setInputValue("");
      setEditing(true);
    }
  }
  function onBlur(event: React.ChangeEvent<HTMLInputElement>): void {
    setEditing(false);
  }

  if (!editing && inputValue !== props.value) {
    setInputValue(props.value);
  }

  return (
    <input
      type="text"
      value={inputValue}
      readOnly={props.readonly}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      className={props.className}
      style={props.style}
    />
  );
};
