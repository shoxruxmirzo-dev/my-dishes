import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import WebApp from '@twa-dev/sdk';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    WebApp.ready();
    console.log('initDataUnsafe:', WebApp.initDataUnsafe);

    const initUser = async () => {
      const tgUser = WebApp.initDataUnsafe?.user;

      if (!tgUser) {
        console.warn('Нет данных о пользователе из Telegram');
        return;
      }

      // Проверяем есть ли пользователь в supabase
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single();

      if (selectError) {
        console.error('Ошибка при select:', selectError);
        return;
      }

      if (existingUser) {
        console.log('Найден в базе:', existingUser);
        setUser(existingUser);
      } else {
        // создаем нового пользователя
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              telegram_id: tgUser.id,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
              username: tgUser.username,
              language_code: tgUser.language_code,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Ошибка при insert:', insertError);
        } else {
          console.log('Создан новый пользователь', data);
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
          <p className="text-gray-600">Ваш Telegram ID: {user.telegram_id}</p>
        </div>
      ) : (
        <p className="text-gray-600">Загрузка ...</p>
      )}
    </div>
  );
}

export default App;
