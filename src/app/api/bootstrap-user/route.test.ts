/**
 * @jest-environment node
 */

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import { GET } from "./route";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("crypto", () => ({
    randomUUID: jest.fn(),
}));

describe("GET /api/bootstrap-user", () => {
    const mockedCookies = cookies as jest.Mock;
    const mockedRandomUUID = randomUUID as jest.Mock;

    const mockGet = jest.fn();
    const mockSet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockedCookies.mockResolvedValue({
            get: mockGet,
            set: mockSet,
        });
    });

    it("returns the existing userId in the unified success response", async () => {
        mockGet.mockReturnValue({
            value: "existing-user-id",
        });

        const response = await GET();

        expect(response.status).toBe(200);

        await expect(response.json()).resolves.toEqual({
            ok: true,
            data: {
                userId: "existing-user-id",
            },
        });

        expect(mockSet).not.toHaveBeenCalled();
    });

    it("generates and stores a userId when the cookie does not exist", async () => {
        mockGet.mockReturnValue(undefined);
        mockedRandomUUID.mockReturnValue("generated-user-id");

        const response = await GET();

        expect(response.status).toBe(200);

        await expect(response.json()).resolves.toEqual({
            ok: true,
            data: {
                userId: "generated-user-id",
            },
        });

        expect(mockedRandomUUID).toHaveBeenCalledTimes(1);

        expect(mockSet).toHaveBeenCalledWith("userId", "generated-user-id", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });
    });
});
