"use client"

import { useParams } from "react-router"
import { useGetUserQuery } from "../../store/api/usersApi"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { Link } from "react-router"
import React from "react"

export default function UserProfilePage() {
  const params = useParams()
  const id = params.id as string

  const { data: user, isLoading, isError } = useGetUserQuery(id)

  const [activeTab, setActiveTab] = React.useState("overview")

  // Download document handler
  const handleDownload = async (url: string, fileName: string) => {
    try {
      // Fetch the file
      const response = await fetch(url)
      const blob = await response.blob()
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download document. Please try again.')
    }
  }

  const calculateProfileComplete = () => {
    if (!user) return 0
    if (user.type === "individual") {
      let completed = 0
      const total = 7
      if (user.firstName) completed++
      if (user.lastName) completed++
      if (user.email) completed++
      if (user.phone) completed++
      if (user.country) completed++
      if (user.city) completed++
      if (user.documents.length > 0) completed++
      return Math.round((completed / total) * 100)
    } else {
      let completed = 0
      const total = 9
      if (user.legalCompanyName) completed++
      if (user.pocName) completed++
      if (user.pocEmail) completed++
      if (user.pocPhone) completed++
      if (user.email) completed++
      if (user.phone) completed++
      if (user.city) completed++
      if (user.taxNumber) completed++
      if (user.documents.length > 0) completed++
      return Math.round((completed / total) * 100)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
          <p className="mt-4 text-center text-gray-600">Loading user profile...</p>
        </div>
      </main>
    )
  }

  if (isError || !user) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist</p>
            <Link to="/users">
              <button className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                Back to Users
              </button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="">
        <div className="mb-6">
          <Link to="/users">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
          </Link>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              {user.type === "individual" ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.primaryRole}</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">{user.legalCompanyName}</h1>
                  <p className="text-gray-600">Company Account</p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Profile Complete</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${user.profile_complete}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-900 w-12 text-right">{user.profile_complete}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            {["overview", "details", "documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-3 font-medium border-b-2 transition-all capitalize ${
                  activeTab === tab
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="text-gray-900 font-medium">{user.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="text-gray-900 font-medium">{user.city}</p>
                </div>
                {user.portfolio && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Portfolio / Website</p>
                    <a
                      href={user.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      {user.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents Uploaded</h2>
              <div className="flex flex-wrap gap-2">
                {user.documents.length > 0 ? (
                  user.documents.map((doc) => (
                    <span
                      key={doc.id}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {doc.type.replace(/_/g, " ")}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            {user.type === "individual" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="text-gray-900 font-medium">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="text-gray-900 font-medium">{user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Primary Role</p>
                    <p className="text-gray-900 font-medium">{user.primaryRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="text-gray-900 font-medium">{user.yearsOfExperience}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Legal Company Name</p>
                      <p className="text-gray-900 font-medium">{user.legalCompanyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tax Number</p>
                      <p className="text-gray-900 font-medium">{user.taxNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration Number</p>
                      <p className="text-gray-900 font-medium">{user.registrationNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company Size</p>
                      <p className="text-gray-900 font-medium">{user.companySize}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Point of Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-gray-900 font-medium">{user.pocName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900 font-medium">{user.pocEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900 font-medium">{user.pocPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
            {user.documents.length > 0 ? (
              <div className="space-y-3">
                {user.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.type.replace(/_/g, " ").charAt(0).toUpperCase() + doc.type.replace(/_/g, " ").slice(1)} •
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc.url} download={doc.name} target="_blank"
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No documents uploaded yet</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}