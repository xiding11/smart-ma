import { switchLanguage, useLocale } from '../lib/translations';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as 'en' | 'zh';
    if (nextLocale !== currentLocale) {
      switchLanguage(nextLocale);
    }
  }

  return (
    <select
      onChange={onSelectChange}
      value={currentLocale}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
        cursor: 'pointer'
      }}
    >
      <option value="en">🌐 English</option>
      <option value="zh">🌐 中文</option>
    </select>
  );
}
