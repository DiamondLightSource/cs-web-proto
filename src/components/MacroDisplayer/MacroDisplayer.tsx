import React from "react";
import { useSelector } from "react-redux";
import { CsState, MacroMap } from "../../redux/csState";
export interface DumbMacroDisplayerProps {
  macroMap: MacroMap;
}

const DumbMacroDisplayer: React.FC<DumbMacroDisplayerProps> = (
  props: DumbMacroDisplayerProps
): JSX.Element => (
  <table
    style={{
      position: "relative",
      display: "block",
      tableLayout: "fixed",
      width: "100%",
      borderCollapse: "collapse"
    }}
  >
    <tbody style={{ width: "100%", display: "table" }}>
      <tr>
        <th style={{ width: "50%" }}>Macro name</th>
        <th style={{ width: "50%" }}>Macro value</th>
      </tr>

      {Object.entries(props.macroMap)
        .filter(([key, value]): boolean => {
          return !value.startsWith("$");
        })
        .map(
          ([key, value], index): JSX.Element => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            );
          }
        )}
    </tbody>
  </table>
);

export interface MacroDisplayerProps {}

export const MacroDisplayer: React.FC<MacroDisplayerProps> = (
  props: MacroDisplayerProps
): JSX.Element => {
  const macroMap = useSelector(
    (state: CsState): MacroMap => {
      return state.macroMap;
    }
  );
  console.log(macroMap);

  return <DumbMacroDisplayer macroMap={macroMap} />;
};
