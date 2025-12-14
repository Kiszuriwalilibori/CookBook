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
  } satisfies CSSProperties,

  dropdown: {
    border: '1px solid #ddd',
    maxHeight: 150,
    overflowY: 'auto',
  } satisfies CSSProperties,

  dropdownItem: {
    padding: 4,
    cursor: 'pointer',
  } satisfies CSSProperties,
}
