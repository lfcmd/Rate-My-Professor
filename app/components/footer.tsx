import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: "/", text: "About Us" },
    { href: "/#faq", text: "FAQ" },
    { href: "/", text: "Contact" },
    { href: "/blog", text: "Blog" },
  ]

  const legalLinks = [
    { href: "/privacy-policy", text: "Privacy Policy" },
    { href: "/terms-of-service", text: "Terms of Service" },
    { href: "/", text: "Shipping Info" },
    { href: "/", text: "Returns" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">RateMyProfessor.space</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              AI-Powered Professor Review Generator.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.text}>
                    <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.text}>
                    <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {currentYear} RateMyProfessor.space. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 