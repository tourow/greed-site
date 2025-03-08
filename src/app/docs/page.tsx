"use client"

import { PageTransition } from "@/components/page-transition"

export default function DocsPage() {
  return (
    <PageTransition>
      <div className="bg-secondary/10 rounded-lg p-4 md:p-6 doc-content text-sm md:text-base">
        <h1>Introduction</h1>

        <p>
          Welcome to the Greed documentation! This guide will help you understand how to use Greed, a powerful Discord
          bot designed to enhance your server experience.
        </p>

        <p>
          Greed provides a wide range of features including moderation tools, utility commands, fun interactions, and
          much more. Whether you're a server owner, administrator, or member, Greed has something to offer for everyone.
        </p>

        <h2>What is Greed?</h2>

        <p>
          Greed is a versatile Discord bot built to help manage and enhance your Discord server. With an intuitive
          command system and powerful features, Greed makes server management easier while providing entertainment and
          utility for all server members.
        </p>

        <h2>Key Features</h2>

        <ul>
          <li>Powerful moderation tools to keep your server safe</li>
          <li>Utility commands for server information and management</li>
          <li>Fun commands to engage your community</li>
          <li>Customizable settings to fit your server's needs</li>
          <li>Regular updates with new features and improvements</li>
        </ul>

        <h2>Getting Started</h2>

        <p>
          To get started with Greed, you'll need to invite the bot to your server. Visit our{" "}
          <a href="/invite" className="text-primary hover:underline">
            invite page
          </a>{" "}
          to add Greed to your server.
        </p>

        <p>
          Once Greed is in your server, you can use the <code>/help</code> command to see a list of available commands.
          Check out the{" "}
          <a href="/docs/getting-started" className="text-primary hover:underline">
            Getting Started
          </a>{" "}
          guide for more detailed instructions.
        </p>

        <h2>Support</h2>

        <p>
          If you need help with Greed or have any questions, you can join our{" "}
          <a href="https://discord.gg/invite" className="text-primary hover:underline">
            support server
          </a>{" "}
          where our team and community can assist you.
        </p>
      </div>
    </PageTransition>
  )
}

