import React, {useState, useEffect, useRef, useCallback} from 'react'
import {PatchEvent, set} from 'sanity'
import {TextInput, Stack, Card, Flex, Text} from '@sanity/ui'
import {createClient} from 'next-sanity'
import {styles} from './DietaryInput.styles'
import {getTranslation} from '../../src/models/fieldTranslations'

interface DietaryInputProps {
  value?: string[]
  onChange: (event: PatchEvent) => void
  schemaType?: {title: string}
  readOnly?: boolean
  level?: number
}

let cachedOptions: string[] | null = null

export default function DietaryInput({
  value = [],
  onChange,
  schemaType,
  readOnly,
}: DietaryInputProps) {
  const [options, setOptions] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isExpanded, setIsExpanded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const id = 'dietary-' + Math.random().toString(36).slice(2, 11)
  const title = getTranslation(schemaType!.title)

  /* ------------------ outside click ------------------ */
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsExpanded(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  /* ------------------ fetch options ------------------ */
  const fetchOptions = useCallback(() => {
    if (cachedOptions) {
      setOptions(cachedOptions)
      return
    }

    const client = createClient({
      projectId: 'mextu0pu',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2024-01-01',
    })

    client
      .fetch<string[]>(`*[_id=="options"][0].fullSummary.dietary`)
      .then((data) => {
        cachedOptions = Array.isArray(data) ? data : []
        setOptions(cachedOptions)
      })
      .catch(() => {
        cachedOptions = []
        setOptions([])
      })
  }, [])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  /* ------------------ helpers ------------------ */

  const handleBlur = () => {
    if (input.trim()) {
      addValue(input)
    }
  }

  const addValue = (selected: string) => {
    const trimmed = selected.trim()
    if (!trimmed || value.includes(trimmed)) return

    const newValue = [...value, trimmed]

    onChange(PatchEvent.from(set(newValue)))

    setInput('')
    setHighlightedIndex(-1)

    // ✅ kluczowe dla Sanity – zamyka cykl edycji inputu
    inputRef.current?.blur()
  }

  const removeValue = (selected: string) => {
    const newValue = value.filter((item) => item !== selected)
    onChange(PatchEvent.from(set(newValue)))
    setHighlightedIndex(-1)
  }

  const filteredOptions = options.filter(
    (option) => option.toLowerCase().includes(input.toLowerCase()) && !value.includes(option),
  )

  /* ------------------ keyboard ------------------ */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return

    if (event.key === 'Enter') {
      event.preventDefault()

      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        addValue(filteredOptions[highlightedIndex])
        return
      }

      if (input.trim()) {
        addValue(input)
      }
    }

    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    }

    if (event.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  /* ------------------ render ------------------ */
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
            {value.length > 0 ? value.join(', ') : 'Add'}
          </Text>
        </Flex>
      </Card>

      {/* Collapsible content */}
      {isExpanded && (
        <Stack space={2}>
          {/* Selected values */}
          <div style={styles.selectedList}>
            {value.map((item) => (
              <Card
                key={item}
                style={styles.selectedItem}
                onClick={() => removeValue(item)}
                tone="transparent"
                radius={2}
              >
                {item} ×
              </Card>
            ))}
          </div>

          {/* Input */}
          <TextInput
            ref={inputRef}
            id={id}
            value={input}
            readOnly={readOnly}
            onChange={(e) => {
              setInput(e.currentTarget.value)
              setHighlightedIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />

          {/* Dropdown */}
          {filteredOptions.length > 0 && (
            <Card padding={1} radius={2} style={styles.dropdown}>
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  style={{
                    ...styles.dropdownItem,
                    ...(highlightedIndex === index ? styles.highlightedItem : {}),
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addValue(option)
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option}
                </div>
              ))}
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}
