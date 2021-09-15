import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <Box maxW="container.md" px={8} mx="auto">
      {children}
    </Box>
  )
}
