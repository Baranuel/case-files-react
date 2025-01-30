import { SignIn } from '@clerk/clerk-react'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: HomeComponent,
})

function HomeComponent() {
  const router = useRouterState()
  const from = router.redirect?._fromLocation?.pathname || '/lobby'

  return <section className="flex-1 flex items-center justify-center">
    <SignIn  forceRedirectUrl={from} />
  </section>
}
