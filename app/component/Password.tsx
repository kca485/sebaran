import React, { useState } from 'react';
import supabase from '../data/data';

function Password() {
  const [newPassword, setNewPassword] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNewPassword(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { user, error } = await supabase.auth.update({ password: newPassword });
    if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <>
      <h1>Kata Sandi</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-password">Masukkan kata sandi baru:</label>
        <input type="text" name="new-password" id="new-password" onChange={handleChange} value={newPassword} />
        <button type="submit">Ok</button>
      </form>
    </>
  );
}

export default Password;
