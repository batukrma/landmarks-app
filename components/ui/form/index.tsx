'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ComponentRef } from 'react';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Slot
      ref={ref}
      className={cn(
        'text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-red-500',
        className
      )}
      id={formItemId}
      {...props}
    >
      <span>
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </Slot>
  );
});
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-xs text-gray-500', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-xs font-medium text-red-500', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus-visible:border-red-500',
        className
      )}
      ref={ref}
      id={formItemId}
      {...props}
    />
  );
});
FormInput.displayName = 'FormInput';

const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus-visible:border-red-500',
        className
      )}
      ref={ref}
      id={formItemId}
      {...props}
    />
  );
});
FormTextarea.displayName = 'FormTextarea';

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, options, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:border-red-500',
          className
        )}
        ref={ref}
        id={formItemId}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
FormSelect.displayName = 'FormSelect';

const FormCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className={cn(
          'peer h-4 w-4 appearance-none rounded border border-gray-200 bg-white transition-all checked:border-[#FF252C] checked:bg-[#FF252C] focus-visible:outline-none focus-visible:border-gray-400',
          error && 'border-red-500',
          className
        )}
        ref={ref}
        id={formItemId}
        {...props}
      />
      <svg
        className="pointer-events-none absolute left-0 top-0 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
});
FormCheckbox.displayName = 'FormCheckbox';

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
};
