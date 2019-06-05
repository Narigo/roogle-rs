export default function getGoogleUrl(sentence) {
  return `https://www.google.de/search?q=${encodeURIComponent(sentence)}`;
}
