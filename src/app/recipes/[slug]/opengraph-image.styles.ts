export const styles = {
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
    },

    backgroundImage: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(0.78)",
    },

    backgroundFallback: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #1f2937, #0f172a)",
    },

    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.65))",
    },

    glassPanel: {
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 64,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 24,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "32px 40px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column" as const,
    },

    title: {
        fontSize: 58,
        fontWeight: 700,
        lineHeight: 1.1,
        color: "#fff",
        marginBottom: 20,
    },

    badgesWrapper: {
        display: "flex",
        gap: 16,
    },

    badge: {
        background: "rgba(255,255,255,0.25)",
        padding: "8px 24px",
        borderRadius: 9999,
        fontSize: 26,
        fontWeight: 600,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 8,
    },

    branding: {
        position: "absolute",
        top: 48,
        right: 48,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "12px 28px",
        borderRadius: 9999,
        fontSize: 26,
        fontWeight: 700,
        backdropFilter: "blur(12px)",
    },
} as const;
export default styles;
