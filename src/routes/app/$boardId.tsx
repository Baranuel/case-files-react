import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$boardId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {boardId} = Route.useParams()

  return <div>Hello {boardId}</div>
}
