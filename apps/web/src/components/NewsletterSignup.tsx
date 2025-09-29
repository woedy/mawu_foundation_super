import { FormEvent, useState } from "react";

import { Button } from "../design-system";
import { cn } from "../lib/cn";
import { API_BASE_URL } from "../lib/config";
import { trackEvent } from "../lib/analytics";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Add your email so we can send updates.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/engage/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          source: "web_footer",
          interests: ["investor-updates"],
          consent: true,
        }),
      });

      let payload: { message?: string } | null = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(
          payload?.message ??
            "We could not add you to the newsletter right now. Please try again shortly.",
        );
      }

      setStatus("success");
      setMessage(
        payload?.message ??
          "Medasi! You are now on the impact update list. Check your inbox for a welcome note soon.",
      );
      setEmail("");
      trackEvent("newsletter_subscribed", {
        status: "success",
        source: "web_footer",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "We could not add you to the newsletter right now. Please try again shortly.";

      setStatus("error");
      setMessage(errorMessage);
      trackEvent("newsletter_subscribed", {
        status: "error",
        source: "web_footer",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackTone =
    status === "success"
      ? "text-emerald-300"
      : status === "error"
        ? "text-rose-300"
        : "text-white/60";

  return (
    <div className="space-y-2">
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        noValidate
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          aria-invalid={status === "error"}
          autoComplete="email"
          className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/60 focus:border-brand-200 focus:ring-brand-200 focus:outline-none disabled:cursor-not-allowed"
          disabled={submitting}
          id="newsletter-email"
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          placeholder="Enter your email"
          required
          type="email"
          value={email}
        />
        <Button
          aria-busy={submitting}
          disabled={submitting}
          size="md"
          type="submit"
          variant="secondary"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {message ? (
        <p
          aria-live="polite"
          className={cn("text-xs font-semibold", feedbackTone)}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
};
