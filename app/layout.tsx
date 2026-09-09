import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { ThemeProvider, type Theme } from "@/components/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Agrani Technologies & Services Limited",
    template: "%s | Agrani Technologies",
  },
  description: "Innovative IT solutions, cloud architectures, and digital transformation systems.",
};

const themeInitScript = `
(function() {
  try {
    var match = document.cookie.match(/(?:^|;\\s*)agrani-theme=(light|dark)/);
    var stored = match ? match[1] : localStorage.getItem('agrani-theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    var d = document.documentElement;
    d.classList.remove('light', 'dark');
    d.classList.add(theme);
    d.setAttribute('data-theme', theme);
    d.style.colorScheme = theme;
  } catch(e) {}
})();
`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("agrani-theme")?.value;
  const initialTheme: Theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${initialTheme}`}
      data-theme={initialTheme}
      style={{ colorScheme: initialTheme }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
