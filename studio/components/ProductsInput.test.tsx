import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductsInput, { computeProducts } from './ProductsInput'


describe('computeProducts', () => {
  test('returns empty array if ingredients is null, undefined, or not an array', () => {
    expect(computeProducts(null as any)).toEqual([])
    expect(computeProducts(undefined as any)).toEqual([])
    expect(computeProducts({} as any)).toEqual([])
    expect(computeProducts('string' as any)).toEqual([])
  })

  test('handles empty array', () => {
    expect(computeProducts([])).toEqual([])
  })

  test('returns single-word ingredient as-is', () => {
    expect(computeProducts([{ name: 'Sugar' }])).toEqual(['Sugar'])
  })

  test('returns first word + full name for multi-word ingredients', () => {
    expect(computeProducts([{ name: 'Brown Sugar' }])).toEqual(['Brown', 'Brown Sugar'])
  })

  test('deduplicates first words and full names', () => {
    const ingredients = [
      { name: 'Olive Oil' },
      { name: 'Olive Paste' },
      { name: 'Olive' },
    ]
    expect(computeProducts(ingredients)).toEqual(['Olive', 'Olive Oil', 'Olive Paste'])
  })
})

describe('ProductsInput UI', () => {
  beforeEach(() => {
    // Reset the mock before each test
    __setUseFormValueReturn([])
  })

  test('generates products from ingredients', () => {
    __setUseFormValueReturn([{ name: 'Brown Sugar' }, { name: 'Olive Oil' }])
    const onChange = jest.fn()

    render(<ProductsInput value={[]} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', { name: /Generate Products from Ingredients/i })
    )

    const result = extractSetValue(onChange.mock.calls[0][0])
    expect(result).toEqual(['Brown', 'Brown Sugar', 'Olive', 'Olive Oil'])
  })

  test('adds a product manually', () => {
    const onChange = jest.fn()
    render(<ProductsInput value={[]} onChange={onChange} />)

    fireEvent.change(screen.getByPlaceholderText(/Add a new product/i), {
      target: { value: 'Salt' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Add/i }))

    const result = extractSetValue(onChange.mock.calls[0][0])
    expect(result).toEqual(['Salt'])
  })

  test('removes a product', () => {
    const onChange = jest.fn()
    render(<ProductsInput value={['Salt', 'Sugar']} onChange={onChange} />)

    fireEvent.click(screen.getAllByRole('button', { name: /Remove/i })[0]) // remove 'Salt'

    const result = extractSetValue(onChange.mock.calls[0][0])
    expect(result).toEqual(['Sugar'])
  })

  test('sorts products alphabetically', () => {
    const onChange = jest.fn()
    render(<ProductsInput value={['Sugar', 'Salt']} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /Sort Products/i }))

    const result = extractSetValue(onChange.mock.calls[0][0])
    expect(result).toEqual(['Salt', 'Sugar'])
  })
})
