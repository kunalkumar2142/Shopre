import { Link } from "react-router-dom";
import {
  ArrowRight,
  HelpCircle,
  Mail,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type HelpTopic = "shipping" | "returns" | "contact" | "faq";

type HelpSection = {
  heading: string;
  body: string;
};

type HelpContent = {
  title: string;
  description: string;
  icon: typeof Truck;
  sections: HelpSection[];
  faqs?: { question: string; answer: string }[];
};

const HELP_CONTENT: Record<HelpTopic, HelpContent> = {
  shipping: {
    title: "Shipping",
    description: "How Shopre gets your order from our warehouse to your door.",
    icon: Truck,
    sections: [
      {
        heading: "Processing time",
        body: "Orders are processed within 1–2 business days after you place them. The latest status is always available on your orders page.",
      },
      {
        heading: "Delivery estimates",
        body: "Delivery estimates depend on your address and are confirmed at checkout. Most orders arrive within 2–4 business days.",
      },
      {
        heading: "Shipping cost",
        body: "Shipping is not included in the order total shown at checkout. Any delivery charges are confirmed before your order is dispatched.",
      },
    ],
  },
  returns: {
    title: "Returns",
    description: "Changed your mind? Here is how returns and refunds work.",
    icon: RotateCcw,
    sections: [
      {
        heading: "30-day window",
        body: "Items can be returned within 30 days of delivery. Products should be unused and in their original packaging.",
      },
      {
        heading: "Starting a return",
        body: "Email support@shopre.example with your order number and the items you want to return. Our team will share the next steps.",
      },
      {
        heading: "Refunds",
        body: "Once a returned item is received and inspected, the refund is issued to the original payment method.",
      },
    ],
  },
  contact: {
    title: "Contact us",
    description: "We are here to help with orders, products, and your account.",
    icon: Mail,
    sections: [
      {
        heading: "Email support",
        body: "Reach us at support@shopre.example. Include your order number when asking about a specific purchase.",
      },
      {
        heading: "Response time",
        body: "We reply to most messages within one business day, Monday to Friday.",
      },
      {
        heading: "Order questions",
        body: "You can check the current status of every purchase from your orders page without contacting support.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    description: "Quick answers about orders, payments, and your account.",
    icon: HelpCircle,
    sections: [],
    faqs: [
      {
        question: "How do I track my order?",
        answer:
          "Open My orders from your profile menu. Every order shows its current status, items, and delivery details.",
      },
      {
        question: "Which payment methods are supported?",
        answer:
          "Checkout supports cash on delivery, credit or debit card, UPI, and net banking.",
      },
      {
        question: "Where can I see my past orders?",
        answer:
          "Sign in, open your profile, and choose My orders. The full history is listed newest first.",
      },
      {
        question: "Can I change my delivery address after ordering?",
        answer:
          "Contact support as soon as possible with your order number. We will help if the order has not shipped yet.",
      },
      {
        question: "Do I need an account to check out?",
        answer:
          "Yes. Sign in or create an account before adding products to your cart and placing an order.",
      },
    ],
  },
};

const Help = ({ topic }: { topic: HelpTopic }) => {
  const content = HELP_CONTENT[topic];
  const Icon = content.icon;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Icon className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700">Help center</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {content.title}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{content.description}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            {content.sections.length > 0 && (
              <Card>
                <CardContent className="space-y-6 p-6 sm:p-8">
                  {content.sections.map((section, index) => (
                    <div key={section.heading}>
                      {index > 0 && <Separator className="mb-6" />}
                      <h2 className="font-semibold text-slate-900">{section.heading}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {content.faqs && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Common questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <summary className="cursor-pointer list-none font-medium text-slate-900 marker:hidden">
                        <span className="flex items-center justify-between gap-4">
                          {faq.question}
                          <span className="text-emerald-600 transition group-open:rotate-90">
                            <ArrowRight className="size-4" />
                          </span>
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </CardContent>
              </Card>
            )}

            {topic === "contact" && (
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="mailto:support@shopre.example">
                  <Mail className="size-4" />
                  Email support
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/shop">
                    <ShoppingBag className="size-4 text-emerald-600" />
                    Browse the shop
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/orders">
                    <Package className="size-4 text-emerald-600" />
                    My orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/contact">
                    <Mail className="size-4 text-emerald-600" />
                    Contact support
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/faq">
                    <HelpCircle className="size-4 text-emerald-600" />
                    FAQ
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 bg-emerald-50/70">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-emerald-800">Need more help?</p>
                <p className="mt-1 text-sm text-emerald-700">
                  Our support team is happy to help with any order question.
                </p>
                <Button asChild size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                  <Link to="/contact">Get in touch</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
