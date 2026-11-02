"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
}

interface Packet {
  startNode: Node;
  endNode: Node;
  progress: number;
  speed: number;
}

export function InteractiveNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (default to center or offscreen)
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 210, // Interaction radius
      isActive: false,
    };

    // Palette: Clean royal blue, electric cyan, and soft steel slate
    const colors = [
      "rgba(37, 99, 235, ",   // Royal Blue #2563eb
      "rgba(56, 189, 248, ",  // Electric Sky #38bdf8
      "rgba(99, 102, 241, ",  // Indigo #6366f1
      "rgba(148, 163, 184, ", // Slate #94a3b8
    ];

    // Determine node count dynamically based on screen resolution (enriched for denser network web)
    const calculateNodeCount = (w: number, h: number) => {
      const area = w * h;
      return Math.min(96, Math.max(46, Math.floor(area / 17000)));
    };

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    function initNodes() {
      nodes = [];
      packets = [];
      const count = calculateNodeCount(width, height);

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.6 + 1.2;
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius,
          baseRadius: radius,
          color: colorPrefix,
        });
      }
    }

    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 8) return;
      const startIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startIndex];

      // Find nearby nodes
      let targetNode: Node | null = null;
      const minDistance = 165;

      for (let i = 0; i < nodes.length; i++) {
        if (i === startIndex) continue;
        const dx = nodes[i].x - startNode.x;
        const dy = nodes[i].y - startNode.y;
        const dist = Math.hypot(dx, dy);
        if (dist < minDistance) {
          targetNode = nodes[i];
          break;
        }
      }

      if (targetNode) {
        packets.push({
          startNode,
          endNode: targetNode,
          progress: 0,
          speed: Math.random() * 0.015 + 0.012,
        });
      }
    }

    const packetInterval = setInterval(spawnPacket, 1200);

    // Handle Resize
    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    }

    // Handle Mouse
    function handlePointerMove(e: PointerEvent) {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    }

    function handlePointerLeave() {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isActive = false;
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    initNodes();

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Main Animation Loop
    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;

      const delta = Math.min((currentTime - lastTime) / 16.667, 2);
      lastTime = currentTime;

      // Smooth mouse position damping
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const maxConnectDist = 165;
      const maxConnectDistSq = maxConnectDist * maxConnectDist;

      // 1. Draw connecting lines between nodes (interconnected network web)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxConnectDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }

        // Connect nodes to mouse if nearby
        if (mouse.isActive) {
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          const distSq = dx * dx + dy * dy;
          const mouseDist = mouse.radius;

          if (distSq < mouseDist * mouseDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / mouseDist) * 0.45;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Magnetic gentle drift towards mouse
            if (!isReducedMotion) {
              const force = (1 - dist / mouseDist) * 0.03;
              a.x += dx * force;
              a.y += dy * force;
            }
          }
        }
      }

      // 2. Draw & update packets (transmitting data pulses)
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.progress += p.speed * (isReducedMotion ? 0.2 : delta);

        if (p.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const currX = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
        const currY = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.85)";
        ctx.shadowColor = "rgba(37, 99, 235, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Draw & update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!isReducedMotion) {
          node.x += node.vx * delta;
          node.y += node.vy * delta;

          // Gentle bounce off screen boundaries
          if (node.x < 0) {
            node.x = 0;
            node.vx *= -1;
          } else if (node.x > width) {
            node.x = width;
            node.vx *= -1;
          }
          if (node.y < 0) {
            node.y = 0;
            node.vy *= -1;
          } else if (node.y > height) {
            node.y = height;
            node.vy *= -1;
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}0.65)`;
        ctx.fill();
      }

      // Draw subtle interactive cursor focal aura
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.75)";
        ctx.shadowColor = "rgba(37, 99, 235, 0.5)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    // Pause on visibility change
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(packetInterval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden"
    >
      {/* 1. Global Architectural Blueprint Dots Layer (Matching Hero across all pages) */}
      <div className="absolute inset-0 w-full h-full blueprint-dots opacity-80 pointer-events-none" />

      {/* 2. Soft Ambient Corner Glows to add depth without cluttering */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[480px] h-[480px] bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-sky-100/25 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Dynamic Network Plexus Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 sm:opacity-85"
      />
    </div>
  );
}
