
import {CSSProperties} from 'react'

export const styles = {
  selectedList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  } satisfies CSSProperties,

  selectedItem: {
    background: '#eee',
    cursor: 'pointer',
    padding: 1,
    borderRadius: 2,
  } satisfies CSSProperties,

  dropdown: {
    border: '1px solid #ddd',
    maxHeight: 150,
    overflowY: 'auto',
    borderRadius: 2,
  } satisfies CSSProperties,

  dropdownItem: {
    padding: 4,
    cursor: 'pointer',
  } satisfies CSSProperties,

  accordionHeader: {
    cursor: 'pointer',
  } satisfies CSSProperties,

  highlightedItem: {
    background: '#f0f0f0',
  } satisfies CSSProperties,
}
