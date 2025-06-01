"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

import { registerSchema } from '../../schemas';

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

export const SignUpView = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const registerMutation = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
      toast.success('Account created successfully!');
      router.push('/');
    }
  }));

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  const username = form.watch('username');
  const usernameErrors = form.formState.errors.username;

  const showPreview = username && !usernameErrors;

  const AUTH_BACKGROUND_IMAGE = '/auth-bg.png';

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
                <Link href="/sign-in" prefetch>Sign in</Link>
              </Button>
            </div>

            <h1 className="text-4xl font-medium">
              Join over 2000+ creators and start earning money on ShamsRoad
            </h1>

            <FormField
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter your username'
                      autoFocus
                      spellCheck='false'
                    />
                  </FormControl>
                  <FormDescription className={cn('hidden', showPreview && 'block')}>
                  {/* TODO: use proper method to generate preview url later */}
                    Your store will be available at &nbsp;
                    <strong>{username}</strong>.shop.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      autoComplete='email'
                      placeholder='Enter your email address'
                      autoFocus
                      spellCheck='false'
                      inputMode='email'
                    />
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
                    <Input
                      {...field}
                      type='password'
                      placeholder='Enter your password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={registerMutation.isPending}
            >
              Create account
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: `url('${AUTH_BACKGROUND_IMAGE}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
};
