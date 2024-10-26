export const convertSecondsToDayHourMinute = (seconds: number) => {
  const minute = Math.ceil(seconds / 60);
  const hour = Math.ceil(seconds / 3600);
  const day = Math.ceil(seconds / (3600 * 24));
  const month = Math.ceil(seconds / (3600 * 24 * 30));
  const exactDays = seconds / (3600 * 24);
  return { minute, hour, day, month, exactDays };
};

export const convertTimeToDayHourMinute = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  const daysStr = days > 0 ? `${days}d` : '';

  return `${daysStr} ${hours}h ${minutes}m`.trim();
};
