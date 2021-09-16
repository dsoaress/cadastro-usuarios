export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-br', {
    dateStyle: 'short',
    timeZone: 'UTC'
  })
}
