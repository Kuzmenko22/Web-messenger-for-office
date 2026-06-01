import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100 flex justify-start gap-4 px-4 py-3 shadow-md">
      <Link href="/api/auth/signout" className="btn btn-outline btn-error flex items-center gap-2 transition duration-300 hover:scale-105">
        {session.user?.name}
        <span>Выход</span>
      </Link>
      <Link href="/" className="btn bg-blue-200 text-blue-800 hover:bg-blue-300 transition duration-300 hover:scale-105 shadow-sm">
        Планировщик задач
      </Link>
      <Link href="/clients" className="btn bg-green-200 text-green-800 hover:bg-green-300 transition duration-300 hover:scale-105 shadow-sm">
        Центр управления клиентами и договорами
      </Link>
      <Link href="/user" className="btn bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300 hover:scale-105 shadow-sm">
        Центр сотрудников
      </Link>
    </div>
  );
}