export function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      try {
        var localTheme = window.localStorage.getItem('theme');
        if (localTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (localTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      } catch (_) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
}
