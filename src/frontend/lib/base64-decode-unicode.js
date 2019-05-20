export function base64DecodeUnicode(bytes) {
  return decodeURIComponent(
    atob(bytes)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}
