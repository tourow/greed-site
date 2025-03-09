"use client"

import { PageTransition } from "@/components/page-transition"
import Link from "next/link"

export default function FAQPage() {
  return (
    <PageTransition>
      <div className="bg-secondary/10 rounded-lg p-4 md:p-6 doc-content text-sm md:text-base">
        <h1>Frequently Asked Questions</h1>

        <p>
          Here are answers to some of the most common questions about Greed.
        </p>

        <h2>"I thought Greed was free / Greed is paid now?"</h2>

        <p>
          No, Greed is not paid. The bot remains completely free to use with all its core features.
          You can optionally pay for premium features if you want additional functionality, but this is not required
          to use the bot.
        </p>

        <h2>"Greed is attacking our server/raiding"</h2>

        <p>
          This is very unlikely. What you're experiencing is most likely someone copying the Greed bot to raid your server.
          As part of Discord's new verification policy, any bot can get verified just by creating one. This means bad actors
          can create bots that look like legitimate ones.
        </p>

        <p>
          Always verify that you're inviting the official Greed bot by using our official website links or joining our
          support server for the authentic invite link.
        </p>

        <h2>"How do I know if I'm using the real Greed?"</h2>

        <p>
          The official Greed bot can only be invited from our website or official support server. Always check the bot ID
          and verify that you're using commands with our documented prefix. If you're suspicious about a bot claiming to be Greed,
          join our support server and ask for verification.
        </p>

        <h2>"What features are included in the free version?"</h2>

        <p>
          The free version of Greed includes all core functionality.
        </p>

        <h2>"What additional features do I get with premium?"</h2>

        <p>
          Premium subscribers get access to enhanced features like reskinning, ai, and more.
          You can see the full list of features on the <Link href="/premium">premium page</Link>.
        </p>
      </div>
    </PageTransition>
  )
}
