export function UserNav(): JSX.Element {
  return (
    <nav className="flex items-center">
      {/* Placeholder for user navigation - can be expanded later */}
      <button className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center">
        <span className="sr-only">User menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </nav>
  )
}
