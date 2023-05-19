import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { ReactNode, useState } from 'react'

import "~/styles/globals.css";
import Overseer from "components/overseer";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const getLayout = (Component as unknown as any).getLayout || ((page: ReactNode) => page);
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Overseer>
        {getLayout(<Component {...pageProps} />)}
      </Overseer>
    </SessionContextProvider>
  )
}
export default api.withTRPC(MyApp);
