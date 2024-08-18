"use client";

import '../../styles/Global.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../../lib/apolloClient'; // Correct path to lib/apolloClient
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RootLayout({ children, pageProps }: { children: React.ReactNode, pageProps: any }) {
  const apolloClient = useApollo(pageProps); // Call the useApollo function to get the client instance

  return (
    <ApolloProvider client={apolloClient}>
      <html lang="en">
        <body>
          <Header />  {/* This will be rendered on every page */}
          {children}  {/* This is where the content of each page will be rendered */}
          <Footer />  {/* This will be rendered on every page */}
        </body>
      </html>
    </ApolloProvider>
  );
}
