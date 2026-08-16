"use client";

/**
 * /get-started?plan=monthly|6-months|yearly — the checkout-style lead form
 * (Shamil 2026-08-16). Pricing cards no longer carry fields; their Get
 * started button lands here with the plan preselected. Deliberately styled
 * Payoneer-like (clean white, orange accent, none of the site's sage) so the
 * visitor is mentally in "payment" mode before the Payoneer redirect.
 *
 * Submit → POST /api/lead (contact + plan tag into GHL) → redirect to that
 * plan's Payoneer link. Buyer reaches payment even if the lead save fails.
 */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { PAYMENT_LINKS, PLATFORM_BILLING_PERIODS } from "@/lib/pricing";

function GetStartedForm() {
  const params = useSearchParams();
  const initial = params.get("plan") ?? "monthly";
  const [plan, setPlan] = useState(
    PLATFORM_BILLING_PERIODS.some((p) => p.id === initial) ? initial : "monthly"
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email"),
          plan,
        }),
      });
    } catch {
      // Never block the payment redirect on a lead-capture failure.
    }
    window.location.href = PAYMENT_LINKS[plan as keyof typeof PAYMENT_LINKS];
  }

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1C71DF] focus:outline-none focus:ring-1 focus:ring-[#1C71DF]";

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      {/* Payoneer-style header */}
      <div className="mb-6 text-center">
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-[#1C71DF] uppercase">
          Erken Systems
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Get started
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose your plan — secure payment via Payoneer on the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Plan selector */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          {PLATFORM_BILLING_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`rounded-lg border px-2 py-3 text-center transition-colors ${
                plan === p.id
                  ? "border-[#1C71DF] bg-[#1C71DF]/5 ring-1 ring-[#1C71DF]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="block text-lg font-bold text-gray-900">
                ${p.perMonth}
                <span className="text-xs font-normal text-gray-500">/mo</span>
              </span>
              <span className="block text-[11px] text-gray-500">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" required placeholder="First name" autoComplete="given-name" className={inputCls} />
            <input name="lastName" required placeholder="Last name" autoComplete="family-name" className={inputCls} />
          </div>
          <input name="email" required type="email" placeholder="Email" autoComplete="email" className={inputCls} />
          <input name="phone" required type="tel" placeholder="Phone" autoComplete="tel" className={inputCls} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #8D63DA, #1C71DF)" }}
        >
          {submitting ? "One moment…" : "Continue to pay →"}
        </button>

        <ul className="mt-5 space-y-1.5 text-xs text-gray-500">
          {["No contracts — cancel anytime", "No setup fee", "Live in 7–10 days"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#1C71DF]" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense>
        <GetStartedForm />
      </Suspense>
    </div>
  );
}
