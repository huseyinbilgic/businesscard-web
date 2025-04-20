import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  label: string;
  type: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
};

export default function FormInput<T extends FieldValues>({
  label,
  type,
  name,
  register,
  error,
}: FormInputProps<T>) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...register(name)}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}