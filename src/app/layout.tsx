'use client';

import "./globals.css";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import Navbar from "./components/layout/Navbar";
import { store } from "@/store";
import Footer from "./components/layout/Footer";
import BootstrapClient from "./common/bootstrap-client";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BootstrapClient/>
        <Provider store={store}>
          <header>
            <Navbar />
          </header>
          <main>
            {children}
          </main>

          <footer >
            <Footer />
          </footer>
        </Provider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={true}
          closeButton={true}
        />
      </body>
    </html>
  );
}
