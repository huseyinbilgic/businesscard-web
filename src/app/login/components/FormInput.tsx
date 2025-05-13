import { OptionModel } from '@/app/forms/common/OptionModel';
import { Form } from 'react-bootstrap';
import { UseFormRegister, FieldValues, FieldError, Path } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'password' | 'email';
  options?: OptionModel[];
  isInvalid?: boolean;
  error?: FieldError;
  register: UseFormRegister<T>;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
};

export default function FormInput<T extends FieldValues>({
  name,
  label,
  type = 'text',
  options,
  isInvalid,
  error,
  register,
  as = 'input',
  rows = 3,
}: FormInputProps<T>) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {as === 'textarea' ? (
        <Form.Control
          as="textarea"
          rows={rows}
          {...register(name)}
          isInvalid={isInvalid}
        />
      ) : as === 'select' ? (
        <Form.Select {...register(name)} isInvalid={isInvalid}>
          <option value="">Select</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={type}
          {...register(name)}
          isInvalid={isInvalid}
        />
      )}
      {isInvalid && (
        <Form.Control.Feedback type="invalid">
        {error?.message?.split("\n").map((msg, i) => (
          <div key={i}>{msg.trim()}</div>
        ))}
      </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}