"use client";

import {
  CreateOption,
  Input,
  MultiSelect,
  Option,
  Options,
  SelectedOptions,
} from "faceted-filter";

export default function HomePage() {
  return (
    <MultiSelect>
      <Input placeholder="Select options..." />
      <Options>
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
      </Options>
      <CreateOption />
      <SelectedOptions />
    </MultiSelect>
  );
}
