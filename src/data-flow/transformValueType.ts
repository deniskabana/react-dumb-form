import { DataFlowState } from "../types";

enum InputType {
  // Number types
  Number = "number",
  Range = "range",
  DatetimeLocal = "datetime-local",
  // Date types
  Date = "date",
  Month = "month",
  Week = "week",
  Time = "time",
  // Boolean types
  Checkbox = "checkbox",
  // String types
  Text = "text",
  Email = "email",
  File = "file",
  Password = "password",
  Url = "url",
  Tel = "tel",
  Radio = "radio",
}

/** Transform values types. */
export function transformValueType<Schema>(name: keyof Schema, value: any, dataFlowState: DataFlowState<Schema>): any {
  const { transformationSchema } = dataFlowState.options;
  let definitiveValue = value;

  // 1. Default data transformation (built-in, input[type] based)
  if (!transformationSchema?.disableDefaultTransformation) {
    // 1.1. Get input's data type if specified
    let inputType: string;
    const domFormElem = (document.forms as any)[dataFlowState.options.name];
    const domInputElem = domFormElem.elements[name] as HTMLInputElement | undefined;
    inputType = domInputElem?.type ?? "text"; // Default to texts like browsers do

    // 1.2. Automatically return null values
    if (value === null || value === undefined) {
      definitiveValue = null;
    } else {
      // 1.3. Determine and return the input value with the correct type
      // NOTE: Purposefully ignore valueAsNumber - just in case the change is NOT coming from the input
      switch (inputType) {
        case InputType.Number:
        case InputType.Range:
          definitiveValue = Number(value); // Don't implicitly handle NaN
          break;

        case InputType.Date:
        case InputType.Month:
        case InputType.DatetimeLocal:
          if (value instanceof Date) {
            definitiveValue = value;
          } else if (typeof value === "string") {
            definitiveValue = new Date(value);
          } else {
            definitiveValue = null; // Implicitly return null rather than a code-breaking value
          }
          break;

        case InputType.Week:
        case InputType.Time:
          if (value instanceof Date) {
            definitiveValue = value;
          } else {
            definitiveValue = domInputElem?.valueAsDate ?? null;
          }
          break;

        case InputType.Checkbox:
          if (typeof value === "boolean") {
            definitiveValue = value;
          } else {
            definitiveValue = Boolean(value);
          }
          break;

        case InputType.Text:
        case InputType.Email:
        case InputType.File:
        case InputType.Password:
        case InputType.Url:
        case InputType.Tel:
        case InputType.Radio:
        default:
          if (typeof value === "string") {
            definitiveValue = value;
          } else {
            definitiveValue = String(value);
          }
          break;
      }
    }
  }

  // 2. Execute user provided transformations
  if (transformationSchema) {
    if (transformationSchema.fields) {
      const transformator = transformationSchema.fields[name];

      switch (typeof transformator) {
        case "string":
          if (transformator === "string") {
            definitiveValue = String(definitiveValue);
          } else if (transformator === "number") {
            definitiveValue = Number(definitiveValue);
          } else if (transformator === "boolean") {
            definitiveValue = Boolean(definitiveValue);
          }
          break;

        case "function":
          definitiveValue = transformator(definitiveValue);
          break;

        default:
          // Ignore other cases
          break;
      }
    }
  }

  return definitiveValue;
}
