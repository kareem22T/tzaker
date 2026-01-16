import { BASE_URL } from "../store/config";

export type AuthResponse = {
  success: boolean;
  data?: any;
  token?: string;
  message?: string;
};

export async function signInRequest(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getProfileRequest(token: string) {
  const res = await fetch(`${BASE_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.json();
}

export async function updateProfileRequest(token: string, payload: any) {
  const res = await fetch(`${BASE_URL}/admin/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function changePasswordRequest(token: string, payload: any) {
  // Uses same endpoint as profile update in backend (per Postman collection)
  const res = await fetch(`${BASE_URL}/admin/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
