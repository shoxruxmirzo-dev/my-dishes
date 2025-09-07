import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import WebApp from '@twa-dev/sdk';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('initDataUnsafe:', WebApp.initDataUnsafe);

    const initUser = async () => {
      const tgUser = WebApp.initDataUnsafe && WebApp.initDataUnsafe.user;

      if (!tgUser) {
        console.log(
          'Данные пользователя недоступны. Убедитесь, что вы находитесь в контексте веб-приложения Telegram.'
        );
        return;
      }

      // Проверяем есть ли пользователь в supabase
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .maybeSingle();

      if (selectError) {
        console.error('Ошибка при select:', selectError);
        return;
      }

      if (existingUser) {
        console.log('Найден в базе:', existingUser);
        setUser(existingUser);
      } else {
        // Создаем нового пользователя
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
    <div className="min-h-screen p-4 text-center text-white">
      <header>
        <h1 className="p-4 text-4xl font-semibold">Welcome to your Mini App! 👋</h1>
        {user ? (
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center">
            <p>
              <strong>Ваш Telegram ID:</strong> {user.telegram_id}
            </p>
            <p>
              <strong>Имя:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Никнейм:</strong> @{user.username}
            </p>
            <p>
              <strong>Язык:</strong> {user.language_code}
            </p>
          </div>
        ) : (
          <p>Загрузка данных пользователя или данные недоступны...</p>
        )}
      </header>
    </div>
  );
}

export default App;
