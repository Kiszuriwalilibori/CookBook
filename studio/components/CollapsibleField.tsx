import React, {useState, useRef, useCallback, ReactNode} from 'react'
import {Stack, Card, Flex, Text} from '@sanity/ui'
import { styles } from './CollapsibleField.styles'


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
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsExpanded(false)
    }
  }, [])

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  return (
    <Stack space={2} ref={containerRef}>
      {/* Accordion header */}
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

      {/* Collapsible content */}
      {isExpanded && <Stack space={2}>{children}</Stack>}
    </Stack>
  )
}
