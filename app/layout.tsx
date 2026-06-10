import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClubProfileProvider } from "@/context/ClubProfileContext";
import { WatchAlongProvider } from "@/context/WatchAlongContext";
import { SessionProvider } from "next-auth/react";
import { PlayerProfile360Provider } from "@/context/PlayerProfile360Context";
import { GlobalSearchProvider } from "@/context/GlobalSearchContext";
import { AudioProvider } from "@/context/AudioContext";
import { AuthProvider } from "@/context/AuthContext";
import { VideoProvider } from "@/context/VideoContext";
import { PlaysProvider } from "@/context/PlaysContext";
import { ScriptsProvider } from "@/context/ScriptsContext";
import { LeaderboardProvider } from "@/context/LeaderboardContext";
import { AIChatProvider } from "@/context/AskAIChatContext";
import { WPLPlayerProfileProvider } from "@/context/Wplplayerprofilecontext";
import { FifaPlayerProfileProvider } from "@/context/FifaPlayerProfileContext";
import { ActivityProvider } from "@/context/ActivityContext"; // Import your Activity Context

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportsFan360",
  description: "Your Ultimate Sports Destination",
  icons: {
    icon: "/images/logo.png",
  },
};

const posthogScript = `
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p=t.createElement("script"),p.type="text/javascript",p.async=!0,p.src=s,r=t.getElementsByTagName("script")[0],r.parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getDoubleOptInConsent".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1}(document,window.posthog||[]);
  posthog.init('phc_AHSjFWHPMvbFSQaBGTTGAni9KjyVQyTvJDrwCSHY5kwa', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  });
`;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: posthogScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !p-0 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <AuthProvider>
            <ClubProfileProvider>
              <WatchAlongProvider>
                <PlayerProfile360Provider>
                  <GlobalSearchProvider>
                    <AudioProvider>
                      <LeaderboardProvider>
                        <ActivityProvider> {/* Placed here so it has access to Auth, session data, and logs correctly */}
                          <VideoProvider>
                            <PlaysProvider>
                              <ScriptsProvider>
                                <AIChatProvider>
                                  <WPLPlayerProfileProvider>
                                    <FifaPlayerProfileProvider>
                                      <main>{children}</main>
                                    </FifaPlayerProfileProvider>
                                  </WPLPlayerProfileProvider>
                                </AIChatProvider>
                              </ScriptsProvider>
                            </PlaysProvider>
                          </VideoProvider>
                        </ActivityProvider>
                      </LeaderboardProvider>
                    </AudioProvider>
                  </GlobalSearchProvider>
                </PlayerProfile360Provider>
              </WatchAlongProvider>
            </ClubProfileProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}