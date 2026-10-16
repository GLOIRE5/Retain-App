// Escapes special characters so user search text is treated literally in a regex
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
