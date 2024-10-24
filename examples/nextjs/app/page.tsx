"use client";

import { options } from "@/utils";
import {
  CreateOption,
  Input,
  MultiSelect,
  Option,
  Options,
  SelectedOptions,
} from "faceted-filter";

export default function IndexPage() {
  return (
    <MultiSelect>
      <Input placeholder="Select options..." />
      <Options>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Options>
      <CreateOption />
      <SelectedOptions />
    </MultiSelect>
  );
}
