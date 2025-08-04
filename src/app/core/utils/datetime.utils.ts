function toLocaleDateString(datetime: string) {
  return new Date(datetime).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export const DatetimeUtils = {
  toLocaleDateString,
};
