import { ChakraProvider } from '@chakra-ui/react'

import { Routes } from './Routes'

export function App() {
  return (
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  )
}
