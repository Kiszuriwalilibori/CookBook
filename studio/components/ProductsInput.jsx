// import React, {useEffect, useState, useRef} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange} = props // Current Products array
//   const ingredients = useFormValue(['ingredients']) // Access ingredients
//   const [newProduct, setNewProduct] = useState('') // State for new product input
//   const hasManualEditRef = useRef(false) // Track if user has manually edited (add/edit/remove)
//   const lastDerivedRef = useRef([]) // Track previously derived products for delta

//   // Extract last word from ingredient names
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient.name || ''
//         const words = name.trim().split(/\s+/)
//         const lastWord = words[words.length - 1]

//         return lastWord
//       })
//       .filter(Boolean)

//     // Dedupe to avoid repeats
//     return [...new Set(products)]
//   }

//   // Auto-derive or merge on ingredient changes
//   useEffect(() => {
//     if (!ingredients || ingredients.length === 0) {
//       if (!hasManualEditRef.current) {
//         Promise.resolve().then(() => {
//           onChange(PatchEvent.from(set([])))
//         })
//       }
//       lastDerivedRef.current = []
//       return
//     }

//     const newProducts = computeProducts(ingredients)
//     const newlyDerived = newProducts.filter((p) => !lastDerivedRef.current.includes(p))

//     let shouldUpdate = false
//     let updatedValue

//     if (!hasManualEditRef.current) {
//       // Full replace if no manual edits and different
//       const currentSerialized = JSON.stringify(value || [])
//       const newSerialized = JSON.stringify(newProducts)
//       if (currentSerialized !== newSerialized) {
//         updatedValue = newProducts
//         shouldUpdate = true
//       }
//     } else {
//       // Merge only newly derived if missing in value
//       const toAdd = newlyDerived.filter((p) => !value.includes(p))
//       if (toAdd.length > 0) {
//         updatedValue = [...value, ...toAdd]
//         shouldUpdate = true
//       }
//     }

//     if (shouldUpdate) {
//       Promise.resolve().then(() => {
//         onChange(PatchEvent.from(set(updatedValue)))
//       })
//     }

//     // Update last derived to current full set
//     lastDerivedRef.current = newProducts
//   }, [ingredients, onChange, value])

//   // Reset manual flag and last derived if ingredients cleared
//   useEffect(() => {
//     if (!ingredients || ingredients.length === 0) {
//       hasManualEditRef.current = false
//       lastDerivedRef.current = []
//     }
//   }, [ingredients])

//   // Helper to mark manual edit and update
//   const updateWithManualFlag = (updaterFn) => {
//     hasManualEditRef.current = true
//     const updated = updaterFn(value)
//     onChange(PatchEvent.from(set(updated)))
//   }

//   // Handle adding a new product
//   const addProduct = () => {
//     if (newProduct && !value.includes(newProduct)) {
//       updateWithManualFlag((current) => [...current, newProduct])
//       setNewProduct('')
//     }
//   }

//   // Handle editing a product
//   const editProduct = (index, newValue) => {
//     if (newValue !== value[index]) {
//       // Only flag if actual change
//       updateWithManualFlag((current) => {
//         const updated = [...current]
//         updated[index] = newValue
//         return updated
//       })
//     }
//   }

//   // Handle removing a product
//   const removeProduct = (index) => {
//     updateWithManualFlag((current) => current.filter((_, i) => i !== index))
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
//   const {value = [], onChange} = props
//   const ingredients = useFormValue(['ingredients'])
//   const [newProduct, setNewProduct] = useState('')

//   // Extract last word from ingredient names
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient?.name || ''
//         const words = name.trim().split(/\s+/)
//         return words[words.length - 1] || ''
//       })
//       .filter(Boolean)
//     return [...new Set(products)] // dedupe
//   }

//   /**
//    * Auto-derive products only once:
//    * If products are empty and ingredients exist, initialize them.
//    * Otherwise, never auto-update again.
//    */
//   useEffect(() => {
//     if (!ingredients || ingredients.length === 0) return
//     if (value && value.length > 0) return // already initialized

//     const derived = computeProducts(ingredients)
//     if (derived.length > 0) {
//       onChange(PatchEvent.from(set(derived)))
//     }
//   }, [ingredients, onChange, value])

//   // --- Manual edit handlers ---

//   const updateProducts = (updaterFn) => {
//     const updated = updaterFn(value)
//     onChange(PatchEvent.from(set(updated)))
//   }

//   const addProduct = () => {
//     if (newProduct && !value.includes(newProduct)) {
//       updateProducts((current) => [...current, newProduct])
//       setNewProduct('')
//     }
//   }

//   const editProduct = (index, newValue) => {
//     if (newValue !== value[index]) {
//       updateProducts((current) => {
//         const updated = [...current]
//         updated[index] = newValue
//         return updated
//       })
//     }
//   }

//   const removeProduct = (index) => {
//     updateProducts((current) => current.filter((_, i) => i !== index))
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         {/* Display existing products */}
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

// import React, {useEffect, useState, useRef} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange} = props
//   const ingredients = useFormValue(['ingredients'])
//   const [newProduct, setNewProduct] = useState('')
//   const prevIngredientsRef = useRef(ingredients)
//   const isUpdatingRef = useRef(false) // Flag to prevent recursion

//   // Extract last word from ingredient names
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient?.name || ''
//         const words = name.trim().split(/\s+/)
//         return words[words.length - 1] || ''
//       })
//       .filter(Boolean)
//     return [...new Set(products)].sort() // Consistent sort for comparison
//   }

//   /**
//    * Auto-derive products whenever ingredients change:
//    * Only update if products are empty or if ingredients actually changed (not self-update).
//    * Use ref for prev to avoid dep loop.
//    */
//   useEffect(() => {
//     if (isUpdatingRef.current) return // Skip if we're in the middle of an update
//     if (!ingredients || ingredients.length === 0) return

//     const derived = computeProducts(ingredients)
//     const currentProducts = value || []

//     // Only update if empty or if derivation differs (stable compare)
//     if (
//       currentProducts.length === 0 ||
//       JSON.stringify(derived) !== JSON.stringify(currentProducts)
//     ) {
//       isUpdatingRef.current = true
//       onChange(PatchEvent.from(set(derived)))
//       // Reset flag after microtask to allow value update
//       Promise.resolve().then(() => {
//         isUpdatingRef.current = false
//       })
//     }

//     // Always update ref
//     prevIngredientsRef.current = ingredients
//   }, [ingredients, onChange, value]) // Keep value dep but flag protects

//   // --- Manual edit handlers ---

//   const updateProducts = (updaterFn) => {
//     isUpdatingRef.current = true
//     const updated = updaterFn(value)
//     onChange(PatchEvent.from(set(updated)))
//     Promise.resolve().then(() => {
//       isUpdatingRef.current = false
//     })
//   }

//   const addProduct = () => {
//     if (newProduct && !value.includes(newProduct)) {
//       updateProducts((current) => [...current, newProduct].sort()) // Sort for consistency
//       setNewProduct('')
//     }
//   }

//   const editProduct = (index, newValue) => {
//     if (newValue !== value[index]) {
//       updateProducts((current) => {
//         const updated = [...current]
//         updated[index] = newValue
//         return updated.sort() // Sort after edit
//       })
//     }
//   }

//   const removeProduct = (index) => {
//     updateProducts((current) => current.filter((_, i) => i !== index).sort())
//   }

//   return (
//     <Card padding={3} tone="default">
//       <Label>Products</Label>
//       <Box marginTop={2}>
//         {/* Display existing products */}
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

// import React, {useEffect, useState, useRef} from 'react'
// import PropTypes from 'prop-types'
// import {useFormValue, PatchEvent, set} from 'sanity'
// import {Box, Button, Flex, TextInput, Label, Card} from '@sanity/ui'

// const ProductsInput = (props) => {
//   const {value = [], onChange, readOnly = false} = props // Destructure readOnly
//   const ingredients = useFormValue(['ingredients'])
//   const [newProduct, setNewProduct] = useState('')
//   const [autoMode, setAutoMode] = useState(true) // Track if in auto-derivation mode
//   const isUpdatingRef = useRef(false) // Flag to prevent recursion during updates
//   const initializedRef = useRef(false) // Track if init has run

//   // Extract last word from ingredient names
//   const computeProducts = (ingredients) => {
//     if (!ingredients || !Array.isArray(ingredients)) {
//       return []
//     }
//     const products = ingredients
//       .map((ingredient) => {
//         const name = ingredient?.name || ''
//         const words = name.trim().split(/\s+/)
//         return words[words.length - 1] || ''
//       })
//       .filter(Boolean)
//     return [...new Set(products)].sort() // Consistent sort for comparison
//   }

//   // Safe patch helper
//   const safePatch = (patch) => {
//     if (readOnly || isUpdatingRef.current) return
//     isUpdatingRef.current = true
//     onChange(patch)
//     Promise.resolve().then(() => {
//       isUpdatingRef.current = false
//     })
//   }

//   // --- Initialization: Determine mode only once when both value and ingredients are ready ---
//   useEffect(() => {
//     if (
//       initializedRef.current ||
//       !ingredients ||
//       ingredients.length === 0 ||
//       value === undefined ||
//       readOnly
//     )
//       return

//     const derived = computeProducts(ingredients)
//     const current = value || []
//     const currentSorted = [...current].sort()
//     const derivedSorted = [...derived].sort()

//     if (current.length === 0 || currentSorted.join(',') === derivedSorted.join(',')) {
//       // Empty or matches derived: enable auto mode
//       setAutoMode(true)
//       if (current.length === 0) {
//         // Only set if empty (no-op if already matching)
//         safePatch(PatchEvent.from(set(derived)))
//       }
//     } else {
//       // Doesn't match: manual mode, skip auto
//       setAutoMode(false)
//     }

//     initializedRef.current = true
//   }, [ingredients, value, readOnly]) // Depend on ready states, but ref prevents re-run

//   // --- Auto-update on ingredients change (only in auto mode, after init) ---
//   useEffect(() => {
//     if (
//       !autoMode ||
//       !initializedRef.current ||
//       !ingredients ||
//       ingredients.length === 0 ||
//       readOnly ||
//       isUpdatingRef.current
//     )
//       return

//     const derived = computeProducts(ingredients)
//     safePatch(PatchEvent.from(set(derived)))
//   }, [ingredients, autoMode, readOnly]) // Depend on ingredients and mode

//   // --- Manual edit handlers (flip to manual mode) ---
//   const updateProducts = (updaterFn) => {
//     if (readOnly) return // No-op if read-only
//     if (isUpdatingRef.current) return // Prevent recursion
//     setAutoMode(false) // Any manual update disables auto mode
//     const updated = updaterFn(value)
//     safePatch(PatchEvent.from(set(updated)))
//   }

//   const addProduct = () => {
//     if (newProduct && !value.includes(newProduct)) {
//       updateProducts((current) => [...current, newProduct].sort())
//       setNewProduct('')
//     }
//   }

//   const editProduct = (index, newValue) => {
//     if (newValue !== value[index]) {
//       updateProducts((current) => {
//         const updated = [...current]
//         updated[index] = newValue
//         return updated.sort()
//       })
//     }
//   }

//   const removeProduct = (index) => {
//     updateProducts((current) => current.filter((_, i) => i !== index).sort())
//   }

//   // Disable manual inputs if read-only
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
//         {/* Display existing products */}
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
//   readOnly: PropTypes.bool,
// }

// export default ProductsInput

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
        return words[words.length - 1] || ''
      })
      .filter(Boolean)
    return [...new Set(products)].sort() // Dedupe and sort
  }

  // Generate button handler
  const generateProducts = () => {
    if (!ingredients || ingredients.length === 0) return
    const derived = computeProducts(ingredients)
    onChange(PatchEvent.from(set(derived)))
  }

  // --- Manual edit handlers ---
  const updateProducts = (updaterFn) => {
    if (readOnly) return
    const updated = updaterFn(value)
    onChange(PatchEvent.from(set(updated)))
  }

  const addProduct = () => {
    if (newProduct && !value.includes(newProduct)) {
      updateProducts((current) => [...current, newProduct].sort())
      setNewProduct('')
    }
  }

  const editProduct = (index, newValue) => {
    if (newValue !== value[index]) {
      updateProducts((current) => {
        const updated = [...current]
        updated[index] = newValue
        return updated.sort()
      })
    }
  }

  const removeProduct = (index) => {
    updateProducts((current) => current.filter((_, i) => i !== index).sort())
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
        {/* Generate button */}
        <Button
          text="Generate Products from Ingredients"
          tone="primary"
          mode="ghost"
          onClick={generateProducts}
          disabled={!ingredients || ingredients.length === 0}
          style={{marginBottom: '1rem'}}
        />

        {/* Display existing products */}
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