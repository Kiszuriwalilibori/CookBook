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
  const [isExpanded, setIsExpanded] = useState(false) // ⬅️ whole field accordion
  const fetchTimeout = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null) // For detecting clicks outside

  const id = 'dietary-' + Math.random().toString(36).slice(2, 11)
  const title = getTranslation(schemaType!.title)

  // Close the accordion if the user clicks outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsExpanded(false)
    }
  }, [])

  // Register click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

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
    fetchTimeout.current = setTimeout(fetchOptions, 100)
    return () => {
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current)
    }
  }, [fetchOptions])

  const addValue = (selectedOption: string) => {
    if (!selectedOption || value.includes(selectedOption)) return
    onChange(PatchEvent.from(set([...value, selectedOption])))
    setInput('')
    setHighlightedIndex(-1)
  }

  const removeValue = (selectedOption: string) => {
    onChange(PatchEvent.from(set(value.filter((item) => item !== selectedOption))))
  }

  const filteredOptions = options.filter(
    (option) => option.toLowerCase().includes(input.toLowerCase()) && !value.includes(option),
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault()
      addValue(filteredOptions[highlightedIndex]) // Select highlighted option
    } else if (event.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <Stack space={2} ref={containerRef}>
      {/* 🔘 Accordion header */}
      <Card
        padding={3}
        radius={2}
        tone="transparent"
        border
        style={{cursor: 'pointer'}}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Flex align="center" justify="space-between">
          <Text weight="semibold">{title}</Text>
          <Text size={1} muted>
            {value.length > 0
              ? value.join(', ') // Show selected items instead of count
              : 'Add'}
          </Text>
        </Flex>
      </Card>

      {/* ⬇️ Collapsible content */}
      {isExpanded && (
        <Stack space={2}>
          <div style={styles.selectedList}>
            {value.map((selectedOption) => (
              <Card
                key={selectedOption}
                padding={1}
                radius={2}
                tone="transparent"
                style={styles.selectedItem}
                onClick={() => removeValue(selectedOption)}
              >
                {selectedOption} ×
              </Card>
            ))}
          </div>

          <TextInput
            id={id}
            value={input}
            readOnly={readOnly}
            onChange={(event) => {
              setInput(event.currentTarget.value)
            }}
            onKeyDown={handleKeyDown}
          />

          {filteredOptions.length > 0 && (
            <Card padding={1} radius={2} style={styles.dropdown}>
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  style={{
                    ...styles.dropdownItem,
                    background: highlightedIndex === index ? '#f0f0f0' : undefined,
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
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
