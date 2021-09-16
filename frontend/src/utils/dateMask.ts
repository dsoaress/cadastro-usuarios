import { FormEvent } from 'react'

export function dateMask(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 10
  let value = e.currentTarget.value

  if (!value.match(/^(\d{2})(\/)(\d{2})(\/)(\d{4})$/)) {
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, '$1/$2')
    value = value.replace(/(\d{2})(\d)/, '$1/$2')
    e.currentTarget.value = value
  }

  return e
}
