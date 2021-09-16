import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { Link, useHistory } from 'react-router-dom'

import { api } from '../services/api'
import { User } from '../types/User'
import { formatDate } from '../utils/formatDate'
import { Container } from './Container'

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    api
      .get<User[]>('users')
      .then(({ data }) => {
        setUsers(data)
      })
      .catch(err => console.log(err))

    setIsLoading(false)
  }, [])

  return (
    <Container>
      <HStack justify="space-between" mb={12}>
        <Heading fontSize="3xl" fontWeight="black">
          Usuários
        </Heading>
        <Button colorScheme="blue" aria-label="Voltar" onClick={() => history.push('/add-user')}>
          <HiOutlinePlusCircle size={24} />
        </Button>
      </HStack>

      <Stack>
        {isLoading && (
          <>
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
          </>
        )}

        {users.map(user => {
          const birthDate = formatDate(user.birthDate)

          return (
            <LinkBox bg="gray.100" borderRadius="md" boxShadow="sm" p={4} key={user.id}>
              <HStack>
                <Avatar src={user.image} name={user.name} />
                <Box>
                  <LinkOverlay as={Link} to={`/${user.id}`}>
                    <Text fontWeight="bold">{user.name}</Text>
                  </LinkOverlay>
                  <HStack align="center">
                    <HiOutlineCalendar />
                    <Text fontSize="xs" color="gray.500">
                      {birthDate}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            </LinkBox>
          )
        })}
      </Stack>
    </Container>
  )
}
