"use client"

import { PageTransition } from "@/components/page-transition"

export default function GettingStartedPage() {
  return (
    <PageTransition>
      <div className="bg-secondary/10 rounded-lg p-4 md:p-6 doc-content text-sm md:text-base">
        <h1>Getting Started with Greed</h1>

        <p>
          This guide will help you get started with Greed, covering the basic setup and essential commands
          to make the most out of the bot in your Discord server.
        </p>

        <h2>Basic Information</h2>
        
        <p>
          Greed's default prefix is set to <code>,</code> (comma) and/or pinging the bot. All commands can be triggered using this prefix
          followed by the command name.
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-md p-4 my-4">
          <p className="font-medium mb-2">Important Setup Note:</p>
          <p>
            Ensure the bot's role is within the guild's top 5 roles for Greed to function correctly.
            This is necessary for proper permission handling.
          </p>
        </div>

        <h2>Changing the Prefix</h2>
        
        <p>
          If you want to customize the command prefix, you can use:
        </p>
        
        <pre className="bg-black/50 p-3 rounded-md my-3 overflow-x-auto">
          <code>,prefix (your-new-prefix)</code>
        </pre>
        
        <p>
          Replace <code>(your-new-prefix)</code> with your desired prefix.
        </p>

        <h2>Essential Setup Commands</h2>
        
        <p>
          Here are some important commands to help you set up Greed in your server:
        </p>

        <div className="space-y-4 my-4">
          <div className="border border-primary/20 rounded-md p-4">
            <h3 className="text-primary font-medium mb-2">,setup</h3>
            <p>Creates a jail and log channel along with the jail role</p>
          </div>
          
          <div className="border border-primary/20 rounded-md p-4">
            <h3 className="text-primary font-medium mb-2">,voicemaster setup</h3>
            <p>Creates join to create voice channels</p>
          </div>
          
          <div className="border border-primary/20 rounded-md p-4">
            <h3 className="text-primary font-medium mb-2">,filter setup</h3>
            <p>Initializes a setup for automod to moderate</p>
          </div>
          
          <div className="border border-primary/20 rounded-md p-4">
            <h3 className="text-primary font-medium mb-2">,antinuke setup</h3>
            <p>Creates the antinuke setup to keep your server safe</p>
          </div>
        </div>

        <h2>Next Steps</h2>
        
        <p>
          After completing the basic setup, explore more of Greed's features through our documentation.
          You can also use <code>,help</code> to see a list of all available commands directly in Discord.
        </p>
        
        <p>
          If you need assistance, join our{" "}
          <a href="https://discord.gg/greedbot" className="text-primary hover:underline">
            support server
          </a>{" "}
          where our team can help you with any questions.
        </p>
      </div>
    </PageTransition>
  )
}
