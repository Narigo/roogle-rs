export default function useRustCommand(cmd) {
  return text => {
    window.external.invoke(JSON.stringify({ cmd, text }));
  };
}
