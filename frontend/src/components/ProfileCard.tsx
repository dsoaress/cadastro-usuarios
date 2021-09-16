import { Avatar, HStack, Text } from '@chakra-ui/react'

import { User } from '../types/User'

type ProfileCardProps = {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <HStack alignItems="center">
      <Avatar src={user.image} name={user.name} />
      <Text fontWeight="bold">{user.name}</Text>
    </HStack>
  )
}
