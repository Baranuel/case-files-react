import { createFileRoute, Link } from '@tanstack/react-router'

// First, define the Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  lastModified: string;
  collaborators: number;
  thumbnail?: string;
}

// Sample project data
const projects: Project[] = [
  {
    id: '1',
    title: 'Mind Map Project',
    description: 'Interactive canvas for creating visual mind maps and connections',
    lastModified: '2 hours ago',
    collaborators: 3,
  },
  {
    id: '2',
    title: 'Project Timeline',
    description: 'Collaborative timeline for tracking project milestones',
    lastModified: '1 day ago',
    collaborators: 5,
  },
];

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#1A1814] flex">
      <aside className="w-64 bg-[#2C2420] text-amber-100 min-h-screen shadow-lg border-r border-amber-900/30">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 text-amber-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Case Files
          </h1>
          <a 
            href="/new-project" 
            className="bg-amber-900/80 hover:bg-amber-800/90 px-4 py-2 rounded-lg transition-colors block text-center border border-amber-700/50"
          >
            New Investigation
          </a>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/app/$boardId"
              params={{boardId: project.id}}
            >
            <div 
              className="bg-[#3B3027] rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-amber-900/20 transform hover:-translate-y-1"
            >
              <div className="relative">
                {project.thumbnail ? (
                  <img 
                    src={project.thumbnail} 
                    alt={project.title} 
                    className="w-full h-40 object-cover rounded-md mb-4 opacity-80"
                  />
                ) : (
                  <div className="w-full h-40 bg-[#2C2420] rounded-md mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-amber-900/80 px-2 py-1 rounded text-xs text-amber-100">
                  Case #{project.id}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-amber-100 mb-2 font-serif">{project.title}</h2>
              <p className="text-amber-100/70 mb-4 text-sm">{project.description}</p>
              <div className="flex justify-between items-center text-sm text-amber-100/50 border-t border-amber-900/30 pt-4">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {project.lastModified}
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {project.collaborators} detectives
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Quick Actions Menu */}
      <div className="fixed bottom-8 right-8">
        <button 
          className="bg-amber-900 text-amber-100 hover:bg-amber-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-amber-700/50 hover:scale-110"
          aria-label="Quick actions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/lobby/$userId')({
  component: RouteComponent,
})
