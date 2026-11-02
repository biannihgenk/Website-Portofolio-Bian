"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PacketLog {
  id: number;
  time: string;
  source: string;
  dest: string;
  protocol: string;
  bytes: number;
  status: "OK" | "FORWARDED" | "ROUTED";
}

export function CurrentlyExploringBento() {
  const [activeTab, setActiveTab] = useState<"topology" | "containers" | "ai_bench">("topology");
  const [isPinging, setIsPinging] = useState(false);
  const [packetCount, setPacketCount] = useState(148);
  const [rxBytes, setRxBytes] = useState(842.6);
  const [logs, setLogs] = useState<PacketLog[]>([
    { id: 1, time: "17:42:01", source: "192.168.10.15", dest: "1.1.1.1", protocol: "ICMP", bytes: 64, status: "OK" },
    { id: 2, time: "17:42:04", source: "192.168.10.15", dest: "10.192.37.1", protocol: "OSPF", bytes: 128, status: "ROUTED" },
    { id: 3, time: "17:42:08", source: "192.168.10.15", dest: "api.supabase.co", protocol: "HTTPS", bytes: 512, status: "FORWARDED" },
  ]);

  // Containers mock state
  const [containers] = useState([
    { name: "nginx-ingress-proxy", image: "nginx:alpine", port: "80:443", cpu: "1.4%", ram: "48 MB", status: "running", uptime: "18d 04h" },
    { name: "mikrotik-api-watcher", image: "python:3.11-slim", port: "8728", cpu: "3.2%", ram: "64 MB", status: "running", uptime: "12d 16h" },
    { name: "portfolio-nextjs-app", image: "node:20-alpine", port: "3000", cpu: "4.8%", ram: "142 MB", status: "running", uptime: "5d 08h" },
    { name: "ollama-ai-inference", image: "ollama:latest", port: "11434", cpu: "8.5%", ram: "1.2 GB", status: "running", uptime: "2d 01h" },
  ]);

  // AI inference demo state
  const [aiPrompt, setAiPrompt] = useState("Jelaskan perbedaan mendasar BGP dan OSPF secara ringkas!");
  const [aiOutput, setAiOutput] = useState("");
  const [isInferencing, setIsInferencing] = useState(false);

  // Ping packet trigger
  const handleTriggerPing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPacketCount((prev) => prev + 1);
    setRxBytes((prev) => +(prev + 0.12).toFixed(2));

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    setTimeout(() => {
      setLogs((prev) => [
        {
          id: Date.now(),
          time: timeStr,
          source: "192.168.10.15 (Client)",
          dest: "10.0.0.1 (RouterOS)",
          protocol: "ICMP ECHO",
          bytes: 64,
          status: "OK",
        },
        ...prev.slice(0, 4),
      ]);
      setIsPinging(false);
    }, 1200);
  };

  // Run AI inference simulation
  const handleRunAi = () => {
    if (isInferencing) return;
    setIsInferencing(true);
    setAiOutput("");

    const answer =
      "OSPF adalah protokol Interior Gateway (IGP) berbasis algoritma link-state yang bekerja cepat di dalam satu Autonomous System (AS). Sedangkan BGP adalah Exterior Gateway Protocol (EGP) berbasis path-vector yang menghubungkan antar AS di internet dengan routing kebijakan (policy-based routing) berskala global.";

    let i = 0;
    const interval = setInterval(() => {
      if (i < answer.length) {
        setAiOutput(answer.slice(0, i + 1));
        i += 3;
      } else {
        setAiOutput(answer);
        setIsInferencing(false);
        clearInterval(interval);
      }
    }, 30);
  };

  return (
    <section className="flex flex-col gap-6 w-full" id="vocational-lab-station">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ded8cb]">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-[#2563eb] uppercase tracking-wider bg-[#dbeafe] px-3 py-1 rounded-full border border-[#bfdbfe]">
              LAB SIMULATOR • INTERACTIVE STATION
            </span>
            <span className="font-mono text-xs text-[#686660]">
              SMK TELKOM MALANG
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold tracking-tight">
            Workstation &amp; Eksplorasi Lab Vokasi
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#686660] max-w-2xl mt-1 leading-relaxed">
            Eksplorasi interaktif protokol jaringan, telemetri server Linux, dan uji inferensi sistem cerdas yang sedang dipelajari langsung di lab.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-[#f5f2ea] rounded-2xl border border-[#ded8cb] shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("topology")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "topology"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#686660] hover:text-[#222222]"
            }`}
          >
            <span>📡</span> Topologi &amp; Routing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("containers")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "containers"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#686660] hover:text-[#222222]"
            }`}
          >
            <span>🖥️</span> Linux Containers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai_bench")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "ai_bench"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#686660] hover:text-[#222222]"
            }`}
          >
            <span>🧠</span> AI &amp; Web Engine
          </button>
        </div>
      </div>

      {/* Main Interactive Workstation Canvas */}
      <div className="bg-white rounded-3xl border border-[#ded8cb] p-6 sm:p-8 shadow-scrapbook relative overflow-hidden">
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* TAB 1: TOPOLOGY & PACKET FLOW SIMULATOR */}
          {activeTab === "topology" && (
            <motion.div
              key="topology"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Interactive Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#222222]">
                      Simulasi Alur Paket Data Jaringan
                    </h3>
                    <p className="font-mono text-xs text-[#686660]">
                      Protokol: IPv4 • Subnet 192.168.10.0/24 • OSPF Area 0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-4 px-3 py-1.5 bg-white rounded-xl border border-[#ded8cb] font-mono text-xs">
                    <div>
                      <span className="text-[#686660]">Packets: </span>
                      <span className="font-bold text-[#2563eb]">{packetCount}</span>
                    </div>
                    <div>
                      <span className="text-[#686660]">RX/TX: </span>
                      <span className="font-bold text-emerald-600">{rxBytes} KB</span>
                    </div>
                    <div>
                      <span className="text-[#686660]">Latency: </span>
                      <span className="font-bold text-[#222222]">1.4ms</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleTriggerPing}
                    disabled={isPinging}
                    className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{isPinging ? "Mengirim Paket..." : "⚡ Kirim Test Packet (Ping)"}</span>
                  </motion.button>
                </div>
              </div>

              {/* Topology Nodes Diagram */}
              <div className="relative w-full py-10 px-4 bg-[#f8f6f0] rounded-2xl border border-[#ded8cb] overflow-hidden">
                {/* Visual Connection Cable Line */}
                <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-gradient-to-r from-[#2563eb]/20 via-[#2563eb]/50 to-[#2563eb]/20 z-0" />

                {/* Animated Packet traversing the cable when isPinging */}
                {isPinging && (
                  <motion.div
                    initial={{ left: "8%" }}
                    animate={{ left: "92%" }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2563eb] shadow-[0_0_12px_#2563eb] z-20 flex items-center justify-center text-[8px] text-white font-bold"
                  >
                    ●
                  </motion.div>
                )}

                {/* 4 Key Nodes in the Lab Topology */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {/* Node 1: Client PC */}
                  <div className="bg-white p-4 rounded-xl border border-[#ded8cb] shadow-xs flex flex-col items-center text-center gap-2 group hover:border-[#2563eb] transition-all">
                    <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-xl">
                      💻
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#686660]">NODE 01</span>
                      <h4 className="font-serif text-sm font-bold text-[#222222]">Client Workstation</h4>
                      <span className="font-mono text-[10px] text-[#2563eb] font-semibold">192.168.10.15</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Link UP (1 Gbps)
                    </span>
                  </div>

                  {/* Node 2: Managed Switch */}
                  <div className="bg-white p-4 rounded-xl border border-[#ded8cb] shadow-xs flex flex-col items-center text-center gap-2 group hover:border-[#2563eb] transition-all">
                    <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#4338ca] flex items-center justify-center text-xl">
                      🔀
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#686660]">NODE 02</span>
                      <h4 className="font-serif text-sm font-bold text-[#222222]">VLAN Switch 8-Port</h4>
                      <span className="font-mono text-[10px] text-[#4338ca] font-semibold">VLAN 10 • TRUNK</span>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                      802.1Q Active
                    </span>
                  </div>

                  {/* Node 3: MikroTik RouterOS */}
                  <div className="bg-white p-4 rounded-xl border border-[#ded8cb] shadow-xs flex flex-col items-center text-center gap-2 group hover:border-[#2563eb] transition-all relative">
                    <div className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#2563eb] text-white font-mono text-[9px] font-bold rounded">
                      CORE
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-xl">
                      📡
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#686660]">NODE 03</span>
                      <h4 className="font-serif text-sm font-bold text-[#222222]">MikroTik RouterOS</h4>
                      <span className="font-mono text-[10px] text-[#2563eb] font-semibold">RB750Gr3 Gateway</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 text-[#1e40af] px-2 py-0.5 rounded-full border border-blue-200">
                      NAT / OSPF Running
                    </span>
                  </div>

                  {/* Node 4: Gateway / Cloud */}
                  <div className="bg-white p-4 rounded-xl border border-[#ded8cb] shadow-xs flex flex-col items-center text-center gap-2 group hover:border-[#2563eb] transition-all">
                    <div className="w-12 h-12 rounded-xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center text-xl">
                      🌐
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#686660]">NODE 04</span>
                      <h4 className="font-serif text-sm font-bold text-[#222222]">WAN &amp; Cloud API</h4>
                      <span className="font-mono text-[10px] text-[#b45309] font-semibold">10.192.37.1 (Uplink)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Internet Connected
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Packet Inspector Console */}
              <div className="bg-[#1e1e1e] rounded-2xl p-4 sm:p-5 text-[#f5f2ea] border border-[#333333]">
                <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                    <span className="font-mono text-xs text-[#a0a0a0] ml-2">
                      live_packet_stream.log — Wireshark / RouterOS Torch
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400">
                    ● SNIFFING ACTIVE
                  </span>
                </div>

                <div className="mt-3 font-mono text-xs space-y-2 overflow-x-auto">
                  <div className="text-[#888888] grid grid-cols-6 gap-2 text-[11px] pb-1 border-b border-[#2d2d2d]">
                    <span>WAKTU</span>
                    <span className="col-span-2">SOURCE IP</span>
                    <span className="col-span-2">DESTINATION</span>
                    <span>STATUS</span>
                  </div>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-6 gap-2 text-[11px] text-white/90 font-mono py-1 border-b border-[#2d2d2d]/60 items-center"
                    >
                      <span className="text-zinc-400">{log.time}</span>
                      <span className="col-span-2 text-cyan-300 truncate">{log.source}</span>
                      <span className="col-span-2 text-amber-300 truncate">{log.dest} ({log.protocol})</span>
                      <span className="text-emerald-400 font-bold">[{log.status}]</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LINUX CONTAINERS & HOMELAB MONITOR */}
          {activeTab === "containers" && (
            <motion.div
              key="containers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb]">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#222222]">
                    Mini-PC Homelab Server Telemetry
                  </h3>
                  <p className="font-mono text-xs text-[#686660]">
                    Host: debian12-lab (Intel N100 • 16GB DDR5 • Docker Swarm sandbox)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                    System Load: 12% • Temp: 41°C
                  </span>
                </div>
              </div>

              {/* Container Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {containers.map((cont) => (
                  <div
                    key={cont.name}
                    className="p-5 rounded-2xl border border-[#ded8cb] bg-[#fbf9f3] hover:bg-white hover:border-[#2563eb] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="font-mono text-sm font-bold text-[#222222]">
                            {cont.name}
                          </h4>
                        </div>
                        <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold uppercase">
                          {cont.status}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#686660]">
                        Image: <span className="text-[#2563eb]">{cont.image}</span> • Port: {cont.port}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#ded8cb]/60 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-[#686660] block">CPU USAGE</span>
                        <span className="font-bold text-[#222222]">{cont.cpu}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#686660] block">MEMORY</span>
                        <span className="font-bold text-[#222222]">{cont.ram}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#686660] block">UPTIME</span>
                        <span className="font-bold text-emerald-600">{cont.uptime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: AI INFERENCE & WEB ENGINE */}
          {activeTab === "ai_bench" && (
            <motion.div
              key="ai_bench"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb]">
                <h3 className="font-serif text-base font-bold text-[#222222]">
                  Eksperimen AI &amp; LLM Terapan untuk Jaringan
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#686660] mt-0.5">
                  Pengujian prompt otomasi pemahaman konsep TKJ menggunakan model lokal / API terintegrasi Next.js.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-mono text-xs font-bold text-[#222222]">
                  PROMPT UJI COBA TEKNIS:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-[#ded8cb] rounded-xl font-sans text-sm focus:outline-none focus:border-[#2563eb]"
                    placeholder="Tulis pertanyaan seputar networking atau coding..."
                  />
                  <button
                    type="button"
                    onClick={handleRunAi}
                    disabled={isInferencing}
                    className="px-5 py-2.5 bg-[#2563eb] text-white font-mono text-xs font-bold rounded-xl hover:bg-[#1d4ed8] shadow-xs transition-all disabled:opacity-50 shrink-0"
                  >
                    {isInferencing ? "Memproses..." : "Jalankan Inferensi ↗"}
                  </button>
                </div>
              </div>

              {/* Output Display Box */}
              <div className="p-5 rounded-2xl bg-[#1e1e1e] text-[#f5f2ea] border border-[#333333] font-mono text-xs min-h-[140px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[#888888] pb-2 border-b border-[#333333] text-[11px]">
                    <span>INFERENCE STREAM // TOKEN GENERATION</span>
                    <span className="text-emerald-400">{isInferencing ? "● GENERATING" : "IDLE"}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#eae8e2] font-sans">
                    {aiOutput || "Klik 'Jalankan Inferensi' di atas untuk melihat respon model AI cerdas terkait materi TKJ!"}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#333333]/80 text-[10px] text-[#888888] flex justify-between">
                  <span>Engine: Next.js Server Function • AI Sandbox</span>
                  <span>Latency: ~12ms</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
