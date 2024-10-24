import * as React from "react";

interface Option {
  label: string;
  value: string;
}

type MultiSelectContextType = {
  selectedOptions: Option[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOption: (option: Option) => void;
  createOption: (label: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
};

const MultiSelectContext = React.createContext<
  MultiSelectContextType | undefined
>(undefined);

export function MultiSelect({ children }: { children: React.ReactNode }) {
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const toggleOption = React.useCallback((option: Option) => {
    setSelectedOptions((prev) =>
      prev.some((o) => o.value === option.value)
        ? prev.filter((o) => o.value !== option.value)
        : [...prev, option],
    );
  }, []);

  const createOption = React.useCallback((label: string) => {
    const newOption = {
      label,
      value: label.toLowerCase().replace(/\s+/g, "-"),
    };
    setSelectedOptions((prev) => [...prev, newOption]);
  }, []);

  return (
    <MultiSelectContext.Provider
      value={{
        selectedOptions,
        isOpen,
        setIsOpen,
        toggleOption,
        createOption,
        inputValue,
        setInputValue,
      }}
    >
      {children}
    </MultiSelectContext.Provider>
  );
}

// ... (continued in the next code block)

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const context = React.useContext(MultiSelectContext);
  if (!context) throw new Error("Input must be used within a MultiSelect");

  return (
    <input
      {...props}
      value={context.inputValue}
      onChange={(e) => {
        context.setInputValue(e.target.value);
        if (!context.isOpen) {
          context.setIsOpen(true);
        }
      }}
      onFocus={() => context.setIsOpen(true)}
    />
  );
}

export function Options({ children }: { children: React.ReactNode }) {
  const context = React.useContext(MultiSelectContext);
  if (!context) throw new Error("Options must be used within a MultiSelect");

  if (!context.isOpen) return null;

  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && "value" in child.props) {
      return child.props.value
        .toLowerCase()
        .includes(context.inputValue.toLowerCase());
    }
    return true;
  });

  return <div>{filteredChildren}</div>;
}

export function Option({
  value,
  children,
}: { value: string; children: React.ReactNode }) {
  const context = React.useContext(MultiSelectContext);
  if (!context) throw new Error("Option must be used within a MultiSelect");

  const isSelected = context.selectedOptions.some((o) => o.value === value);

  return (
    <div
      data-state={isSelected ? "checked" : "unchecked"}
      onClick={() => context.toggleOption({ value, label: value })}
    >
      {children}
    </div>
  );
}

export function CreateOption() {
  const [input, setInput] = React.useState("");
  const context = React.useContext(MultiSelectContext);
  if (!context)
    throw new Error("CreateOption must be used within a MultiSelect");

  const handleCreate = () => {
    if (input.trim()) {
      context.createOption(input.trim());
      setInput("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Create new option"
      />
      <button onClick={handleCreate}>Add</button>
    </div>
  );
}

export function SelectedOptions() {
  const context = React.useContext(MultiSelectContext);
  if (!context)
    throw new Error("SelectedOptions must be used within a MultiSelect");

  return (
    <div>
      {context.selectedOptions.map((option) => (
        <span key={option.value} style={{ marginRight: "5px" }}>
          {option.label}
          <button onClick={() => context.toggleOption(option)}>×</button>
        </span>
      ))}
    </div>
  );
}
