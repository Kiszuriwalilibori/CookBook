import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {PatchEvent, set} from 'sanity'
import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'
import {useFormValue} from 'sanity'

const ProductsInput = (props) => {
  const {value = [], onChange, readOnly = false} = props
  const ingredients = useFormValue(['ingredients'])
  const [newProduct, setNewProduct] = useState('')

  // Extract last word from ingredient names
  const computeProducts = (ingredients) => {
    if (!ingredients || !Array.isArray(ingredients)) {
      return []
    }
    const products = ingredients
      .map((ingredient) => {
        const name = ingredient?.name || ''
        const words = name.trim().split(/\s+/)
        const lastWord = words[words.length - 1] || ''
        return lastWord
      })
      .filter(Boolean)
    return [...new Set(products)] // Dedupe only, no sort
  }

  // Generate button handler
  const generateProducts = () => {
    if (!ingredients || ingredients.length === 0) return
    const derived = computeProducts(ingredients)
    onChange(PatchEvent.from(set(derived)))
  }

  // Sort button handler
  const sortProducts = () => {
    if (value.length === 0) return
    const sorted = [...value].sort()
    onChange(PatchEvent.from(set(sorted)))
  }

  // --- Manual edit handlers ---
  const updateProducts = (updaterFn) => {
    if (readOnly) return
    const updated = updaterFn(value)
    onChange(PatchEvent.from(set(updated)))
  }

  const addProduct = () => {
    if (newProduct && !value.includes(newProduct)) {
      updateProducts((current) => [...current, newProduct]) // No sort
      setNewProduct('')
    }
  }

  const editProduct = (index, newValue) => {
    if (newValue !== value[index]) {
      updateProducts((current) => {
        const updated = [...current]
        updated[index] = newValue
        return updated // No sort
      })
    }
  }

  const removeProduct = (index) => {
    updateProducts((current) => current.filter((_, i) => i !== index)) // No sort
  }

  // Read-only view
  if (readOnly) {
    return (
      <Card padding={3} tone="default">
        <Label>Products (Read-only)</Label>
        <Box marginTop={2}>
          {value.length > 0 ? <Box>{value.join(', ')}</Box> : <Box>No products</Box>}
        </Box>
      </Card>
    )
  }

  return (
    <Card padding={3} tone="default">
      <Label>Products</Label>
      <Box marginTop={2}>
        {/* Action buttons */}
        <Flex gap={2} marginBottom={3}>
          <Button
            text="Generate Products from Ingredients"
            tone="primary"
            mode="ghost"
            onClick={generateProducts}
            disabled={!ingredients || ingredients.length === 0}
          />
          <Button
            text="Sort Products"
            tone="default"
            mode="ghost"
            onClick={sortProducts}
            disabled={value.length === 0}
          />
        </Flex>

        {/* Display existing products */}
        {value.length > 0 ? (
          value.map((products, index) => (
            <Flex key={index} align="center" marginBottom={2} gap={2}>
              <TextInput
                value={products || ''}
                onChange={(e) => editProduct(index, e.target.value)}
                placeholder="Product name"
              />
              <Button
                text="Remove"
                mode="ghost"
                tone="critical"
                onClick={() => removeProduct(index)}
              />
            </Flex>
          ))
        ) : (
          <Box>No products yet</Box>
        )}

        {/* Input for adding new products */}
        <Flex align="center" gap={2} marginTop={3}>
          <TextInput
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="Add a new product"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addProduct()
              }
            }}
          />
          <Button text="Add" tone="primary" onClick={addProduct} />
        </Flex>
      </Box>
    </Card>
  )
}

ProductsInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
}

export default ProductsInput
