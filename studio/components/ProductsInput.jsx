// // import React, {useEffect, useState} from 'react'
// // import PropTypes from 'prop-types'
// // import {useFormValue, PatchEvent, set} from 'sanity'
// // import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// // const ProductsInput = (props) => {
// //   const {value = [], onChange} = props // Current Products array
// //   const ingredients = useFormValue(['ingredients']) // Access ingredients
// //   const [newProduct, setNewProduct] = useState('') // State for new product input

// //   // Extract last word from ingredient names
// //   const computeProducts = (ingredients) => {
// //     if (!ingredients || !Array.isArray(ingredients)) {
// //       return []
// //     }
// //     const products = ingredients
// //       .map((ingredient) => {
// //         const name = ingredient.name || ''
// //         const words = name.trim().split(/\s+/)
// //         const lastWord = words[words.length - 1]

// //         return lastWord
// //       })
// //       .filter(Boolean)

// //     // Dedupe to avoid repeats
// //     return [...new Set(products)]
// //   }

// //   // Auto-derive Products from ingredients on changes
// //   useEffect(() => {
// //     if (ingredients) {
// //       const newProducts = computeProducts(ingredients)
// //       const currentSerialized = JSON.stringify(value || [])
// //       const newSerialized = JSON.stringify(newProducts)
// //       if (currentSerialized !== newSerialized) {
// //         Promise.resolve().then(() => {
// //           onChange(PatchEvent.from(set(newProducts)))
// //         })
// //       }
// //     }
// //   }, [ingredients, onChange, value]) // Note: value in deps for comparison

// //   // Handle adding a new product
// //   const addProduct = () => {
// //     if (newProduct && !value.includes(newProduct)) {
// //       const updatedProducts = [...value, newProduct]
// //       onChange(PatchEvent.from(set(updatedProducts)))
// //       setNewProduct('')
// //     }
// //   }

// //   // Handle editing a product
// //   const editProduct = (index, newValue) => {
// //     const updatedProducts = [...value]
// //     updatedProducts[index] = newValue
// //     onChange(PatchEvent.from(set(updatedProducts)))
// //   }

// //   // Handle removing a product
// //   const removeProduct = (index) => {
// //     const updatedProducts = value.filter((_, i) => i !== index)
// //     onChange(PatchEvent.from(set(updatedProducts)))
// //   }

// //   return (
// //     <Card padding={3} tone="default">
// //       <Label>Products</Label>
// //       <Box marginTop={2}>
// //         {/* Display and edit existing products */}
// //         {value.length > 0 ? (
// //           value.map((product, index) => (
// //             <Flex key={index} align="center" marginBottom={2} gap={2}>
// //               <TextInput
// //                 value={product || ''}
// //                 onChange={(e) => editProduct(index, e.target.value)}
// //                 placeholder="Product name"
// //               />
// //               <Button
// //                 text="Remove"
// //                 mode="ghost"
// //                 tone="critical"
// //                 onClick={() => removeProduct(index)}
// //               />
// //             </Flex>
// //           ))
// //         ) : (
// //           <Box>No products yet</Box>
// //         )}
// //         {/* Input for adding new products */}
// //         <Flex align="center" gap={2} marginTop={3}>
// //           <TextInput
// //             value={newProduct}
// //             onChange={(e) => {
// //               setNewProduct(e.target.value)
// //             }}
// //             placeholder="Add a new product"
// //             onKeyPress={(e) => {
// //               if (e.key === 'Enter') {
// //                 addProduct()
// //               }
// //             }}
// //           />
// //           <Button text="Add" tone="primary" onClick={addProduct} />
// //         </Flex>
// //       </Box>
// //     </Card>
// //   )
// // }

// // ProductsInput.propTypes = {
// //   value: PropTypes.arrayOf(PropTypes.string),
// //   onChange: PropTypes.func.isRequired,
// // }

// // export default ProductsInput
// import React, {useEffect, useState} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange} = props // Current Products array
//   const ingredients = useFormValue(['ingredients']) // Access ingredients
//   const [newProduct, setNewProduct] = useState('') // State for new product input

//   // Extract last word from ingredient names and lowercase
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient.name || ''
//         const words = name.trim().split(/\s+/)
//         const lastWord = words[words.length - 1]

//         return lastWord ? lastWord.toLowerCase() : null
//       })
//       .filter(Boolean)

//     // Dedupe to avoid repeats
//     return [...new Set(products)]
//   }

//   // Auto-derive Products from ingredients on changes
//   useEffect(() => {
//     if (ingredients) {
//       const newProducts = computeProducts(ingredients)
//       const currentSerialized = JSON.stringify(value || [])
//       const newSerialized = JSON.stringify(newProducts)
//       if (currentSerialized !== newSerialized) {
//         Promise.resolve().then(() => {
//           onChange(PatchEvent.from(set(newProducts)))
//         })
//       }
//     }
//   }, [ingredients, onChange, value]) // Note: value in deps for comparison

//   // Handle adding a new product (lowercased)
//   const addProduct = () => {
//     const lowercasedProduct = newProduct.toLowerCase().trim()
//     if (lowercasedProduct && !value.includes(lowercasedProduct)) {
//       const updatedProducts = [...value, lowercasedProduct]
//       onChange(PatchEvent.from(set(updatedProducts)))
//       setNewProduct('')
//     }
//   }

//   // Handle editing a product (lowercased)
//   const editProduct = (index, newValue) => {
//     const lowercasedValue = newValue.toLowerCase().trim()
//     const updatedProducts = [...value]
//     updatedProducts[index] = lowercasedValue
//     onChange(PatchEvent.from(set(updatedProducts)))
//   }

//   // Handle removing a product
//   const removeProduct = (index) => {
//     const updatedProducts = value.filter((_, i) => i !== index)
//     onChange(PatchEvent.from(set(updatedProducts)))
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         {/* Display and edit existing products */}
//         {value.length > 0 ? (
//           value.map((product, index) => (
//             <Flex key={index} align="center" marginBottom={2} gap={2}>
//               <TextInput
//                 value={product || ''}
//                 onChange={(e) => editProduct(index, e.target.value)}
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
//         {/* Input for adding new products */}
//         <Flex align="center" gap={2} marginTop={3}>
//           <TextInput
//             value={newProduct}
//             onChange={(e) => {
//               setNewProduct(e.target.value)
//             }}
//             placeholder="Add a new product"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 addProduct()
//               }
//             }}
//           />
//           <Button text="Add" tone="primary" onClick={addProduct} />
//         </Flex>
//       </Box>
//     </Card>
//   )
// }

// ProductsInput.propTypes = {
//   value: PropTypes.arrayOf(PropTypes.string),
//   onChange: PropTypes.func.isRequired,
// }

// export default ProductsInput
// import React, {useEffect, useState} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange} = props // Current Products array
//   const ingredients = useFormValue(['ingredients']) // Access ingredients
//   const [newProduct, setNewProduct] = useState('') // State for new product input

//   // Helper to lowercase, trim, and dedupe array case-insensitively
//   const normalizeProducts = (products) => {
//     const normalized = products.map((p) => (p || '').toLowerCase().trim()).filter(Boolean)
//     return [...new Set(normalized)]
//   }

//   // Extract last word from ingredient names and lowercase
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient.name || ''
//         const words = name.trim().split(/\s+/)
//         const lastWord = words[words.length - 1]

//         return lastWord ? lastWord.toLowerCase().trim() : null
//       })
//       .filter(Boolean)

//     // Dedupe to avoid repeats
//     return normalizeProducts(products)
//   }

//   // Auto-derive Products from ingredients on changes, union with existing to preserve manual adds
//   useEffect(() => {
//     if (ingredients) {
//       const newDerived = computeProducts(ingredients)
//       const normalizedValue = normalizeProducts(value)
//       const added = newDerived.filter((p) => !normalizedValue.includes(p))
//       const updatedProducts = normalizeProducts([...value, ...added]) // Full normalize after union for case-insens dedupe
//       const currentSerialized = JSON.stringify(normalizeProducts(value || []))
//       const newSerialized = JSON.stringify(updatedProducts)
//       if (currentSerialized !== newSerialized) {
//         Promise.resolve().then(() => {
//           onChange(PatchEvent.from(set(updatedProducts)))
//         })
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ingredients, onChange, value]) // Added value back to deps; union prevents overwriting

//   // Normalize current value for case-insensitive checks
//   const normalizedValue = normalizeProducts(value)

//   // Handle adding a new product (lowercased, case-insensitive dedupe)
//   const addProduct = () => {
//     const lowercasedProduct = newProduct.toLowerCase().trim()
//     if (lowercasedProduct && !normalizedValue.includes(lowercasedProduct)) {
//       const updatedProducts = normalizeProducts([...value, lowercasedProduct])
//       onChange(PatchEvent.from(set(updatedProducts)))
//       setNewProduct('')
//     }
//   }

//   // Handle editing a product (lowercased)
//   const editProduct = (index, newValue) => {
//     const lowercasedValue = newValue.toLowerCase().trim()
//     if (!lowercasedValue) return // Avoid empty
//     const updatedProducts = value.map((p, i) => (i === index ? lowercasedValue : p))
//     onChange(PatchEvent.from(set(normalizeProducts(updatedProducts)))) // Normalize after edit
//   }

//   // Handle removing a product
//   const removeProduct = (index) => {
//     const updatedProducts = value.filter((_, i) => i !== index)
//     onChange(PatchEvent.from(set(normalizeProducts(updatedProducts))))
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         {/* Display and edit existing products */}
//         {value.length > 0 ? (
//           value.map((product, index) => (
//             <Flex key={index} align="center" marginBottom={2} gap={2}>
//               <TextInput
//                 value={product || ''}
//                 onChange={(e) => editProduct(index, e.target.value)}
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
//         {/* Input for adding new products */}
//         <Flex align="center" gap={2} marginTop={3}>
//           <TextInput
//             value={newProduct}
//             onChange={(e) => {
//               setNewProduct(e.target.value)
//             }}
//             placeholder="Add a new product"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 addProduct()
//               }
//             }}
//           />
//           <Button text="Add" tone="primary" onClick={addProduct} />
//         </Flex>
//       </Box>
//     </Card>
//   )
// }

// ProductsInput.propTypes = {
//   value: PropTypes.arrayOf(PropTypes.string),
//   onChange: PropTypes.func.isRequired,
// }

// export default ProductsInput
// import React, {useEffect, useState} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange} = props // Current Products array
//   const ingredients = useFormValue(['ingredients']) // Access ingredients
//   const [newProduct, setNewProduct] = useState('') // State for new product input

//   // Helper to lowercase, trim, and dedupe array case-insensitively
//   const normalizeProducts = (products) => {
//     const normalized = products.map((p) => (p || '').toLowerCase().trim()).filter(Boolean)
//     return [...new Set(normalized)]
//   }

//   // Extract last word from ingredient names and lowercase
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient.name || ''
//         const words = name.trim().split(/\s+/)
//         const lastWord = words[words.length - 1]

//         return lastWord ? lastWord.toLowerCase().trim() : null
//       })
//       .filter(Boolean)

//     return normalizeProducts(products)
//   }

//   // Auto-add derived Products from ingredients (only when ingredients change)
//   useEffect(() => {
//     if (!ingredients) return
//     const newDerived = computeProducts(ingredients)
//     const normalizedValue = normalizeProducts(value)
//     const added = newDerived.filter((p) => !normalizedValue.includes(p))

//     if (added.length > 0) {
//       const updatedProducts = normalizeProducts([...value, ...added])
//       onChange(PatchEvent.from(set(updatedProducts)))
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ingredients]) // <— Only run when ingredients change

//   // Normalize current value for case-insensitive checks
//   const normalizedValue = normalizeProducts(value)

//   // Handle adding a new product (lowercased, deduped)
//   const addProduct = () => {
//     const lowercasedProduct = newProduct.toLowerCase().trim()
//     if (lowercasedProduct && !normalizedValue.includes(lowercasedProduct)) {
//       const updatedProducts = normalizeProducts([...value, lowercasedProduct])
//       onChange(PatchEvent.from(set(updatedProducts)))
//       setNewProduct('')
//     }
//   }

//   // Handle editing a product (lowercased)
//   const editProduct = (index, newValue) => {
//     const lowercasedValue = newValue.toLowerCase().trim()
//     const updatedProducts = value.map((p, i) => (i === index ? lowercasedValue : p))
//     onChange(PatchEvent.from(set(normalizeProducts(updatedProducts))))
//   }

//   // Handle removing a product
//   const removeProduct = (index) => {
//     const updatedProducts = value.filter((_, i) => i !== index)
//     onChange(PatchEvent.from(set(normalizeProducts(updatedProducts))))
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         {/* Display and edit existing products */}
//         {value.length > 0 ? (
//           value.map((product, index) => (
//             <Flex key={index} align="center" marginBottom={2} gap={2}>
//               <TextInput
//                 value={product || ''}
//                 onChange={(e) => editProduct(index, e.target.value)}
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
//         {/* Input for adding new products */}
//         <Flex align="center" gap={2} marginTop={3}>
//           <TextInput
//             value={newProduct}
//             onChange={(e) => setNewProduct(e.target.value)}
//             placeholder="Add a new product"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') addProduct()
//             }}
//           />
//           <Button text="Add" tone="primary" onClick={addProduct} />
//         </Flex>
//       </Box>
//     </Card>
//   )
// }

// ProductsInput.propTypes = {
//   value: PropTypes.arrayOf(PropTypes.string),
//   onChange: PropTypes.func.isRequired,
// }

// export default ProductsInput

import React, {useEffect, useState, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import {useFormValue, PatchEvent, set} from 'sanity'
import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

const ProductsInput = (props) => {
  const {value = [], onChange} = props
  const ingredients = useFormValue(['ingredients'])
  const [newProduct, setNewProduct] = useState('')
  const prevIngredientNames = useRef([])

  // ✅ Normalize: lowercase, trim, and dedupe (case-insensitive)
  const normalizeProducts = useCallback((products) => {
    const normalized = products.map((p) => (p || '').toLowerCase().trim()).filter(Boolean)
    return [...new Set(normalized)]
  }, [])

  // ✅ Compute derived products from ingredients
  const computeProducts = useCallback(
    (ingredients) => {
      if (!ingredients || !Array.isArray(ingredients)) return []
      const products = ingredients
        .map((ingredient) => {
          const name = ingredient.name || ''
          const words = name.trim().split(/\s+/)
          const lastWord = words[words.length - 1]
          return lastWord ? lastWord.toLowerCase().trim() : null
        })
        .filter(Boolean)
      return normalizeProducts(products)
    },
    [normalizeProducts],
  )

  // ✅ Update only when ingredient *names* truly change (not on every keystroke)
  useEffect(() => {
    if (!ingredients) return

    const currentNames = (ingredients || [])
      .map((i) => (i.name || '').trim().toLowerCase())
      .filter(Boolean)

    const prevNames = prevIngredientNames.current
    const changed =
      currentNames.length !== prevNames.length ||
      currentNames.some((name, i) => name !== prevNames[i])

    if (!changed) return // Skip updates while typing within same ingredient

    prevIngredientNames.current = currentNames

    const newDerived = computeProducts(ingredients)
    const normalizedValue = normalizeProducts(value)
    const added = newDerived.filter((p) => !normalizedValue.includes(p))

    if (added.length > 0) {
      const updatedProducts = normalizeProducts([...value, ...added])
      onChange(PatchEvent.from(set(updatedProducts)))
    }
  }, [ingredients, computeProducts, normalizeProducts, onChange, value])

  // ✅ Add a new product manually
  const addProduct = () => {
    const lowercasedProduct = newProduct.toLowerCase().trim()
    if (lowercasedProduct && !value.includes(lowercasedProduct)) {
      const updatedProducts = normalizeProducts([...value, lowercasedProduct])
      onChange(PatchEvent.from(set(updatedProducts)))
      setNewProduct('')
    }
  }

  // ✅ Edit a product inline
  const editProduct = (index, newValue) => {
    const lowercasedValue = newValue.toLowerCase().trim()
    const updatedProducts = value.map((p, i) => (i === index ? lowercasedValue : p))
    onChange(PatchEvent.from(set(normalizeProducts(updatedProducts))))
  }

  // ✅ Remove a product
  const removeProduct = (index) => {
    const updatedProducts = value.filter((_, i) => i !== index)
    onChange(PatchEvent.from(set(normalizeProducts(updatedProducts))))
  }

  return (
    <Card padding={3} tone="default">
      <Label>Products</Label>
      <Box marginTop={2}>
        {/* Existing products list */}
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

        {/* Add new product field */}
        <Flex align="center" gap={2} marginTop={3}>
          <TextInput
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="Add a new product"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addProduct()
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
