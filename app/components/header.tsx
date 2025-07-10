import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/placeholder-logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-bold">RateMyProfessor</span>
      </Link>
      <nav>
        <Link href="/review">
          <Button>Get Started</Button>
        </Link>
      </nav>
    </header>
  );
} 