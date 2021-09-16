import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputProps as ChakraInputProps
} from '@chakra-ui/react'
import { FormEvent, forwardRef, ForwardRefRenderFunction, ReactElement, useCallback } from 'react'
import { FieldError } from 'react-hook-form'

import { dateMask } from '../utils/dateMask'

interface InputProps extends ChakraInputProps {
  name: string
  label: string
  icon?: ReactElement
  error?: FieldError
  mask?: boolean
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, icon, mask, error = null, ...rest },
  ref
) => {
  const handleKeyUp = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (mask) {
        dateMask(e)
      }
    },
    [mask]
  )

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} id={name}>
        {label}
      </FormLabel>
      <InputGroup>
        {icon && <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>}
        <ChakraInput name={name} id={name} ref={ref} onKeyUp={handleKeyUp} {...rest} />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)
