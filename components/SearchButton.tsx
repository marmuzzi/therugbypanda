import Link from "next/link";

export default function SearchButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/search"
      aria-label="Search The Rugby Panda"
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition hover:text-[#9BE564] ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2">
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        <circle cx="11" cy="11" r="7" />
      </svg>
    </Link>
  );
}
