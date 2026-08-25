/**
 * @jest-environment node
 */

import { POST } from "./route";

describe("POST /api/logout", () => {
    it("returns the unified success response", async () => {
        const response = await POST();

        expect(response.status).toBe(200);

        await expect(response.json()).resolves.toEqual({
            ok: true,
            data: null,
        });
    });

    it("clears the session cookie", async () => {
        const response = await POST();

        const setCookie = response.headers.get("set-cookie");

        expect(setCookie).toContain("session=");
        expect(setCookie).toContain("Max-Age=0");
        expect(setCookie).toContain("Path=/");
    });

    it("returns a Response object", async () => {
        const response = await POST();

        expect(response).toBeInstanceOf(Response);
    });
});
