import React from 'react';
import supabase from '../data/data';

function Login() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & {
      email: { value:string };
      password: { value:string };
    };

    const { user, error } = await supabase.auth.signIn({
      email: form.email.value,
      password: form.password.value,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Surel</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Kata sandi</label>
      <input type="password" name="password" id="password" />
      <button type="submit">Masuk</button>
    </form>
  );
}

export default Login;
