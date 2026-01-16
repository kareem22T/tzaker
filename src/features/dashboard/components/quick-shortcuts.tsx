import {Link} from "react-router"
import { FileText, Users, MessageSquare, Settings, BarChart3, HelpCircle } from "lucide-react"

export function QuickShortcuts() {
  const shortcuts = [
    {
      title: "Applications",
      icon: FileText,
      href: "/applications",
      color: "text-blue-600 darkx:text-blue-400",
    },
    {
      title: "Users",
      icon: Users,
      href: "/users",
      color: "text-green-600 darkx:text-green-400",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/contact-messages",
      color: "text-purple-600 darkx:text-purple-400",
    },
    {
      title: "Departments",
      icon: BarChart3,
      href: "/departments",
      color: "text-orange-600 darkx:text-orange-400",
    },
    {
      title: "FAQs",
      icon: HelpCircle,
      href: "/faqs",
      color: "text-red-600 darkx:text-red-400",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/site-content",
      color: "text-gray-600 darkx:text-gray-400",
    },
  ]

  return (
    <div className="border border-border bg-card rounded-lg p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon
          return (
            <Link key={shortcut.href} to={shortcut.href}>
              <div className="w-full h-auto flex flex-col gap-3 p-4 hover:bg-accent transition-colors rounded-lg cursor-pointer border border-border/50 hover:border-border">
                <Icon className={`w-6 h-6 ${shortcut.color}`} />
                <span className="text-xs font-medium text-center text-foreground">{shortcut.title}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
