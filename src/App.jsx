import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import WebApp from '@twa-dev/sdk';
import { useTelegramTheme } from './hooks/useTelegramTheme';

function App() {
  const theme = useTelegramTheme();
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
              photo_url: tgUser.photo_url ? tgUser.photo_url : null,
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
    <div
      className="min-h-screen p-4 flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
      }}
    >
      <h1 className="p-4 text-4xl font-semibold">Welcome to Mini App! 👋</h1>
      {user ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-4 text-center">
          {user?.photo_url && (
            <img className="h-20 w-20 rounded" src={user.photo_url} alt="userImage" />
          )}

          <p>
            <strong>Ваш Telegram ID:</strong> {user.telegram_id}
          </p>
          <p>
            <strong>Имя:</strong> {user.first_name}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.last_name}
          </p>
          <p>
            <strong>Никнейм:</strong> @{user.username}
          </p>
          <p>
            <strong>Язык:</strong> {user.language_code}
          </p>
          {user.username && (
            <p>
              <strong>Перейти в профиль Telegram:</strong>{' '}
              <a
                href={`https://t.me/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                {`https://t.me/${user.username}`}
              </a>
            </p>
          )}
          <button
            className="px-4 py-2 rounded-xl shadow active:scale-95 transition duration-200"
            style={{
              backgroundColor: theme.button_color,
              color: theme.button_text_color,
            }}
          >
            Нажми на меня
          </button>
        </div>
      ) : (
        <p>Загрузка данных пользователя или данные недоступны...</p>
      )}
    </div>
  );
}

export default App;
