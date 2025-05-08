'use client';

import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import Navbar from "./components/layout/Navbar";
import { store } from "@/store";
import Footer from "./components/layout/Footer";
import BootstrapClient from "./common/BootstrapClient";
import AuthInitializer from "./common/AuthInitializer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient />
        <Provider store={store}>
          <AuthInitializer>
            <header>
              <Navbar />
            </header>

            <main>
              {children}
            </main>

            <footer >
              <Footer />
            </footer>
          </AuthInitializer>
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
