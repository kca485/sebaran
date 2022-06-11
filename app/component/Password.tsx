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
    <div className="flex justify-center">
      <div className="mt-10 mx-4">
        <h1 className="text-2xl">Kata Sandi</h1>
        <form onSubmit={handleSubmit} className="max-w-md mt-4">
          <label htmlFor="new-password">Masukkan kata sandi baru:</label>
          <input
            type="text"
            name="new-password"
            id="new-password"
            onChange={handleChange}
            value={newPassword}
            className="block mb-4 border-2"
          />
          <button type="submit">Simpan</button>
        </form>
      </div>
    </div>
  );
}

export default Password;
