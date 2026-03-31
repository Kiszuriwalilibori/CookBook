// src/utils/fingerprint.ts
import sha256 from "crypto-js/sha256";

/**
 * Minimal interfaces to extend Navigator safely
 */
interface NavigatorExtended {
    deviceMemory?: number;
    oscpu?: string;
    getBattery?: () => Promise<BatteryManager>;
}

interface BatteryManager {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
}

/**
 * Typed interface for WebGL debug info
 */
interface WEBGLDebugRendererInfo {
    UNMASKED_VENDOR_WEBGL: number;
    UNMASKED_RENDERER_WEBGL: number;
}

/**
 * Generates a device/browser fingerprint for rating-blocking
 */
export function generateDeviceFingerprint(): string {
    const nav = navigator as Navigator & NavigatorExtended;

    const components = {
        userAgent: nav.userAgent,
        language: nav.language,
        platform: nav.platform,
        deviceMemory: nav.deviceMemory ?? "unknown",
        hardwareConcurrency: nav.hardwareConcurrency,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            pixelRatio: window.devicePixelRatio,
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localStorage: isLocalStorageEnabled(),
        sessionStorage: isSessionStorageEnabled(),
        indexedDB: isIndexedDBEnabled(),
        canvas: getSimpleCanvasHash(),
        webgl: getWebGLVendorRenderer(),
    };

    return sha256(JSON.stringify(components)).toString();
}

/**
 * Checks if localStorage is available
 */
function isLocalStorageEnabled(): boolean {
    try {
        const test = "__localStorageTest__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if sessionStorage is available
 */
function isSessionStorageEnabled(): boolean {
    try {
        const test = "__sessionStorageTest__";
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if IndexedDB is available
 */
function isIndexedDBEnabled(): boolean {
    try {
        return !!window.indexedDB;
    } catch {
        return false;
    }
}

/**
 * Simple canvas-based hash
 */
function getSimpleCanvasHash(): string {
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return "canvas_error";

        ctx.font = "14px Arial";
        ctx.fillText("rating_fingerprint", 2, 15);

        return sha256(canvas.toDataURL()).toString();
    } catch {
        return "canvas_error";
    }
}

/**
 * WebGL vendor/renderer fingerprint
 */
function getWebGLVendorRenderer(): string {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        if (!gl) return "webgl_error";

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info") as WEBGLDebugRendererInfo | null;
        if (!debugInfo) return "webgl_debug_unavailable";

        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        return sha256(`${vendor}|${renderer}`).toString();
    } catch {
        return "webgl_error";
    }
}

/**
 * Optional: hash a string fingerprint for storage in your DB
 */
export function hashFingerprint(fingerprint: string): string {
    return sha256(fingerprint).toString();
}
