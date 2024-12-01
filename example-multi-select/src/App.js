import React, { useLayoutEffect, useRef, useState } from "react";
import { DataSheetGrid } from "react-datasheet-grid";
import Select from "react-select";
import "react-datasheet-grid/dist/style.css";

const SelectComponent = React.memo(
  ({ active, rowData, setRowData, focus, stopEditing, columnData }) => {
    const ref = useRef(null);
    const selected = rowData ? rowData.split(",") : [];
    const values = columnData.choices.filter(({ value }) => {
      return selected.includes(value);
    });

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus();
      } else {
        ref.current?.blur();
      }
    }, [focus]);

    return (
      <Select
        isMulti
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            flex: 1,
            alignSelf: "stretch",
            pointerEvents: focus ? undefined : "none",
          }),
          control: (provided) => ({
            ...provided,
            height: "100%",
            border: "none",
            boxShadow: "none",
            background: "none",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            opacity: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
        }}
        isDisabled={columnData.disabled}
        value={values}
        menuPortalTarget={document.body}
        menuIsOpen={focus}
        onChange={(choice) => {
          if (choice === null) return;
          let value = "";
          choice.forEach((c) => {
            value += value === "" ? c.value : `,${c.value}`;
          });
          setRowData(value);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        options={columnData.choices}
      />
    );
  }
);

const selectColumn = (options) => ({
  component: SelectComponent,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) =>
    options.choices.find((choice) => choice.value === rowData)?.label ?? null,
  pasteValue: ({ value }) =>
    options.choices.find((choice) => choice.label === value)?.value ?? null,
});

export default function App() {
  const [data, setData] = useState(["chocolate", null]);

  return (
    <DataSheetGrid
      value={data}
      onChange={setData}
      columns={[
        {
          ...selectColumn({
            choices: [
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ],
          }),
          title: "Flavor",
        },
      ]}
    />
  );
}
