import { Button, Heading, HStack, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  HiOutlineArrowLeft,
  HiOutlineAtSymbol,
  HiOutlineCalendar,
  HiOutlineUser
} from 'react-icons/hi'
import { useHistory, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { api } from '../services/api'
import { User } from '../types/User'
import { formatDate } from '../utils/formatDate'
import { reverseDate } from '../utils/reverseDate'
import { Container } from './Container'
import { Form } from './Form'
import { Input } from './Input'

type UserFormData = {
  code: string
  name: string
  birthDate: string
}

export function ProfileForm() {
  const { userId }: { userId?: string } = useParams()
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const profileFormSchema = yup.object().shape({
    code: yup.string().required('Código é um campo requerido'),
    name: yup.string().required('Nome é um campo requerido'),
    birthDate: yup
      .string()
      .matches(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
        'A data informada é inválida (dd/mm/aaaa)'
      )
      .required('Data de aniversário é um campo requerido')
  })

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: user,
    resolver: yupResolver(profileFormSchema)
  })

  const { errors } = formState

  useEffect(() => {
    if (userId) {
      api
        .get<User>(`users/${userId}`)
        .then(({ data }) => {
          const userResponse = { ...data, birthDate: formatDate(data.birthDate) }
          setUser(userResponse)
          reset(userResponse)
        })
        .catch(() => {
          history.push('/')
        })
    }
  }, [history, reset, userId])

  const handleSubmitProfile: SubmitHandler<UserFormData> = async values => {
    setIsLoading(true)
    console.log(values.birthDate)

    if (userId) {
      try {
        const { data: updatedUser } = await api.patch<User>(`users/${userId}`, {
          ...values,
          birthDate: reverseDate(values.birthDate)
        })

        toast({
          description: `Usuário(a) ${updatedUser.name} foi atualizado(a)`,
          status: 'success'
        })
      } catch {
        toast({
          description: 'Nossos servidores estão passando por dificuldades...',
          status: 'error'
        })
      }
    } else {
      try {
        const { data: newUser } = await api.post<User>('users', {
          ...values,
          birthDay: reverseDate(values.birthDate)
        })

        toast({
          description: `Usuário(a) ${newUser.name} foi salvo(a)`,
          status: 'success'
        })

        history.push('/')
      } catch {
        toast({
          description: 'Nossos servidores estão passando por dificuldades...',
          status: 'error'
        })
      }
    }

    setIsLoading(false)
  }

  return (
    <Container>
      <HStack mb={12}>
        <Button variant="unstyled" aria-label="Voltar" onClick={() => history.goBack()}>
          <HiOutlineArrowLeft />
        </Button>
        <Heading fontSize="3xl" fontWeight="black">
          {userId ? 'Edição do perfil' : 'Criar usuário(a)'}
        </Heading>
      </HStack>

      <Form onSubmit={handleSubmit(handleSubmitProfile)}>
        <Input
          icon={<HiOutlineAtSymbol />}
          label="Código"
          placeholder="Código do usuário"
          error={errors.code}
          {...register('code')}
        />
        <Input
          icon={<HiOutlineUser />}
          label="Nome"
          placeholder="Nome completo"
          error={errors.name}
          {...register('name')}
        />
        <Input
          icon={<HiOutlineUser />}
          label="Nome"
          type="file"
          placeholder="Nome completo"
          // error={errors.name}
          {...register('name')}
        />
        <Input
          icon={<HiOutlineCalendar />}
          label="Data de aniversário"
          placeholder="dd/mm/aaaa"
          error={errors.birthDate}
          mask
          {...register('birthDate')}
        />

        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Salvar
        </Button>
      </Form>
    </Container>
  )
}
