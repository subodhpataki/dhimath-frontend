import Link from "next/link";
import { Button } from "@/components/greywiz-ui/button";
import { FaUsers, FaUserShield } from "react-icons/fa"; 


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-100 via-pink-100 to-yellow-100">
      <div className="w-full max-w-md rounded-3xl border border-pink-300 bg-white p-10 shadow-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Welcome!
          </h1>
          <p className="mt-2 text-sm text-indigo-500">
            Choose your role to continue
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/org-admin" className="w-full">
            <Button
              size="lg"
              className="w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg"
            >
              <FaUserShield /> Organization Admin
            </Button>
          </Link>

          <Link href="/greywiz-admin" className="w-full">
            <Button
              size="lg"
              variant="outline" 
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-pink-400 text-pink-600 hover:bg-pink-50 shadow hover:shadow-pink-200"
            >
              <FaUsers /> Greywiz Admin
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-indigo-400">
          &copy; {new Date().getFullYear()} Greywiz
        </p>
      </div>
    </div>
  );
}
