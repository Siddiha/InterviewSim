import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormProps<T> {
  initialValues: T;
  validationSchema?: z.ZodType<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const handleChange = useCallback(
    (name: keyof T) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setState((prev) => ({
          ...prev,
          values: { ...prev.values, [name]: value },
          touched: { ...prev.touched, [name]: true },
        }));
      },
    []
  );

  const validate = useCallback(
    (values: T) => {
      if (!validationSchema) return {};

      try {
        validationSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors.reduce((acc, curr) => {
            const path = curr.path[0] as keyof T;
            if (path) {
              acc[path] = curr.message;
            }
            return acc;
          }, {} as Record<keyof T, string>);
        }
        return {};
      }
    },
    [validationSchema]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const errors = validate(state.values);
      setState((prev) => ({ ...prev, errors }));

      if (Object.keys(errors).length === 0) {
        setState((prev) => ({ ...prev, isSubmitting: true }));
        try {
          await onSubmit(state.values);
        } finally {
          setState((prev) => ({ ...prev, isSubmitting: false }));
        }
      }
    },
    [state.values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  // Helper to get validation error message for a specific field
  const getError = useCallback(
    (name: keyof T) => state.errors[name],
    [state.errors]
  );

  // Helper to check if a field has been touched and has an error
  const hasError = useCallback(
    (name: keyof T) => !!(state.touched[name] && state.errors[name]),
    [state.touched, state.errors]
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    getError,
    hasError,
    validate: () =>
      setState((prev) => ({ ...prev, errors: validate(prev.values) })), // Manual validation trigger
  };
}
