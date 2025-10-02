import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Body, Button, Heading, Section } from "../design-system";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await api.post("/api/admin/login", formData);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Section background="muted">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Heading level={1}>Admin Login</Heading>
          <Body className="mt-2" variant="muted">Access the admin dashboard</Body>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-8 shadow-lg">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full rounded border border-ink-300 px-3 py-2"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">Login</Button>
        </form>
      </div>
    </Section>
  );
};
