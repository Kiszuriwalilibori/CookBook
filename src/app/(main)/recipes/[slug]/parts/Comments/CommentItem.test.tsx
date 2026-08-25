import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useFingerprint } from "@/hooks";
import { RecipeComment } from "@/types";

import CommentItem from "./CommentItem";

import { checkIsOwnComment, getAbsoluteCommentDate, getRelativeTime, useLikeAnimation, useLikeComment, useReplyComment, useSetInitialFocusInCommentItem, useShortComment } from "./utils";

import { useRepliesVisibility } from "./utils/useRepliesVisibility";

// Komponent wyświetla autora komentarza „Jan”.
// Komponent wyświetla treść komentarza „Świetny przepis!”.
// Hook useLikeComment otrzymuje identyfikator komentarza, fingerprint użytkownika, początkową listę polubień oraz callback animacji polubienia.
// Przycisk polubienia wyświetla prawidłową liczbę polubień.
// Kliknięcie przycisku polubienia wywołuje funkcję handleLike.
// Komponent wyświetla skrócony komentarz, gdy jest dostępny.
// Komponent wyświetla autora skróconego komentarza „Piotr”.
// Komponent nie wyświetla skróconego komentarza, gdy jego treść jest pusta.
// Komponent wyświetla formularz odpowiedzi, gdy formOpen ma wartość true.
// Formularz komentarza jest obecny po otwarciu formularza odpowiedzi.
// Komponent nie wyświetla formularza odpowiedzi, gdy formOpen ma wartość false.
// Komponent nie wyświetla formularza komentarza, gdy formularz odpowiedzi jest zamknięty.
// Komponent wyświetla wskaźnik ładowania podczas dodawania odpowiedzi.
// Komponent wyświetla wskaźnik ładowania podczas dodawania skróconego komentarza.
// Przycisk rozwijania odpowiedzi wyświetla prawidłową liczbę ukrytych odpowiedzi.
// Przycisk rozwijania odpowiedzi ma aria-expanded="false", gdy odpowiedzi są ukryte.
// Przycisk rozwijania odpowiedzi wskazuje właściwy kontener odpowiedzi przez aria-controls.
// Kliknięcie przycisku rozwijania odpowiedzi wywołuje toggleRepliesVisibility.

jest.mock("@/hooks", () => ({
    useFingerprint: jest.fn(),
}));

jest.mock("@/components", () => ({
    LoadingIndicator: ({ open, prompt }: { open: boolean; prompt: string }) => (open ? <div role="status">{prompt}</div> : null),
}));

jest.mock("./CommentItemHeader", () => ({
    __esModule: true,
    default: ({ author }: { author: string }) => <div data-testid="comment-header">{author}</div>,
}));

jest.mock("./LikeItButton", () => ({
    __esModule: true,
    default: ({ alreadyLiked, likesCount, isLiking, onLike }: { alreadyLiked: boolean; likesCount: number; isLiking: boolean; animate: boolean; onLike: () => void }) => (
        <button type="button" data-testid="like-button" data-already-liked={alreadyLiked} data-likes-count={likesCount} data-is-liking={isLiking} onClick={onLike}>
            Like
        </button>
    ),
}));

jest.mock("./ReplyButton", () => ({
    ReplyButton: ({ onToggle, author }: { onToggle: () => void; commentId: string; author: string }) => (
        <button type="button" onClick={onToggle}>
            Odpowiedz {author}
        </button>
    ),
}));

jest.mock("./ReplyCollapse", () => ({
    __esModule: true,
    default: ({ open, children }: { open: boolean; children: React.ReactNode; commentId: string }) => (open ? <div data-testid="reply-collapse">{children}</div> : null),
}));

jest.mock("./CommentForm", () => ({
    __esModule: true,
    default: () => <div data-testid="comment-form">Comment form</div>,
}));

jest.mock("./utils", () => ({
    checkIsOwnComment: jest.fn(),
    getAbsoluteCommentDate: jest.fn(),
    getRelativeTime: jest.fn(),
    useLikeAnimation: jest.fn(),
    useLikeComment: jest.fn(),
    useReplyComment: jest.fn(),
    useSetInitialFocusInCommentItem: jest.fn(),
    useShortComment: jest.fn(),
}));

jest.mock("./utils/useRepliesVisibility", () => ({
    useRepliesVisibility: jest.fn(),
}));

const mockUseFingerprint = useFingerprint as jest.Mock;

const mockUseSetInitialFocus = useSetInitialFocusInCommentItem as jest.Mock;

const mockCheckIsOwnComment = checkIsOwnComment as jest.Mock;
const mockGetAbsoluteCommentDate = getAbsoluteCommentDate as jest.Mock;
const mockGetRelativeTime = getRelativeTime as jest.Mock;

const mockUseLikeAnimation = useLikeAnimation as jest.Mock;
const mockUseLikeComment = useLikeComment as jest.Mock;
const mockUseReplyComment = useReplyComment as jest.Mock;
const mockUseShortComment = useShortComment as jest.Mock;
const mockUseRepliesVisibility = useRepliesVisibility as jest.Mock;

const mockHandleAddComment = jest.fn();

const comment: RecipeComment = {
    _id: "comment-1",
    recipeId: "recipe-1",
    parentId: null,
    author: "Jan",
    content: "Świetny przepis!",
    createdAt: "2026-08-24T12:00:00Z",
    fingerprint: "other-fingerprint",
    likes: ["fingerprint-2", "fingerprint-3"],
    isAdmin: false,
    replies: [],
    shortComment: undefined,
};

beforeEach(() => {
    jest.clearAllMocks();

    mockUseFingerprint.mockReturnValue("user-fingerprint");

    mockUseSetInitialFocus.mockReturnValue(null);

    mockCheckIsOwnComment.mockReturnValue(false);
    mockGetRelativeTime.mockReturnValue("wczoraj");
    mockGetAbsoluteCommentDate.mockReturnValue("24 sierpnia 2026");

    mockUseLikeAnimation.mockReturnValue({
        animateLike: false,
        triggerLikeAnimation: jest.fn(),
    });

    mockUseLikeComment.mockReturnValue({
        likes: ["fingerprint-2", "fingerprint-3"],
        alreadyLiked: false,
        isLiking: false,
        handleLike: jest.fn(),
    });

    mockUseReplyComment.mockReturnValue({
        formOpen: false,
        isReplySubmitting: false,
        handleReplySubmit: jest.fn(),
        handleReplyCancel: jest.fn(),
        toggleReplyForm: jest.fn(),
    });

    mockUseShortComment.mockReturnValue({
        shortComment: "",
        isShortCommentSubmitting: false,
        handleAddShortComment: jest.fn(),
    });

    mockUseRepliesVisibility.mockReturnValue({
        showReplies: false,
        visibleReplies: [],
        hiddenRepliesCount: 0,
        toggleRepliesVisibility: jest.fn(),
    });
});

describe("CommentItem", () => {
    it("renders comment author and content", () => {
        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByTestId("comment-header")).toHaveTextContent("Jan");

        expect(screen.getByText("Świetny przepis!")).toBeInTheDocument();
    });

    it("passes comment data to useLikeComment", () => {
        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(mockUseLikeComment).toHaveBeenCalledWith({
            commentId: "comment-1",
            fingerprint: "user-fingerprint",
            initialLikes: comment.likes,
            onLikeAnimation: expect.any(Function),
        });
    });

    it("renders the correct number of likes", () => {
        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByTestId("like-button")).toHaveAttribute("data-likes-count", "2");
    });

    it("calls handleLike when the like button is clicked", async () => {
        const user = userEvent.setup();
        const handleLike = jest.fn();

        mockUseLikeComment.mockReturnValue({
            likes: ["fingerprint-2"],
            alreadyLiked: false,
            isLiking: false,
            handleLike,
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        await user.click(screen.getByTestId("like-button"));

        expect(handleLike).toHaveBeenCalledTimes(1);
    });

    it("renders the short comment when it exists", () => {
        mockUseShortComment.mockReturnValue({
            shortComment: "Krótki komentarz",
            isShortCommentSubmitting: false,
            handleAddShortComment: jest.fn(),
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByText("Krótki komentarz")).toBeInTheDocument();

        expect(screen.getByText("Piotr")).toBeInTheDocument();
    });

    it("does not render the short comment when it is empty", () => {
        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.queryByText("Piotr")).not.toBeInTheDocument();
    });

    it("shows reply form when formOpen is true", () => {
        mockUseReplyComment.mockReturnValue({
            formOpen: true,
            isReplySubmitting: false,
            handleReplySubmit: jest.fn(),
            handleReplyCancel: jest.fn(),
            toggleReplyForm: jest.fn(),
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByTestId("reply-collapse")).toBeInTheDocument();

        expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    });

    it("does not render reply form when formOpen is false", () => {
        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.queryByTestId("reply-collapse")).not.toBeInTheDocument();

        expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();
    });

    it("shows reply submitting indicator", () => {
        mockUseReplyComment.mockReturnValue({
            formOpen: false,
            isReplySubmitting: true,
            handleReplySubmit: jest.fn(),
            handleReplyCancel: jest.fn(),
            toggleReplyForm: jest.fn(),
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByText("Dodawanie odpowiedzi w toku")).toBeInTheDocument();
    });

    it("shows short comment submitting indicator", () => {
        mockUseShortComment.mockReturnValue({
            shortComment: "",
            isShortCommentSubmitting: true,
            handleAddShortComment: jest.fn(),
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        expect(screen.getByText("Dodawanie krótkiego komentarza w toku")).toBeInTheDocument();
    });

    it("renders hidden replies count and controls", () => {
        mockUseRepliesVisibility.mockReturnValue({
            showReplies: false,
            visibleReplies: [],
            hiddenRepliesCount: 3,
            toggleRepliesVisibility: jest.fn(),
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        const button = screen.getByRole("button", {
            name: "Pokaż jeszcze 3 odpowiedzi",
        });

        expect(button).toHaveAttribute("aria-expanded", "false");

        expect(button).toHaveAttribute("aria-controls", "replies-comment-1");
    });

    it("toggles reply visibility when hidden replies button is clicked", async () => {
        const user = userEvent.setup();
        const toggleRepliesVisibility = jest.fn();

        mockUseRepliesVisibility.mockReturnValue({
            showReplies: false,
            visibleReplies: [],
            hiddenRepliesCount: 2,
            toggleRepliesVisibility,
        });

        render(<CommentItem comment={comment} recipeId="recipe-1" handleAddComment={mockHandleAddComment} />);

        await user.click(
            screen.getByRole("button", {
                name: "Pokaż jeszcze 2 odpowiedzi",
            })
        );

        expect(toggleRepliesVisibility).toHaveBeenCalledTimes(1);
    });
});
