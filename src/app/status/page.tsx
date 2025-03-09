"use client"

import { CheckCircle, Clock, Server, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getShards, getTotalStats, getCachedShards, getOutages, type ShardData, type Outage } from "@/lib/api/shards"
import { SlotMachineCounter } from "@/components/slot-machine-counter"

export default function StatusPage() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    servers: 0,
    users: 0,
    averageLatency: 0,
    shardCount: 0
  })
  const [shards, setShards] = useState<ShardData[]>([])
  const [outages, setOutages] = useState<Outage[]>([])
  const [statusState, setStatusState] = useState<'operational' | 'degraded' | 'down'>('operational')
  const [usingCachedData, setUsingCachedData] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        setUsingCachedData(false);
        
        // Fetch shards data
        let shardsData: ShardData[] = [];
        try {
          shardsData = await getShards();
        } catch (error) {
          console.error('Failed to fetch fresh shard data, using cache:', error);
          shardsData = getCachedShards();
          if (shardsData.length > 0) {
            setUsingCachedData(true);
          } else {
            throw error; // Re-throw if no cached data
          }
        }
        
        const totalStats = getTotalStats(shardsData);
        
        // Sort shards by shard number
        const sortedShards = [...shardsData].sort((a, b) => a.shard - b.shard);
        
        setShards(sortedShards);
        setStats({
          servers: totalStats.servers,
          users: totalStats.users,
          averageLatency: totalStats.averageLatency,
          shardCount: totalStats.shardCount
        });
        
        // Fetch outages (this won't throw even if API is down)
        const outagesData = await getOutages();
        setOutages(outagesData);
        
        // Determine status based on latency, shard count, and outages
        if (usingCachedData || shardsData.length === 0) {
          setStatusState('down');
        } else if (outagesData.some(o => o.status !== 'resolved') || 
                  totalStats.averageLatency > 80 || 
                  shardsData.some(shard => shard.latency > 80)) {
          setStatusState('degraded');
        } else {
          setStatusState('operational');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to fetch stats');
        setStatusState('down');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Set up periodic refresh (every 10 seconds)
    const refreshInterval = setInterval(() => {
      fetchStats();
    }, 10000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/docs", label: "Documentation" },
    { href: "/status", label: "Status", isActive: pathname === "/status" },
  ]

  const getStatusIcon = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'All systems operational';
      case 'degraded':
        return 'Some systems experiencing issues';
      case 'down':
        return 'Systems are down';
    }
  };

  const getOutageStatusColor = (status: Outage['status']) => {
    switch (status) {
      case 'investigating':
        return 'text-yellow-500';
      case 'identified':
        return 'text-orange-500';
      case 'monitoring':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-white';
    }
  };

  const formatOutageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-white/10 p-4 sticky top-0 bg-black/90 backdrop-blur-sm z-10">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <RotatingMoonLogo size={24} />
              <span className="font-bold text-xl">Greed</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Home
              </Link>
              <Link href="/commands" className="hover:text-white/80 transition-colors">
                Commands
              </Link>
              <Link href="/tools/embed" className="hover:text-white/80 transition-colors">
                Embed Builder
              </Link>
              <Link href="/status" className="text-primary hover:text-white/80 transition-colors">
                Status
              </Link>
            </nav>
            <div className="hidden md:block">
              <Link href="/invite" className="nav-button">
                Add to Discord
              </Link>
            </div>
            <MobileMenu items={navItems} />
          </div>
        </header>

        <main className="container mx-auto py-4 md:py-8 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-4 md:mb-8"
          >
            System Status
          </motion.h1>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <div className="text-center">
                <RotatingMoonLogo size={48} animated={true} />
                <p className="mt-4 text-white/70">Loading status information...</p>
              </div>
            </motion.div>
          ) : error && !usingCachedData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 rounded-lg p-4 md:p-6 text-center"
            >
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Error Loading Status</h2>
              <p className="text-white/70">{error}</p>
            </motion.div>
          ) : (
            <>
              {usingCachedData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-500/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    <p className="text-sm md:text-base">
                      Showing cached data. Unable to connect to the API for fresh data.
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8"
              >
                <motion.div variants={item} className="bg-secondary/10 rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <h2 className="text-base md:text-lg font-medium">Bot Status</h2>
                    {getStatusIcon(statusState)}
                  </div>
                  <p className="text-white/70 text-sm md:text-base">{getStatusText(statusState)}</p>
                </motion.div>

                <motion.div variants={item} className="bg-secondary/10 rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <h2 className="text-base md:text-lg font-medium">API Status</h2>
                    {usingCachedData ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      getStatusIcon(
                        stats.averageLatency > 80 || shards.some(shard => shard.latency > 80)
                          ? 'degraded'
                          : 'operational'
                      )
                    )}
                  </div>
                  <p className="text-white/70 text-sm md:text-base">
                    {usingCachedData 
                      ? 'API connection issues' 
                      : stats.averageLatency > 80 || shards.some(shard => shard.latency > 80)
                        ? 'API experiencing high latency'
                        : 'All endpoints responding normally'}
                  </p>
                </motion.div>

                <motion.div variants={item} className="bg-secondary/10 rounded-lg p-4 md:p-6 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <h2 className="text-base md:text-lg font-medium">Website Status</h2>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-white/70 text-sm md:text-base">Website fully operational</p>
                </motion.div>
              </motion.div>

              {outages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-secondary/10 rounded-lg p-4 md:p-6 mb-4 md:mb-8"
                >
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Current Outages</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    {outages
                      .filter(outage => outage.status !== 'resolved')
                      .map(outage => (
                        <div key={outage.id} className="bg-black/30 rounded-lg p-3 md:p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{outage.title}</h3>
                            <span className={`text-sm ${getOutageStatusColor(outage.status)}`}>
                              {outage.status.charAt(0).toUpperCase() + outage.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 mb-2">{outage.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {outage.affectedComponents.map((component, index) => (
                              <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded">
                                {component}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-white/50">
                            Updated: {formatOutageDate(outage.updatedAt)}
                          </p>
                        </div>
                      ))}
                      
                    {outages.filter(outage => outage.status !== 'resolved').length === 0 && (
                      <p className="text-white/70 text-sm md:text-base">No active outages at this time.</p>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-secondary/10 rounded-lg p-4 md:p-6 mb-4 md:mb-8"
              >
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Performance Metrics</h2>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
                >
                  <motion.div variants={item} className="bg-black/30 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <h3 className="font-medium text-sm md:text-base">Response Time</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">
                      <SlotMachineCounter value={stats.averageLatency} /> ms
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Average latency</p>
                  </motion.div>

                  <motion.div variants={item} className="bg-black/30 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <Server className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <h3 className="font-medium text-sm md:text-base">Shards</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">
                      <SlotMachineCounter value={stats.shardCount} />
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Active shards</p>
                  </motion.div>

                  <motion.div variants={item} className="bg-black/30 rounded-lg p-3 md:p-4 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <RotatingMoonLogo size={16} className="md:w-5 md:h-5" />
                      <h3 className="font-medium text-sm md:text-base">Active Servers</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">
                      <SlotMachineCounter value={stats.servers} />
                    </p>
                    <p className="text-xs md:text-sm text-white/70">Currently connected</p>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-secondary/10 rounded-lg p-4 md:p-6"
              >
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Shard Status</h2>

                <div className="space-y-4">
                  {shards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shards.map((shard) => (
                        <div key={shard.shard} className="bg-black/30 rounded-lg p-3 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Shard #{shard.shard}</h3>
                            <div className={`w-2 h-2 rounded-full ${
                              shard.latency < 80 ? 'bg-green-500' : 
                              shard.latency < 200 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-white/60">Latency</p>
                              <p className={`font-medium ${
                                shard.latency < 80 ? 'text-white' : 
                                shard.latency < 200 ? 'text-yellow-500' : 
                                'text-red-500'
                              }`}>{shard.latency}ms</p>
                            </div>
                            <div>
                              <p className="text-white/60">Servers</p>
                              <p className="font-medium">{shard.servers}</p>
                            </div>
                            <div>
                              <p className="text-white/60">Users</p>
                              <p className="font-medium">{shard.users.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-b border-white/10 pb-3 md:pb-4">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <h3 className="font-medium text-sm md:text-base">No shards available</h3>
                      </div>
                      <p className="text-xs md:text-sm text-white/70">
                        Unable to retrieve shard information at this time.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {outages.filter(outage => outage.status === 'resolved').length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-secondary/10 rounded-lg p-4 md:p-6 mt-4 md:mt-8"
                >
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Resolved Outages</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    {outages
                      .filter(outage => outage.status === 'resolved')
                      .slice(0, 5) // Show only the 5 most recent resolved outages
                      .map(outage => (
                        <div key={outage.id} className="bg-black/30 rounded-lg p-3 md:p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{outage.title}</h3>
                            <span className="text-sm text-green-500">Resolved</span>
                          </div>
                          <p className="text-sm text-white/70 mb-2">{outage.description}</p>
                          <p className="text-xs text-white/50">
                            Resolved on: {formatOutageDate(outage.updatedAt)}
                          </p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                Detailed Status
              </motion.h2>
            </>
          )}
        </main>
      </div>
    </PageTransition>
  )
}

