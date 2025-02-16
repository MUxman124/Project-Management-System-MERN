'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Input, Form, Checkbox, Button } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

// Zod schema remains the same
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must not exceed 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log(data)
      // Add your API call here
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-extrabold">Sign up</h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Create your account and join our community. Start your journey today.
                </p>
              </div>

              <Form.Item 
                validateStatus={errors.fullName ? "error" : ""} 
                help={errors.fullName?.message}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Full Name"
                  {...register('fullName')}
                />
              </Form.Item>

              <Form.Item 
                validateStatus={errors.email ? "error" : ""} 
                help={errors.email?.message}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  type="email"
                  {...register('email')}
                />
              </Form.Item>

              <Form.Item 
                validateStatus={errors.username ? "error" : ""} 
                help={errors.username?.message}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  {...register('username')}
                />
              </Form.Item>

              <Form.Item 
                validateStatus={errors.password ? "error" : ""} 
                help={errors.password?.message}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  {...register('password')}
                />
              </Form.Item>

              <Form.Item 
                validateStatus={errors.confirmPassword ? "error" : ""} 
                help={errors.confirmPassword?.message}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  {...register('confirmPassword')}
                />
              </Form.Item>

              <Form.Item 
                validateStatus={errors.terms ? "error" : ""} 
                help={errors.terms?.message}
              >
                <Checkbox {...register('terms')}>
                  I accept the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-full h-10"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </Form.Item>

              <p className="text-sm !mt-8 text-center text-gray-800">
                Already have an account?{' '}
                <a className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                  Sign in here
                </a>
              </p>
            </form>
          </div>

          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <Image
              src="https://readymadeui.com/login-image.webp"
              alt="Sign Up Image"
              width={800}
              height={400}
              className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}