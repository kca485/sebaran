import React from 'react';
import supabase from '../data/data';

function Login() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & {
      email: { value:string };
      password: { value:string };
    };

    const { user, error } = await supabase.auth.signIn(
      {
        email: form.email.value,
        password: form.password.value,
      },
      {
        redirectTo: 'https://sebaran.netlify.app/',
      },
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="mt-10 mx-4">
        <label htmlFor="email">Surel:</label>
        <input type="email" name="email" id="email" className="block mb-4 border-2" />
        <label htmlFor="password">Kata sandi:</label>
        <input type="password" name="password" id="password" className="block mb-4 border-2" />
        <button type="submit">Masuk</button>
      </form>
    </div>
  );
}

export default Login;
