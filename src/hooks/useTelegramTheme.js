import { useEffect, useState } from 'react';

export function useTelegramTheme() {
  const tg = window.Telegram.WebApp;
  const [theme, setTheme] = useState(tg.themeParams);

  useEffect(() => {
    const updateTheme = () => setTheme({ ...tg.themeParams });
    tg.onEvent('themeChanged', updateTheme);
    return () => tg.offEvent('themeChanged', updateTheme);
  }, []);

  return theme;
}
