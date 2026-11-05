"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
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

    // Mouse coordinates (default to offscreen)
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 160,
      isActive: false,
    };

    // Responsive node count: lightweight on mobile, balanced on desktop
    const calculateNodeCount = (w: number) => {
      if (w < 640) return 20; // Mobile: ultra lightweight
      if (w < 1024) return 28; // Tablet
      return 38; // Desktop
    };

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    function initNodes() {
      nodes = [];
      packets = [];
      const count = calculateNodeCount(width);

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.2 + 1.2;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius,
        });
      }
    }

    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 5) return;
      const startIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startIndex];

      // Find nearby nodes
      let targetNode: Node | null = null;
      const minDistance = 150;

      for (let i = 0; i < nodes.length; i++) {
        if (i === startIndex) continue;
        const dx = nodes[i].x - startNode.x;
        const dy = nodes[i].y - startNode.y;
        if (dx * dx + dy * dy < minDistance * minDistance) {
          targetNode = nodes[i];
          break;
        }
      }

      if (targetNode) {
        packets.push({
          startNode,
          endNode: targetNode,
          progress: 0,
          speed: Math.random() * 0.012 + 0.008,
        });
      }
    }

    const packetInterval = setInterval(spawnPacket, 1600);

    // Debounced Resize
    let resizeTimeout: NodeJS.Timeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initNodes();
      }, 150);
    }

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

    // Main 60FPS Batch-Rendered Loop
    let lastTime = performance.now();
    const maxConnectDistSq = 145 * 145;
    const mouseRadiusSq = mouse.radius * mouse.radius;

    function render(currentTime: number) {
      if (!ctx || !canvas) return;

      const delta = Math.min((currentTime - lastTime) / 16.667, 2);
      lastTime = currentTime;

      // Smooth mouse position damping
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.2;
        mouse.y += (mouse.targetY - mouse.y) * 0.2;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Batch draw connecting lines in a single path (99% fewer draw calls)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.12)";
      ctx.lineWidth = 0.8;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          if (dx * dx + dy * dy < maxConnectDistSq) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }

        // Connect node to mouse if active
        if (mouse.isActive) {
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          if (dx * dx + dy * dy < mouseRadiusSq) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
      }
      ctx.stroke();

      // 2. Draw & update packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.progress += p.speed * (isReducedMotion ? 0.3 : delta);

        if (p.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const currX = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
        const currY = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.75)";
        ctx.fill();
      }

      // 3. Update & batch draw all nodes in a single fill call
      ctx.beginPath();
      ctx.fillStyle = "rgba(37, 99, 235, 0.4)";

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

        ctx.moveTo(node.x + node.radius, node.y);
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    // Pause on visibility change (saves CPU and battery when tab is hidden)
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
      clearTimeout(resizeTimeout);
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
      {/* 1. Global Architectural Blueprint Dots Layer */}
      <div className="absolute inset-0 w-full h-full blueprint-dots opacity-80 pointer-events-none" />

      {/* 2. Soft Ambient Corner Glows */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[380px] h-[380px] bg-indigo-50/25 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Ultra-Smooth Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 sm:opacity-85"
      />
    </div>
  );
}
