// ═══════════════════════════════════════════════════════════════
// Network Topology Background — Data Flow / Packet Animation
// Lightweight canvas-based network visualization
// ═══════════════════════════════════════════════════════════════
(function () {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.id = 'network-bg';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
        pointerEvents: 'none'
    });
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let packets = [];
    let animationId;
    let lastTime = 0;
    const FPS = 30;
    const FRAME_INTERVAL = 1000 / FPS;
    const CONNECTION_DIST = 160;

    // Responsive node count
    function getNodeCount() {
        if (width < 640) return 20;
        if (width < 1024) return 35;
        return 55;
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initNodes();
    }

    function initNodes() {
        const count = getNodeCount();
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                radius: Math.random() * 1.5 + 0.5,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function spawnPacket() {
        if (packets.length > 4 || nodes.length < 2) return;
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        let to, attempts = 0;
        do {
            to = nodes[Math.floor(Math.random() * nodes.length)];
            attempts++;
        } while (to === from && attempts < 10);

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONNECTION_DIST * 1.5 || dist < 20) return;

        packets.push({
            x: from.x, y: from.y,
            tx: to.x, ty: to.y,
            progress: 0,
            speed: 1.2 / dist
        });
    }

    function draw(timestamp) {
        animationId = requestAnimationFrame(draw);

        const delta = timestamp - lastTime;
        if (delta < FRAME_INTERVAL) return;
        lastTime = timestamp - (delta % FRAME_INTERVAL);

        ctx.clearRect(0, 0, width, height);

        // Detect theme for color adjustment
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const baseAlpha = isDark ? 1 : 0.5;

        // Update nodes
        for (const node of nodes) {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.015;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
            node.x = Math.max(0, Math.min(width, node.x));
            node.y = Math.max(0, Math.min(height, node.y));
        }

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.1 * baseAlpha;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const node of nodes) {
            const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
            const r = node.radius * pulseScale;

            // Soft glow
            ctx.beginPath();
            const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
            glow.addColorStop(0, `rgba(0, 212, 255, ${0.12 * baseAlpha})`);
            glow.addColorStop(1, 'rgba(0, 212, 255, 0)');
            ctx.fillStyle = glow;
            ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.fillStyle = `rgba(0, 212, 255, ${0.4 * baseAlpha})`;
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw packets (data flow)
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;
            if (p.progress >= 1) { packets.splice(i, 1); continue; }

            const x = p.x + (p.tx - p.x) * p.progress;
            const y = p.y + (p.ty - p.y) * p.progress;

            // Packet glow trail
            ctx.beginPath();
            const trail = ctx.createRadialGradient(x, y, 0, x, y, 10);
            trail.addColorStop(0, `rgba(0, 212, 255, ${0.4 * baseAlpha})`);
            trail.addColorStop(0.5, `rgba(0, 212, 255, ${0.1 * baseAlpha})`);
            trail.addColorStop(1, 'rgba(0, 212, 255, 0)');
            ctx.fillStyle = trail;
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();

            // Packet core
            ctx.beginPath();
            ctx.fillStyle = `rgba(0, 212, 255, ${0.8 * baseAlpha})`;
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Randomly spawn packets
        if (Math.random() < 0.015) spawnPacket();
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 250);
    });

    // Pause when tab hidden for performance
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            lastTime = 0;
            animationId = requestAnimationFrame(draw);
        }
    });

    resize();
    animationId = requestAnimationFrame(draw);
})();
