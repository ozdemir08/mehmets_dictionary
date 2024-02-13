import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function NavigationBar() {
  return (
    <nav>
      <div className="mx-auto flex max-w-screen-lg flex-wrap items-center justify-between bg-gray-50 p-8">
        <div className="space-x-6">
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-xl hover:bg-gray-200"
          >
            Mehmet&apos;s Dictionary
          </Link>

          <Link
            href="/quiz"
            className="rounded-md px-2 py-1 text-xl hover:bg-gray-200"
          >
            Quiz
          </Link>

          <Link
            href="/stats"
            className="rounded-md px-2 py-1 text-xl hover:bg-gray-200"
          >
            Stats
          </Link>
        </div>
        <div className="items-center justify-self-end">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
