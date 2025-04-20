'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from './FormInput';
import { registerUser } from '../../../../lib/auth';

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email.')
    .max(255, 'Must be at most 255 characters.')
    .matches(/^\S+$/, 'Email cannot contain spaces!')
    .required('Email is required'),

  username: yup
    .string()
    .max(255, 'Must be at most 255 characters.')
    .matches(/^\S+$/, 'Username cannot contain spaces!')
    .required('Username is required'),

  password: yup
    .string()
    .matches(/^\S+$/, 'Password cannot contain spaces!')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .matches(/^\S+$/, 'Password cannot contain spaces!')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode : 'all',
    resolver: yupResolver(schema),
  });

  const submitRegisterUser = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerUserRequest }: RegisterFormData & { confirmPassword: string } = data;
    try {
      const response = await registerUser(registerUserRequest);
      console.log('Kayıt başarılı:', response);
      
    } catch (error) {
      console.error('Kayıt başarısız:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitRegisterUser)}>
      <FormInput<RegisterFormData>
        label="Email address"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
      />
      <FormInput<RegisterFormData>
        label="Username"
        type="text"
        name="username"
        register={register}
        error={errors.username?.message}
      />
      <FormInput<RegisterFormData>
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password?.message}
      />
      <FormInput<RegisterFormData>
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword?.message}
      />
      <button type="submit" className="btn btn-primary w-100">
        Register
      </button>
    </form>
  );
}
