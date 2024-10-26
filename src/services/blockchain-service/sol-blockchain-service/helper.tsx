export const handleGetErrorMessage = (logs: string[], getLabel: any) => {
  const errorMessagePrefix = 'Error Message: ';

  for (const log of logs) {
    if (log.includes('insufficient lamports')) {
      return getLabel('msgNotEnoughLamportsSol');
    }

    const startIndex = log.indexOf(errorMessagePrefix);
    if (startIndex !== -1) {
      const endIndex = log.indexOf('.', startIndex);
      return log
        .substring(
          startIndex + errorMessagePrefix.length,
          endIndex === -1 ? log.length : endIndex,
        )
        .trim();
    }
  }

  return undefined;
};
