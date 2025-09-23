
import type { AppProps } from 'next/app'
import '../styles/globals.pcss'
import '../styles/utilities.pcss'

export default function LogLineApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
