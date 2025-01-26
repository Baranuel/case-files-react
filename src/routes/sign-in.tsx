import { SignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: HomeComponent,
})

function HomeComponent() {
  return   <SignIn forceRedirectUrl={'/lobby'} /> 
}
