import React, {useState, useEffect, useRef, useCallback} from 'react'
import {PatchEvent, set} from 'sanity'
import {TextInput, Stack, Card, Label} from '@sanity/ui'
import {createClient} from 'next-sanity'
import {styles} from './DietaryInput.styles'

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
  const fetchTimeout = useRef<NodeJS.Timeout | null>(null)

  const id = 'dietary-' + Math.random().toString(36).slice(2, 11)
  const title = schemaType?.title || 'Dietary Restrictions'

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
  }

  const removeValue = (selectedOption: string) => {
    onChange(PatchEvent.from(set(value.filter((item) => item !== selectedOption))))
  }

  const filteredOptions = options.filter(
    (option) => option.toLowerCase().includes(input.toLowerCase()) && !value.includes(option),
  )

  return (
    <Stack space={2}>
      <Label htmlFor={id}>{title}</Label>

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
        onChange={(event) => setInput(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && input.trim()) {
            event.preventDefault()
            addValue(input.trim())
          }
        }}
      />

      {filteredOptions.length > 0 && (
        <Card padding={1} radius={2} style={styles.dropdown}>
          {filteredOptions.map((option) => (
            <div
              key={option}
              style={styles.dropdownItem}
              onMouseDown={(event) => {
                event.preventDefault()
                addValue(option)
              }}
            >
              {option}
            </div>
          ))}
        </Card>
      )}
    </Stack>
  )
}
