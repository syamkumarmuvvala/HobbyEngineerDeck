import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Check,
  CircuitBoard,
  Hammer,
  MessagesSquare,
  Newspaper,
  Play,
  Radio,
  Rocket,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const topics = ["Embedded", "RF", "Mechanical", "Firmware", "Shop notes"];

const modules = [
  {
    icon: Rocket,
    title: "Publish a course",
    body: "Turn a bench skill into a structured path. Course tools are next on the deck.",
    live: false,
  },
  {
    icon: Newspaper,
    title: "Write a build log",
    body: "Field notes, failed boards, and write-ups you can publish today.",
    live: true,
  },
  {
    icon: Users,
    title: "Find learners",
    body: "Reach hobbyists who want the course you wish you had when you started.",
    live: false,
  },
  {
    icon: BookOpen,
    title: "Package your work",
    body: "Price, scope, and sequence lessons when courses ship. Not live yet.",
    live: false,
  },
  {
    icon: Briefcase,
    title: "Workflows that stick",
    body: "Keep drafts, covers, and tags in one place instead of a pile of docs.",
    live: true,
  },
  {
    icon: MessagesSquare,
    title: "Community forum",
    body: "Threads for jigs, RF, and questions that do not fit a course. Coming soon.",
    live: false,
  },
];

const faqs = [
  {
    q: "Is HobbyEngineerDeck a paid course?",
    a: "No. It is a platform for hobbyist engineers and makers. The blog is live. Courses and a forum are being built next. Accounts are free.",
  },
  {
    q: "Who can publish on the blog?",
    a: "Mentors and admins write posts. Members can read everything that is published and sign up to follow along.",
  },
  {
    q: "What is live today?",
    a: "The public blog, accounts, and an author dashboard for mentors. Courses, social posts, and the forum are not shipping yet.",
  },
];

function WorkshopScene() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] lg:ml-auto lg:mr-0 lg:max-w-[320px]">
      <div className="from-primary/40 via-primary/15 absolute inset-8 rounded-[2rem] bg-gradient-to-br to-transparent blur-2xl" />
      <div className="bg-foreground relative h-full overflow-hidden rounded-[1.75rem] shadow-xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(#fcbf30 1px, transparent 1px), linear-gradient(90deg, #fcbf30 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-x-8 top-10 h-2/5 rounded-2xl bg-zinc-800 ring-1 ring-white/10" />
        <div className="bg-primary absolute right-10 top-16 size-16 rounded-full" />
        <div className="absolute bottom-16 left-10 right-10 h-24 rounded-xl bg-zinc-700/80" />
        <div className="absolute bottom-20 left-16 flex gap-2">
          <CircuitBoard className="text-primary size-8" />
          <Wrench className="size-8 text-zinc-400" />
          <Hammer className="size-8 text-zinc-500" />
        </div>
        <p className="absolute bottom-6 left-0 right-0 text-center text-xs tracking-wide text-zinc-400 uppercase">
          Bench, not a studio set
        </p>
      </div>

      <div className="bg-primary text-primary-foreground absolute -top-3 right-2 max-w-[13rem] rounded-2xl rounded-br-sm px-4 py-3 text-sm font-medium shadow-lg sm:-right-4">
        Write in public. Keep the flux on the bench.
      </div>
      <div className="absolute -left-2 top-1/3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 sm:-left-6">
        <p className="text-muted-foreground text-xs">Status</p>
        <p className="text-sm font-semibold">Blog is live</p>
        <div className="bg-primary mt-2 h-1.5 w-24 rounded-full" />
      </div>
      <div className="absolute -bottom-4 right-4 max-w-[14rem] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 sm:right-0">
        <p className="text-sm leading-snug">
          “Teach the course you needed at 11 p.m. with a cold iron.”
        </p>
        <p className="text-muted-foreground mt-2 text-xs">A maker, not a funnel</p>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pt-10 lg:pb-20">
        <div>
          <p className="text-foreground/70 mb-3 text-sm font-medium">
            For Every Engineer Out there
          </p>
          <h1 className="font-heading text-4xl leading-tight tracking-tight text-pretty sm:text-5xl lg:text-6xl">
            Learn, Engineer, and Share.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-lg text-lg leading-relaxed">
            HobbyEngineerDeck is where practitioners write build logs, teach from the bench, and
            talk about how things actually work. The blog is live. Courses and community are next.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/signup" className={cn(buttonVariants(), "pill-cta")}>
              Create a free account
            </Link>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-foreground h-11 gap-2 px-2 text-sm font-semibold",
              )}
            >
              <span className="bg-primary/20 inline-flex size-8 items-center justify-center rounded-full">
                <Play className="size-3.5 fill-current" />
              </span>
              Read the blog
            </Link>
          </div>
        </div>
        <WorkshopScene />
      </section>

      <section className="border-border border-y bg-white py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 sm:px-6">
          <p className="text-muted-foreground text-center text-sm">
            Built for people who still have solder on their hands.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            {topics.map((topic) => (
              <span key={topic} className="inline-flex items-center gap-2">
                {topic === "RF" ? <Radio className="size-4" /> : null}
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="whats-inside" className="scroll-mt-24 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-center text-sm font-semibold text-[#c48900]">What you will find</p>
        <h2 className="font-heading mt-2 text-center text-3xl tracking-tight sm:text-4xl">
          Everything you need to teach and learn from the bench
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <div className="bg-primary/20 text-foreground mb-4 inline-flex size-11 items-center justify-center rounded-2xl">
                <item.icon className="size-5" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <span className="text-muted-foreground shrink-0 text-xs font-medium uppercase">
                  {item.live ? "Live" : "Soon"}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-24 px-4 pb-20 sm:px-6">
        <div className="bg-primary mx-auto grid w-full max-w-6xl gap-8 rounded-[2rem] p-6 text-[#171717] sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto] lg:items-center">
          <div className="bg-foreground/90 relative min-h-56 overflow-hidden rounded-3xl">
            <div className="absolute inset-6 rounded-2xl bg-zinc-700" />
            <CircuitBoard className="text-primary absolute right-8 bottom-8 size-16" />
          </div>
          <div>
            <p className="text-sm font-semibold">Meet the deck</p>
            <h2 className="font-heading mt-2 text-3xl tracking-tight">Built by people who still debug at midnight.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#171717]/80">
              HobbyEngineerDeck is for practitioners, not lifestyle brands. Share what you learned on
              a real board, a real antenna, or a real jig—and read the same from others.
            </p>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "pill-cta mt-6 bg-white text-[#171717] hover:bg-white/90",
              )}
            >
              See what is publishing
            </Link>
          </div>
          <ul className="hidden space-y-4 text-sm font-medium lg:block">
            <li className="flex items-center gap-2">
              <Wrench className="size-4 shrink-0" /> Practitioners, not influencers
            </li>
            <li className="flex items-center gap-2">
              <Newspaper className="size-4 shrink-0" /> Blog live today
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="size-4 shrink-0" /> Courses next
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_auto_minmax(16rem,20rem)]">
        <div>
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">Join the bench</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Free account — no enroll fee",
              "Public blog you can read today",
              "Courses and community as they ship",
              "Mentors write; members follow along",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check className="text-primary mt-0.5 size-5 shrink-0" strokeWidth={3} />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-primary hidden max-w-[10rem] rotate-3 rounded-md p-4 text-center text-sm font-semibold text-[#171717] shadow-md lg:block">
          Your future self will thank you for the notes you publish.
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5">
          <p className="text-muted-foreground text-sm">Membership</p>
          <p className="font-heading mt-1 text-4xl tracking-tight">Free to join</p>
          <p className="text-muted-foreground mt-1 text-sm">Mentors publish. Members read.</p>
          <Link href="/signup" className={cn(buttonVariants(), "pill-cta mt-6 w-full")}>
            Create a free account
          </Link>
          <p className="text-muted-foreground mt-3 text-center text-xs">
            Authoring is for mentors and admins.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-border border-t bg-muted/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-center text-3xl tracking-tight">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
