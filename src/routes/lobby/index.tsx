import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/lobby/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lobby/"!

    <Link  params={{userId:'1'}} to="/lobby/$userId">
      <div>
        <h1>1</h1>
      </div>
    </Link>
  </div>
}
