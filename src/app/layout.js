import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./provider";
import Footer from "./_components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Neat Code",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Footer />
      </body>
    </html>
  );
}
