export const formatDateToLocal = (dateStr: Date, locale: string = 'en-GB') => {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat(locale, options);

  return formatter.format(date);
};
