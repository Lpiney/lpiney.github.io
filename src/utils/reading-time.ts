const stripMarkup = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');

export const countHan = (text: string) => (text.match(/\p{Script=Han}/gu) ?? []).length;

export const readingTime = (body: string) => {
  const text = stripMarkup(body);
  const han = countHan(text);
  const latinWords = (text.replace(/\p{Script=Han}/gu, ' ').match(/[A-Za-z][A-Za-z'’-]*/g) ?? []).length;
  return {
    zhMinutes: Math.max(1, Math.round(han / 400)),
    enMinutes: Math.max(1, Math.round(latinWords / 220)),
  };
};
