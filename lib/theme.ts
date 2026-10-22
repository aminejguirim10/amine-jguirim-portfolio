export const THEME_KEY = "por-theme";

export const themeScript = `(function(){try{
var k='${THEME_KEY}';
var s=localStorage.getItem(k);
var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark',d);
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})()`;

export function toggleTheme() {
  const root = document.documentElement;
  const dark = root.classList.toggle("dark");
  root.style.colorScheme = dark ? "dark" : "light";

  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
  }
}