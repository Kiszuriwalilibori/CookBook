// //ProductsInput.tsx

// import React, { useState } from 'react'
// import { PatchEvent, set } from 'sanity'
// import { Box, Button, Flex, TextInput, Label, Card } from '@sanity/ui'
// import { useFormValue } from 'sanity'

// // Types
// export interface Ingredient {
//   name?: string
// }

// export interface ProductsInputProps {
//   value?: string[]
//   onChange: (patch: any) => void
//   readOnly?: boolean
// }

// // Extract first word + full name from ingredient names
// export const computeProducts = (ingredients: Ingredient[]): string[] => {
//   if (!ingredients || !Array.isArray(ingredients)) return []

//   const products = ingredients.flatMap((ingredient) => {
//     const name = ingredient?.name || ''
//     const trimmed = name.trim()
//     if (!trimmed) return []

//     const words = trimmed.split(/\s+/)
//     if (words.length > 1) {
//       return [words[0], trimmed]
//     }

//     return [trimmed]
//   })

//   return [...new Set(products)]
// }

// const ProductsInput: React.FC<ProductsInputProps> = (props) => {
//   const { value = [], onChange, readOnly = false } = props
//   const ingredients = useFormValue(["ingredients"]) as Ingredient[] | null
//   const [newProduct, setNewProduct] = useState<string>("")

//   const generateProducts = () => {
//     if (!ingredients || ingredients.length === 0) return
//     const derived = computeProducts(ingredients)
//     onChange(PatchEvent.from(set(derived)))
//   }

//   const sortProducts = () => {
//     if (value.length === 0) return
//     const sorted = [...value].sort()
//     onChange(PatchEvent.from(set(sorted)))
//   }

//   const updateProducts = (updaterFn: (current: string[]) => string[]) => {
//     if (readOnly) return
//     const updated = updaterFn(value)
//     onChange(PatchEvent.from(set(updated)))
//   }

//   const addProduct = () => {
//     if (newProduct && !value.includes(newProduct)) {
//       updateProducts((current) => [...current, newProduct])
//       setNewProduct("")
//     }
//   }

//   const editProduct = (index: number, newValue: string) => {
//     if (newValue !== value[index]) {
//       updateProducts((current) => {
//         const updated = [...current]
//         updated[index] = newValue
//         return updated
//       })
//     }
//   }

//   const removeProduct = (index: number) => {
//     updateProducts((current) => current.filter((_, i) => i !== index))
//   }

//   if (readOnly) {
//     return (
//       <Card padding={3} tone="default">
//         <Label>Products (Read-only)</Label>
//         <Box marginTop={2}>
//           {value.length > 0 ? <Box>{value.join(', ')}</Box> : <Box>No products</Box>}
//         </Box>
//       </Card>
//     )
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         <Flex gap={2} marginBottom={3}>
//           <Button
//             text="Generate Products from Ingredients"
//             tone="primary"
//             mode="ghost"
//             onClick={generateProducts}
//             disabled={!ingredients || ingredients.length === 0}
//           />

//           <Button
//             text="Sort Products"
//             tone="default"
//             mode="ghost"
//             onClick={sortProducts}
//             disabled={value.length === 0}
//           />
//         </Flex>

//         {value.length > 0 ? (
//           value.map((product, index) => (
//             <Flex key={index} align="center" marginBottom={2} gap={2}>
//               <TextInput
//                 value={product || ''}
//                 onChange={(e) => editProduct(index, (e.target as HTMLInputElement).value)}
//                 placeholder="Product name"
//               />

//               <Button
//                 text="Remove"
//                 mode="ghost"
//                 tone="critical"
//                 onClick={() => removeProduct(index)}
//               />
//             </Flex>
//           ))
//         ) : (
//           <Box>No products yet</Box>
//         )}

//         <Flex align="center" gap={2} marginTop={3}>
//           <TextInput
//             value={newProduct}
//             onChange={(e) => setNewProduct((e.target as HTMLInputElement).value)}
//             placeholder="Add a new product"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') addProduct()
//             }}
//           />
//           <Button text="Add" tone="primary" onClick={addProduct} />
//         </Flex>
//       </Box>
//     </Card>
//   )
// }

// export default ProductsInput

import React, {useState} from 'react'
import {PatchEvent, set} from 'sanity'
import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'
import {useFormValue} from 'sanity'
import {CollapsibleField} from './CollapsibleField'

// Types
export interface Ingredient {
  name?: string
}

export interface ProductsInputProps {
  value?: string[]
  onChange: (patch: any) => void
  readOnly?: boolean
}

// Extract first word + full name from ingredient names
export const computeProducts = (ingredients: Ingredient[]): string[] => {
  if (!ingredients || !Array.isArray(ingredients)) return []

  const products = ingredients.flatMap((ingredient) => {
    const name = ingredient?.name || ''
    const trimmed = name.trim()
    if (!trimmed) return []

    const words = trimmed.split(/\s+/)
    if (words.length > 1) {
      return [words[0], trimmed]
    }

    return [trimmed]
  })

  return [...new Set(products)]
}

const ProductsInput: React.FC<ProductsInputProps> = (props) => {
  const {value = [], onChange, readOnly = false} = props
  const ingredients = useFormValue(['ingredients']) as Ingredient[] | null
  const [newProduct, setNewProduct] = useState<string>('')

  const generateProducts = () => {
    if (!ingredients || ingredients.length === 0) return
    const derived = computeProducts(ingredients)
    onChange(PatchEvent.from(set(derived)))
  }

  const sortProducts = () => {
    if (value.length === 0) return
    const sorted = [...value].sort()
    onChange(PatchEvent.from(set(sorted)))
  }

  const updateProducts = (updaterFn: (current: string[]) => string[]) => {
    if (readOnly) return
    const updated = updaterFn(value)
    onChange(PatchEvent.from(set(updated)))
  }

  const addProduct = () => {
    if (newProduct && !value.includes(newProduct)) {
      updateProducts((current) => [...current, newProduct])
      setNewProduct('')
    }
  }

  const editProduct = (index: number, newValue: string) => {
    if (newValue !== value[index]) {
      updateProducts((current) => {
        const updated = [...current]
        updated[index] = newValue
        return updated
      })
    }
  }

  const removeProduct = (index: number) => {
    updateProducts((current) => current.filter((_, i) => i !== index))
  }

  const summary = value.length > 0 ? `${value.length} products` : 'No products'

  if (readOnly) {
    return (
      <Card padding={3} tone="default">
        <Label>Products (Read-only)</Label>
        <Box marginTop={2}>{value.length > 0 ? value.join(', ') : 'No products'}</Box>
      </Card>
    )
  }

  return (
    <CollapsibleField title="Products" summary={summary} defaultExpanded={false}>
      <Card padding={3} tone="default">
        <Box>
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

          {value.length > 0 ? (
            value.map((product, index) => (
              <Flex key={index} align="center" marginBottom={2} gap={2}>
                <TextInput
                  value={product || ''}
                  onChange={(e) => editProduct(index, (e.target as HTMLInputElement).value)}
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

          <Flex align="center" gap={2} marginTop={3}>
            <TextInput
              value={newProduct}
              onChange={(e) => setNewProduct((e.target as HTMLInputElement).value)}
              placeholder="Add a new product"
              onKeyPress={(e) => {
                if (e.key === 'Enter') addProduct()
              }}
            />
            <Button text="Add" tone="primary" onClick={addProduct} />
          </Flex>
        </Box>
      </Card>
    </CollapsibleField>
  )
}

export default ProductsInput
