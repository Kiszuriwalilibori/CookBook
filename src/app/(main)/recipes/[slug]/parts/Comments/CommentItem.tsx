'use client'

import {useState} from 'react'
import {Box, Typography, Button, TextField, IconButton} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { RecipeComment } from '@/types'



function formatDate(date: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))
}

export default function CommentItem({
  comment,
  recipeId,
  refresh,
  depth = 0,
}: {
  comment: RecipeComment,
  recipeId: string
  refresh: () => void
  depth?: number
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  async function handleReply() {
    if (!replyText.trim()) return

    await fetch('/api/comments/reply', {
      method: 'POST',
      body: JSON.stringify({
        recipeId,
        parentId: comment._id,
        content: replyText,
      }),
    })

    setReplyText('')
    setReplyOpen(false)
    refresh()
  }

  async function handleLike() {
    await fetch('/api/comments/like', {
      method: 'POST',
      body: JSON.stringify({
        commentId: comment._id,
      }),
    })

    refresh()
  }

  return (
    <Box ml={depth * 3}>
      <Box border="1px solid #ddd" borderRadius={2} p={2} bgcolor="#fafafa">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="subtitle2">{comment.author}</Typography>

          <Typography variant="caption" color="text.secondary">
            {formatDate(comment.createdAt)}
          </Typography>
        </Box>

        {/* CONTENT */}
        <Typography variant="body2" mb={1}>
          {comment.content}
        </Typography>

        {/* ACTIONS */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleLike}>
            <ThumbUpIcon fontSize="small" />
          </IconButton>

          <Typography variant="caption">{comment.likesCount}</Typography>

          <Button size="small" onClick={() => setReplyOpen(!replyOpen)}>
            Odpowiedz
          </Button>
        </Box>

        {/* REPLY INPUT */}
        {replyOpen && (
          <Box mt={1} display="flex" gap={1}>
            <TextField
              size="small"
              fullWidth
              placeholder="Odpowiedź..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button onClick={handleReply}>Wyślij</Button>
          </Box>
        )}
      </Box>

      {/* REKURENCJA */}
      <Box mt={1} display="flex" flexDirection="column" gap={1}>
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            recipeId={recipeId}
            refresh={refresh}
            depth={depth + 1}
          />
        ))}
      </Box>
    </Box>
  )
}
