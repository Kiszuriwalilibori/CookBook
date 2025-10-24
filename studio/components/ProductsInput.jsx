//

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useFormValue, PatchEvent, set} from 'sanity'
import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

const ProductsInput = (props) => {
  const {value = [], onChange} = props // Current Products array
  const ingredients = useFormValue(['ingredients']) // Access ingredients
  const [newProduct, setNewProduct] = useState('') // State for new product input

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

    return products
  }

  // Initialize Products when empty
  useEffect(() => {
    if (!value.length && ingredients) {
      const newProducts = computeProducts(ingredients)
      if (newProducts.length > 0) {
        // Only patch if there's content to add
        Promise.resolve().then(() => {
          onChange(PatchEvent.from(set(newProducts)))
        })
      }
    }
  }, [ingredients, onChange, value.length])

  // Handle adding a new product
  const addProduct = () => {
    if (newProduct && !value.includes(newProduct)) {
      const updatedProducts = [...value, newProduct]
      onChange(PatchEvent.from(set(updatedProducts)))
      setNewProduct('')
    } else {
    }
  }

  // Handle editing a product
  const editProduct = (index, newValue) => {
    const updatedProducts = [...value]
    updatedProducts[index] = newValue
    onChange(PatchEvent.from(set(updatedProducts)))
  }

  // Handle removing a product
  const removeProduct = (index) => {
    const updatedProducts = value.filter((_, i) => i !== index)
    onChange(PatchEvent.from(set(updatedProducts)))
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
