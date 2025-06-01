"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import z from 'zod';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { registerSchema } from '../../schemas';

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

export const SignUpView = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    // Handle form submission
    console.log('Form submitted:', data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            className='flex flex-col gap-8 p-4 lg:p-16'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex items-center justify-between mb-8'>
              <Link href="/">
                <span className={cn('text-2xl', poppins.className)}>ShamsRoad</span>
              </Link>
            </div>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
};
