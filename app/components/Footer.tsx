export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center gap-1 pb-4 text-xs text-gray-500">
      <p>Made by</p>
      <a
        className="link"
        href="https://sjdonado.github.io"
        target="_blank"
        rel="noreferrer"
      >
        @sjdonado
      </a>
      <span>•</span>
      <a
        className="link"
        href="https://github.com/sjdonado/remix-dashboard"
        target="_blank"
        rel="noreferrer"
      >
        Source code
      </a>
    </footer>
  );
}
