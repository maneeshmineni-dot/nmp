import React, { useState } from "react";
import { MapPin, Mail, Phone, Send, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ 
          type: "success", 
          message: data.message || "Thank you for reaching out. Your inquiry has been sent to mmrocktu@gmail.com." 
        });
        setFormState({ name: "", email: "", message: "" });
        // Automatically hide success notification after 5 seconds to allow another message
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send inquiry. Please try again."
        });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitStatus({
        type: "error",
        message: "A network error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-us"
      className="py-16 md:py-24 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 md:p-12 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Info */}
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-widest block">
              Contact Us
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              Let's build your Vision together
            </h2>
            <div className="w-16 h-1 bg-amber-500 rounded" />
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
            Have a project concept or need surveying, design, or contracting assistance? Reach out to NME Group for structurally-sound and value-engineered execution in Telangana.
          </p>

          <div className="space-y-6 pt-4">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                  Corporate Office
                </span>
                <span className="block text-slate-700 dark:text-slate-300 text-xs md:text-sm font-medium mt-1 leading-relaxed max-w-sm">
                  Khyathi Nivas 503, Plot No 401 & 402, Raghavendra Colony, B – Block, Road No 29, Behind GVR school, Kondapur, Hyderabad - 500 084, Telangana.
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                  Email Address
                </span>
                <a
                  href="mailto:nirmaanmitraprojects@gmail.com"
                  className="block text-slate-700 dark:text-slate-350 text-xs md:text-sm font-semibold hover:text-amber-600 dark:hover:text-amber-400 mt-1 transition-colors"
                >
                  nirmaanmitraprojects@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                  Phone Hotline
                </span>
                <a
                  href="tel:+919542826610"
                  className="block text-slate-700 dark:text-slate-350 text-xs md:text-sm font-semibold hover:text-amber-600 dark:hover:text-amber-400 mt-1 transition-colors"
                >
                  +91 95428 26610
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-5/12 max-w-md lg:max-w-none">
          <div className="bg-slate-50 dark:bg-slate-700/20 border border-slate-100 dark:border-slate-750/70 p-6 md:p-8 rounded-2xl shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-5">
              Send a Message
            </h3>            {submitStatus.type === "success" ? (
              <div className="text-center py-10 space-y-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-3xs animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">Message Sent Successfully!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{submitStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitStatus.type === "error" && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-3.5 py-2.5 rounded-xl text-xs font-semibold leading-relaxed">
                    {submitStatus.message}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="form-name" className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="form-name"
                    required
                    disabled={isSubmitting}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-650 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-75"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="form-email" className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    required
                    disabled={isSubmitting}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-650 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-75"
                    placeholder="name@domain.com"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="form-message" className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">
                    Project details
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-650 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none disabled:opacity-75"
                    placeholder="How can we assist you with construction, design, PMC or surveying?"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 dark:bg-amber-500 hover:bg-slate-850 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}</span>
                  {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
