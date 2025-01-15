import { useQuery, useZero } from '@rocicorp/zero/react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/lobby/')({
  component: RouteComponent,
})

function RouteComponent() {

  const z = useZero()
  const [el] = useQuery(z.query.element)
  console.log(el)
  return <div>Hello "/lobby/"!

    <Link  params={{userId:'1'}} to="/lobby/$userId">
      <div>
        <h1>1</h1>
      </div>
    </Link>
  </div>
}
