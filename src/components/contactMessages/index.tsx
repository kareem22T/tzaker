import { ContactMessagesList } from "./components/contact-messages-list"

export default function ContactMessagesPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Messages</h1>
          <p className="text-gray-600">View all messages received from your contact form</p>
        </div>

        <ContactMessagesList />
      </div>
    </main>
  )
}
