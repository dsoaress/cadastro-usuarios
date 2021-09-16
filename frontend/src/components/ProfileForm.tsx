import { Button, Heading, HStack, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
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
import { FileInput } from './FileInput'
import { Form } from './Form'
import { Input } from './Input'
import { ProfileCard } from './ProfileCard'

type UserFormData = {
  code: string
  name: string
  birthDate: string
  image?: string
}

export function ProfileForm() {
  const { userId }: { userId?: string } = useParams()
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

  const FILE_SIZE = 1000000
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

  const profileFormSchema = yup.object().shape({
    code: yup.string().required('Código é um campo requerido'),
    name: yup.string().required('Nome é um campo requerido'),
    birthDate: yup
      .string()
      .matches(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
        'A data informada é inválida (dd/mm/aaaa)'
      )
      .required('Data de aniversário é um campo requerido'),
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test('FILE_SIZE', 'Arquivo maior que o suportado', value => {
        return !value || (value && value.length > 0 && value[0].size <= FILE_SIZE)
      })
      .test(
        'FILE_FORMAT',
        'O aquivo não é um formato suportado',
        value => !value || (value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
      )
  })

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { ...user, image: '' },
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
    const formData = new FormData()

    if (values.image) formData.append('image', values.image[0])
    formData.append('code', values.code)
    formData.append('name', values.name)
    formData.append('birthDate', reverseDate(values.birthDate))

    if (userId) {
      try {
        const { data: updatedUser } = await api.patch<User>(`users/${userId}`, formData, {
          headers: { 'Content-Type': `multipart/form-data` }
        })

        toast({
          description: `Usuário(a) ${updatedUser.name} foi atualizado(a)`,
          status: 'success'
        })

        history.push('/')
      } catch (err) {
        const apiError = err as AxiosError

        if (apiError.response?.status === 403) {
          toast({
            description: 'Já existe um(a) usuário(a) cadastrado(a) com esse código...',
            status: 'error'
          })
          setIsLoading(false)
          return
        }

        toast({
          description: 'Nossos servidores estão passando por dificuldades...',
          status: 'error'
        })
      }
    } else {
      try {
        const { data: newUser } = await api.post<User>('users', formData, {
          headers: { 'Content-Type': `multipart/form-data` }
        })

        toast({
          description: `Usuário(a) ${newUser.name} foi salvo(a)`,
          status: 'success'
        })

        history.push('/')
      } catch (err) {
        const apiError = err as AxiosError

        if (apiError.response?.status === 403) {
          toast({
            description: 'Já existe um(a) usuário(a) cadastrado(a) com esse código...',
            status: 'error'
          })
          setIsLoading(false)
          return
        }

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
        {user && <ProfileCard user={user} />}

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
          icon={<HiOutlineCalendar />}
          label="Data de aniversário"
          placeholder="dd/mm/aaaa"
          error={errors.birthDate}
          mask
          {...register('birthDate')}
        />
        <FileInput label="Imagem" error={errors.image} {...register('image', { value: '' })} />

        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Salvar
        </Button>
      </Form>
    </Container>
  )
}
