import { useRouter } from 'next/router';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.push(router.asPath, router.asPath, { locale: nextLocale });
    });
  }

  return (
    <select onChange={onSelectChange} defaultValue={router.locale || 'en'} disabled={isPending}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
}
