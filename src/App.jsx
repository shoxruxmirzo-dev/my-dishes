import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import WebApp from '@twa-dev/sdk';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const tgUser = WebApp.initDataUnsafe?.user;

      if (!tgUser) return;

      // Проверяем есть ли пользователь в supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single();

      if (existingUser) {
        setUser(existingUser);
      } else {
        // создаем нового пользователя
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              id: tgUser.id,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
              username: tgUser.username,
              language_code: tgUser.language_code,
            },
          ])
          .select()
          .single();

        if (!error) {
          setUser(data);
        }
      }
    };

    initUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="bg-white rounded 2xl shadow-lg p-6 w-80 text-center">
          <h1 className="text-xl font-bold">Привет, {user.first_name}</h1>
          <p className="text-gray-600">Ваш Telegram ID: {user.id}</p>
        </div>
      ) : (
        <p className="text-gray-600">Загрузка ...</p>
      )}
    </div>
  );
}

export default App;
