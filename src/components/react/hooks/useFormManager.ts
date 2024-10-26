import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface ComponentState {
  value: string;
  isValid: boolean;
}

export type ValidationFunction = () => ComponentState;

export interface FormManager {
  registerComponent: (
    name: string,
    onChange: ValidationFunction,
    onValidityChange: (isValid: boolean) => void
  ) => void;
  unregisterComponent: (name: string) => void;
  canSave: () => boolean;
}

export const useFormManager = (): FormManager => {
  const [components, setComponents] = useState<
    Array<{
      name: string;
      onChange: () => ComponentState;
      onValidityChange: (isValid: boolean) => void;
    }>
  >([]);

  const registerComponent = useCallback(
    (
      name: string,
      onChange: () => ComponentState,
      onValidityChange: (isValid: boolean) => void
    ) => {
      setComponents((prev) => [...prev, { name, onChange, onValidityChange }]);
    },
    []
  );

  const unregisterComponent = useCallback((name: string) => {
    setComponents((prev) =>
      prev.filter((component) => component.name !== name)
    );
  }, []);

  const validateAll = useCallback(() => {
    return components.reduce<{
      isValid: boolean;
      invalidComponents: Array<{
        value: string;
        onValidityChange: (isValid: boolean) => void;
      }>;
    }>(
      (acc, { onChange, onValidityChange }) => {
        const { value, isValid } = onChange();
        if (!isValid) {
          acc.isValid = false;
          acc.invalidComponents.push({ value, onValidityChange });
        }
        return acc;
      },
      { isValid: true, invalidComponents: [] }
    );
  }, [components]);

  const canSave = useCallback(() => {
    const { isValid } = validateAll();
    return isValid;
  }, [validateAll]);

  return { registerComponent, unregisterComponent, canSave };
};
