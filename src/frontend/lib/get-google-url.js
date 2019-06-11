export default function getGoogleUrl(sentence) {
  if (!sentence || sentence === "") {
    throw new Error("'sentence' argument to getGoogleUrl needs to be a string with a value");
  }
  return `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
}
