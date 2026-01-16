"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim());
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = { name, email };
    try {
      const res = await updateProfile(payload);
      if (res && (res.success || res.data)) {
        setMessage("Profile updated successfully");
        setTimeout(() => navigate("/"), 800);
      } else {
        setMessage(res?.message || "Update failed");
      }
    } catch (err: any) {
      setMessage(err?.message || "Update error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          {message && <p className="text-sm text-gray-700">{message}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="px-4 py-2">
              {loading ? "Saving..." : "Save"}
            </Button>
            <Link to="/">
              <button type="button" className="px-4 py-2 border rounded">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
