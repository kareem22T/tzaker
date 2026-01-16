import type { ContactMessage } from "../../../store/contactMessagesSlice"
import { MessageSquare } from "lucide-react"
import {Link} from "react-router"

interface MessagesPreviewProps {
  messages: ContactMessage[]
}

export function MessagesPreview({ messages }: MessagesPreviewProps) {
  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Messages</h2>
            <p className="text-sm text-muted-foreground">Latest contact form submissions</p>
          </div>
          <MessageSquare className="w-5 h-5 text-blue-600 darkx:text-blue-400" />
        </div>
      </div>
      {/* Content */}
      <div className="p-6 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors border-l-4 border-blue-500"
            >
              <p className="text-sm font-medium text-foreground">
                {msg.firstName} {msg.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{msg.subject}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
        )}
        <Link to="/contact-messages" className="text-xs text-blue-600 darkx:text-blue-400 hover:underline block pt-2">
          View all messages →
        </Link>
      </div>
    </div>
  )
}
