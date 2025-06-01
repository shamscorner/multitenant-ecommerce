"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

import { loginSchema } from '../../schemas';

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

export const SignInView = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const loginMutation = useMutation(trpc.auth.login.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push('/');
    }
  }));

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
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
              <Button
                asChild
                variant="neutral"
                size="sm"
              >
                <Link href="/sign-up" prefetch>Sign up</Link>
              </Button>
            </div>

            <h1 className="text-4xl font-medium">
              Welcome back to ShamsRoad!
            </h1>

            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={loginMutation.isPending}
            >
              Login
            </Button>
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
