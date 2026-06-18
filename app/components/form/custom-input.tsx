/* eslint-disable @typescript-eslint/no-explicit-any  */

import { ComponentProps, Dispatch, SetStateAction } from "react";
import { Input, Label } from "@heroui/react";
import z from "zod";

type Props<T> = ComponentProps<"input"> & {
  formState: T;
  setForm: Dispatch<SetStateAction<T>>;
  path: string;
  errors: z.ZodError["issues"] | undefined;
  label?: string;
};

const getFieldRecursive = (data: any, fields: string[]): any => {
  if (!data) return "";
  if (fields.length > 1) {
    return getFieldRecursive(data?.[fields[0]], fields.slice(1));
  }
  return data?.[fields[0]] || "";
};

const setFieldRecursive = (data: any, fields: string[], value: any): any => {
  const currentKey = fields[0];

  if (fields.length === 1) {
    return {
      ...data,
      [currentKey]: value,
    };
  }
  return {
    ...data,
    [currentKey]: setFieldRecursive(
      data?.[currentKey] || {},
      fields.slice(1),
      value,
    ),
  };
};

const CustomInput = <T extends Record<string, any>>({
  formState,
  setForm,
  path,
  errors,
  label,
  ...rest
}: Props<T>) => {
  const fields = path.split(".");
  const value = getFieldRecursive(formState, fields);
  const errorMessage = errors?.find(
    (error) => error.path.join('.') === path,
  )?.message

  return (
    <div className="flex w-full gap-4 items-start py-2">
      {label && <Label>{label}</Label>}
      <div className="flex-1 flex flex-col gap-1 w-full">
      <Input
        className="w-full"
        value={value}
        onChange={(e) => {
          setForm((prevForm) =>
            setFieldRecursive(prevForm, fields, e.target.value),
          );
        }}
        {...rest}
      />
      {errorMessage && (
        <p className="text-sm font-medium text-danger pl-1 animate-appearance-in">
          {errorMessage}
        </p>
      )}
      </div>
    </div>
  );
};

export default CustomInput;
