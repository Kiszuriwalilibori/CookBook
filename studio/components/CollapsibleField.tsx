
import React, {useState, ReactNode} from 'react'
import {Stack, Card, Flex, Text} from '@sanity/ui'
import {styles} from './CollapsibleField.styles'

interface CollapsibleFieldProps {
  title: string
  summary?: string | ReactNode
  defaultExpanded?: boolean
  children: ReactNode
}

export function CollapsibleField({
  title,
  summary,
  defaultExpanded = false,
  children,
}: CollapsibleFieldProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Stack space={2}>
      {/* Header toggles */}
      <Card
        padding={3}
        radius={2}
        tone="transparent"
        border
        style={styles.accordionHeader}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Flex align="center" justify="space-between">
          <Text weight="semibold">{title}</Text>
          <Text size={1} muted>
            {summary ?? (isExpanded ? 'Hide' : 'Show')}
          </Text>
        </Flex>
      </Card>

      {isExpanded && (
        <Card
          padding={3}
          radius={2}
          border
          style={{
            maxHeight: '70vh', // 👈 viewport-based
            overflowY: 'auto',
          }}
        >
          <Stack space={3}>{children}</Stack>
        </Card>
      )}
    </Stack>
  )
}
