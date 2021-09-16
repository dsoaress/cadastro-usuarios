import { FormControl, FormErrorMessage, FormLabel, InputGroup } from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  error?: FieldError
}

const FileInputBase: ForwardRefRenderFunction<HTMLInputElement, FileInputProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} id={name}>
        {label}
      </FormLabel>
      <InputGroup>
        <input name={name} id={name} ref={ref} type="file" {...rest} />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}

export const FileInput = forwardRef(FileInputBase)
