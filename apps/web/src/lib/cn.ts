export const cn = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(' ');

export type ClassValue = Parameters<typeof cn>[number];
