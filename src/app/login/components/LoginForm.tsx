'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from './FormInput';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
};

const schema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .max(255, 'Must be at most 255 characters.')
    .matches(/^\S+$/, 'Username or email cannot contain spaces!')
    .required('Username or email is required'),

  password: yup
    .string()
    .matches(/^\S+$/, 'Password cannot contain spaces!')
    .required('Password is required.'),
});

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      console.log('Kayıt başarılı:', response);
      router.push('/')

    } catch (error) {
      console.error('Kayıt başarısız:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput<LoginFormData>
        label="Email address or Username"
        type="text"
        name="usernameOrEmail"
        register={register}
        error={errors.usernameOrEmail?.message}
      />
      <FormInput<LoginFormData>
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password?.message}
      />
      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
}
