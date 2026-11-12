"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
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

    let animationFrameId: number | null = null;
    let packetInterval: ReturnType<typeof setInterval> | null = null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const syncCanvasSize = () => {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 195,
      isActive: false,
    };

    // Multi-hue palette: Royal Blue, Electric Sky, Indigo & Slate
    const colors = [
      "rgba(37, 99, 235, 0.65)",
      "rgba(56, 189, 248, 0.65)",
      "rgba(99, 102, 241, 0.62)",
      "rgba(148, 163, 184, 0.55)",
    ];

    // Balanced responsive node count: responsive on mobile, rich on desktop
    const calculateNodeCount = (w: number, h: number) => {
      if (w < 640) return 20;
      if (w < 1024) return 32;
      const areaBased = Math.floor((w * h) / 23000);
      return Math.min(64, Math.max(42, areaBased));
    };

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    function initNodes() {
      nodes = [];
      packets = [];
      const count = calculateNodeCount(width, height);

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.5 + 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.44,
          vy: (Math.random() - 0.5) * 0.44,
          radius,
          color,
        });
      }
    }

    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 7) return;
      const startIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startIndex];

      let targetNode: Node | null = null;
      const minDistanceSq = 165 * 165;

      for (let i = 0; i < nodes.length; i++) {
        if (i === startIndex) continue;
        const dx = nodes[i].x - startNode.x;
        const dy = nodes[i].y - startNode.y;
        if (dx * dx + dy * dy < minDistanceSq) {
          targetNode = nodes[i];
          break;
        }
      }

      if (targetNode) {
        packets.push({
          startNode,
          endNode: targetNode,
          progress: 0,
          speed: Math.random() * 0.015 + 0.011,
        });
      }
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    function startPacketInterval() {
      if (packetInterval || isReducedMotion) return;
      packetInterval = setInterval(spawnPacket, 1150);
    }

    function stopPacketInterval() {
      if (packetInterval) {
        clearInterval(packetInterval);
        packetInterval = null;
      }
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;
        const widthChanged = Math.abs(nextWidth - width) > 2;

        width = nextWidth;
        height = nextHeight;
        syncCanvasSize();

        if (widthChanged) {
          initNodes();
        } else {
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].x = Math.min(nodes[i].x, width);
            nodes[i].y = Math.min(nodes[i].y, height);
          }
        }

        if (isReducedMotion) {
          drawFrame(0);
        }
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
    if (isFinePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    }

    initNodes();

    let lastTime = performance.now();
    const maxConnectDist = 160;
    const maxConnectDistSq = maxConnectDist * maxConnectDist;
    const mouseRadiusSq = mouse.radius * mouse.radius;

    function drawFrame(delta: number) {
      if (!ctx || !canvas) return;

      if (mouse.isActive && !isReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.22;
        mouse.y += (mouse.targetY - mouse.y) * 0.22;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Connecting constellation web lines (GPU-friendly batched strokes)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.14)";
      ctx.lineWidth = 0.9;

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
      }
      ctx.stroke();

      // 1b. Stronger interactive mouse-to-node links + gentle magnetic drift
      if (mouse.isActive && !isReducedMotion && mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(37, 99, 235, 0.34)";
        ctx.lineWidth = 1.15;

        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadiusSq) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius) * 0.025 * delta;
            a.x += dx * force;
            a.y += dy * force;
          }
        }
        ctx.stroke();
      }

      // 2. Pulsing data packets (with soft glow halo without costly shadowBlur)
      if (!isReducedMotion) {
        for (let k = packets.length - 1; k >= 0; k--) {
          const p = packets[k];
          p.progress += p.speed * delta;

          if (p.progress >= 1) {
            packets.splice(k, 1);
            continue;
          }

          const currX = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
          const currY = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

          // Soft halo
          ctx.beginPath();
          ctx.arc(currX, currY, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(37, 99, 235, 0.22)";
          ctx.fill();

          // Bright core
          ctx.beginPath();
          ctx.arc(currX, currY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(37, 99, 235, 0.9)";
          ctx.fill();
        }
      }

      // 3. Move and render multi-hue constellation nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!isReducedMotion && delta > 0) {
          node.x += node.vx * delta;
          node.y += node.vy * delta;

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

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // 4. Interactive cursor focal aura & orbital ring on desktop
      if (mouse.isActive && !isReducedMotion && mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(37, 99, 235, 0.28)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.8)";
        ctx.fill();
      }
    }

    function render(currentTime: number) {
      if (isReducedMotion) return;
      const delta = Math.min((currentTime - lastTime) / 16.667, 2);
      lastTime = currentTime;
      drawFrame(delta);
      animationFrameId = requestAnimationFrame(render);
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        stopPacketInterval();
        packets = [];
        drawFrame(0);
      } else {
        lastTime = performance.now();
        startPacketInterval();
        if (!document.hidden) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    if (isReducedMotion) {
      drawFrame(0);
    } else {
      startPacketInterval();
      animationFrameId = requestAnimationFrame(render);
    }

    function handleVisibility() {
      if (document.hidden) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        stopPacketInterval();
      } else if (!isReducedMotion) {
        lastTime = performance.now();
        startPacketInterval();
        animationFrameId = requestAnimationFrame(render);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      stopPacketInterval();
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      if (isFinePointer) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("mouseleave", handlePointerLeave);
      }
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
      <div className="absolute inset-0 w-full h-full blueprint-dots opacity-85 pointer-events-none" />

      {/* 2. Soft Ambient Corner Glows */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(219,234,254,0.45) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(224,231,255,0.36) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(224,242,254,0.32) 0%, transparent 70%)",
        }}
      />

      {/* 3. Hardware-Accelerated Network Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-80 sm:opacity-90"
      />
    </div>
  );
}
