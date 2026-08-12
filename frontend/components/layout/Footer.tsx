import Link from "next/link";
import { Compass, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <Compass className="h-5 w-5" />
            TourMate
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Discover curated tour packages, book with confidence, and share your
            travel experiences with a trusted community across Bangladesh.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="transition hover:text-emerald-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/packages" className="transition hover:text-emerald-400">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition hover:text-emerald-400">
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="transition hover:text-emerald-400"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              support@tourmate.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TourMate. All rights reserved.
      </div>
    </footer>
  );
}
