import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Comments from "./Comments";

jest.mock("@/hooks", () => ({
    useFingerprint: () => "fingerprint-123",

    useMessage: () => ({
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
    }),
}));

describe("Comments integration", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("adds comment with optimistic update", async () => {
        const user = userEvent.setup();

        // initial GET comments
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({
                    ok: true,
                    data: {
                        comments: [],
                    },
                }),
            })

            // POST comment
            .mockResolvedValueOnce({
                json: async () => ({
                    ok: true,
                    comment: {
                        _id: "server-id",
                        content: "Test komentarza",
                        author: "Piotr",
                        createdAt: new Date().toISOString(),
                        likes: [],
                        fingerprint: "fingerprint-123",
                    },
                }),
            });

        render(<Comments recipeId="recipe-1" />);

        // wait initial fetch
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        // open form
        await user.click(
            screen.getByRole("button", {
                name: /dodaj komentarz/i,
            })
        );

        // fill form
        await user.type(screen.getByLabelText(/imię autora komentarza/i), "Piotr");

        await user.type(screen.getByLabelText(/treść komentarza/i), "Test komentarza");

        // submit
        await user.click(
            screen.getByRole("button", {
                name: /^dodaj$/i,
            })
        );

        // optimistic UI
        expect(screen.getByText("Test komentarza")).toBeInTheDocument();

        // server sync
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });
});

it("removes optimistic comment on server error", async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock)
        .mockResolvedValueOnce({
            json: async () => ({
                ok: true,
                data: {
                    comments: [],
                },
            }),
        })

        // POST FAIL
        .mockResolvedValueOnce({
            json: async () => ({
                ok: false,
                error: {
                    code: "COMMENT_REJECTED",
                    message: "Rejected",
                },
            }),
        });

    render(<Comments recipeId="recipe-1" />);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    await user.click(
        screen.getByRole("button", {
            name: /dodaj komentarz/i,
        })
    );

    await user.type(screen.getByLabelText(/imię autora komentarza/i), "Piotr");

    await user.type(screen.getByLabelText(/treść komentarza/i), "Komentarz testowy");

    await user.click(
        screen.getByRole("button", {
            name: /^dodaj$/i,
        })
    );

    // optimistic exists
    expect(screen.getByText("Komentarz testowy")).toBeInTheDocument();

    // rollback
    await waitFor(() => {
        expect(screen.queryByText("Komentarz testowy")).not.toBeInTheDocument();
    });
});

jest.mock("@/hooks", () => ({
    useFingerprint: () => "fingerprint-123",

    useMessage: () => ({
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
    }),
}));

describe("Comments integration", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    function mockInitialComments(comments: unknown[] = []) {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({
                ok: true,
                data: {
                    comments,
                },
            }),
        });
    }

    describe("like system", () => {
        it("optimistically increments likes and rolls back on fail", async () => {
            const user = userEvent.setup();

            mockInitialComments([
                {
                    _id: "comment-1",
                    recipeId: "recipe-1",
                    author: "Jan",
                    content: "Test komentarza",
                    createdAt: new Date().toISOString(),
                    likes: [],
                    fingerprint: "abc",
                    parentId: null,
                    replies: [],
                },
            ]);

            // FAIL LIKE REQUEST
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: async () => ({
                    ok: false,
                    error: {
                        code: "INTERNAL_ERROR",
                        message: "Server error",
                    },
                }),
            });

            render(<Comments recipeId="recipe-1" />);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });

            const likeButton = screen.getByRole("button", {
                name: /polub komentarz/i,
            });

            // initial count
            expect(screen.getByText("0")).toBeInTheDocument();

            await user.click(likeButton);

            // optimistic +1
            expect(screen.getByText("1")).toBeInTheDocument();

            // rollback after fail
            await waitFor(() => {
                expect(screen.getByText("0")).toBeInTheDocument();
            });
        });
    });

    describe("reply system", () => {
        it("opens reply form and renders nested reply", async () => {
            const user = userEvent.setup();

            mockInitialComments([
                {
                    _id: "comment-1",
                    recipeId: "recipe-1",
                    author: "Jan",
                    content: "Komentarz główny",
                    createdAt: new Date().toISOString(),
                    likes: [],
                    fingerprint: "abc",
                    parentId: null,
                    replies: [],
                },
            ]);

            // reply submit
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: async () => ({
                    ok: true,
                    comment: {
                        _id: "reply-1",
                        recipeId: "recipe-1",
                        author: "Piotr",
                        content: "Odpowiedź testowa",
                        createdAt: new Date().toISOString(),
                        likes: [],
                        fingerprint: "fingerprint-123",
                        parentId: "comment-1",
                    },
                }),
            });

            render(<Comments recipeId="recipe-1" />);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });

            // open reply
            await user.click(
                screen.getByRole("button", {
                    name: /reply to comment by jan/i,
                })
            );

            // fill form
            await user.type(screen.getByLabelText(/imię autora komentarza/i), "Piotr");

            await user.type(screen.getByLabelText(/treść komentarza/i), "Odpowiedź testowa");

            // submit
            await user.click(
                screen.getByRole("button", {
                    name: /odpowiedz/i,
                })
            );

            // optimistic render
            expect(screen.getByText("Odpowiedź testowa")).toBeInTheDocument();

            // nested reply exists
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("validation", () => {
        it("does not submit invalid comment", async () => {
            const user = userEvent.setup();

            mockInitialComments([]);

            render(<Comments recipeId="recipe-1" />);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });

            await user.click(
                screen.getByRole("button", {
                    name: /dodaj komentarz/i,
                })
            );

            // invalid values
            await user.type(screen.getByLabelText(/imię autora komentarza/i), "A");

            await user.type(screen.getByLabelText(/treść komentarza/i), "x");

            const submitButton = screen.getByRole("button", {
                name: /^dodaj$/i,
            });

            // button disabled
            expect(submitButton).toBeDisabled();

            await user.click(submitButton);

            // no POST request
            expect(fetch).toHaveBeenCalledTimes(1);

            // validation visible
            expect(screen.getByText(/imię jest za krótkie/i)).toBeInTheDocument();

            expect(screen.getByText(/komentarz jest za krótki/i)).toBeInTheDocument();
        });
    });
});
