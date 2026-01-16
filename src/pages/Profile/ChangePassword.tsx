"use client"

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";

export default function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = { current_password: currentPassword, new_password: newPassword, new_password_confirmation: confirmPassword };
      const res = await changePassword(payload);
      if (res && (res.success || res.message === "Profile updated successfully")) {
        setMessage("Password changed successfully");
        setTimeout(() => navigate("/"), 800);
      } else {
        setMessage(res?.message || "Change password failed");
      }
    } catch (err: any) {
      setMessage(err?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Current password</label>
            <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">New password</label>
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm new password</label>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" />
          </div>

          {message && <p className="text-sm text-gray-700">{message}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="px-4 py-2">
              {loading ? "Updating..." : "Change Password"}
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
