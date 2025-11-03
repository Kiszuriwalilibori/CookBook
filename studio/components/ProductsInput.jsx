import React, {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import {useFormValue, PatchEvent, set} from 'sanity'
import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

const ProductsInput = (props) => {
  const {value = [], onChange} = props // Current Products array
  const ingredients = useFormValue(['ingredients']) // Access ingredients
  const [newProduct, setNewProduct] = useState('') // State for new product input
  const hasManualEditRef = useRef(false) // Track if user has manually edited (add/edit/remove)
  const lastDerivedRef = useRef([]) // Track previously derived products for delta

  // Extract last word from ingredient names
  const computeProducts = (ingredients) => {
    if (!ingredients || !Array.isArray(ingredients)) {
      return []
    }
    const products = ingredients
      .map((ingredient) => {
        const name = ingredient.name || ''
        const words = name.trim().split(/\s+/)
        const lastWord = words[words.length - 1]

        return lastWord
      })
      .filter(Boolean)

    // Dedupe to avoid repeats
    return [...new Set(products)]
  }

  // Auto-derive or merge on ingredient changes
  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      if (!hasManualEditRef.current) {
        Promise.resolve().then(() => {
          onChange(PatchEvent.from(set([])))
        })
      }
      lastDerivedRef.current = []
      return
    }

    const newProducts = computeProducts(ingredients)
    const newlyDerived = newProducts.filter((p) => !lastDerivedRef.current.includes(p))

    let shouldUpdate = false
    let updatedValue

    if (!hasManualEditRef.current) {
      // Full replace if no manual edits and different
      const currentSerialized = JSON.stringify(value || [])
      const newSerialized = JSON.stringify(newProducts)
      if (currentSerialized !== newSerialized) {
        updatedValue = newProducts
        shouldUpdate = true
      }
    } else {
      // Merge only newly derived if missing in value
      const toAdd = newlyDerived.filter((p) => !value.includes(p))
      if (toAdd.length > 0) {
        updatedValue = [...value, ...toAdd]
        shouldUpdate = true
      }
    }

    if (shouldUpdate) {
      Promise.resolve().then(() => {
        onChange(PatchEvent.from(set(updatedValue)))
      })
    }

    // Update last derived to current full set
    lastDerivedRef.current = newProducts
  }, [ingredients, onChange, value])

  // Reset manual flag and last derived if ingredients cleared
  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      hasManualEditRef.current = false
      lastDerivedRef.current = []
    }
  }, [ingredients])

  // Helper to mark manual edit and update
  const updateWithManualFlag = (updaterFn) => {
    hasManualEditRef.current = true
    const updated = updaterFn(value)
    onChange(PatchEvent.from(set(updated)))
  }

  // Handle adding a new product
  const addProduct = () => {
    if (newProduct && !value.includes(newProduct)) {
      updateWithManualFlag((current) => [...current, newProduct])
      setNewProduct('')
    }
  }

  // Handle editing a product
  const editProduct = (index, newValue) => {
    if (newValue !== value[index]) {
      // Only flag if actual change
      updateWithManualFlag((current) => {
        const updated = [...current]
        updated[index] = newValue
        return updated
      })
    }
  }

  // Handle removing a product
  const removeProduct = (index) => {
    updateWithManualFlag((current) => current.filter((_, i) => i !== index))
  }

  return (
    <Card padding={3} tone="default">
      <Label>Products</Label>
      <Box marginTop={2}>
        {/* Display and edit existing products */}
        {value.length > 0 ? (
          value.map((product, index) => (
            <Flex key={index} align="center" marginBottom={2} gap={2}>
              <TextInput
                value={product || ''}
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
            onChange={(e) => {
              setNewProduct(e.target.value)
            }}
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
}

export default ProductsInput
