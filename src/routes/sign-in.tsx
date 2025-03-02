import { SignIn } from '@clerk/clerk-react'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: HomeComponent,
})

function HomeComponent() {
  const router = useRouterState()
  const from = router.redirect?._fromLocation?.href || '/lobby'

  return <section className="min-h-[calc(100vh-4rem-100px)] w-screen flex items-center justify-center bg-[#FFF6EB]">
    <SignIn  forceRedirectUrl={from} />
  </section>
}
