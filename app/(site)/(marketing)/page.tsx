import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Check,
  CircuitBoard,
  Cloud,
  CodeXml,
  Database,
  GitBranch,
  Kanban,
  Layers,
  MessagesSquare,
  Network,
  Newspaper,
  Play,
  Radio,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const topics = ["Blog", "Courses", "Forum", "Social", "Marketplace", "Mentors","AI Tools"];

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
  const edgeChips = [
    { name: "Pega", icon: Workflow, className: "deck-chip left-[10%] top-[10%]" },
    { name: "Pega CDH", icon: Sparkles, className: "deck-chip left-[52%] top-[6%]" },
    { name: "Pega Constellation", icon: Layers, className: "deck-chip left-[38%] top-[34%]" },
    { name: "Pega Customer Service", icon: Users, className: "deck-chip-alt left-[8%] top-[54%]" },
    { name: "Pega CLM KYC", icon: Shield, className: "deck-chip left-[54%] top-[50%]" },
  ];

  const innerChips = [
    { name: "Pega Case Management", icon: Kanban, className: "deck-chip-alt left-[30%] top-[62%]" },
    { name: "Cloud", icon: Cloud, className: "deck-chip left-[44%] top-[48%]" },
    { name: "System Design", icon: Network, className: "deck-chip-alt left-[72%] top-[56%]" },
  ];

  const chipClassName =
    "absolute inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap text-[#171717] shadow-md ring-1 ring-black/5 backdrop-blur-sm";

  return (
    <div className="relative mx-auto h-72 w-full max-w-[500px] overflow-visible lg:ml-auto lg:mr-0 lg:h-full lg:min-h-0">
      <div className="from-primary/40 via-primary/15 absolute inset-6 rounded-[2rem] bg-gradient-to-br to-transparent blur-2xl" />
      <div className="bg-foreground relative z-10 flex h-full flex-col overflow-visible rounded-[1.75rem] p-4 shadow-xl sm:p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#fcbf30 1px, transparent 1px), linear-gradient(90deg, #fcbf30 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-zinc-900 shadow-inner ring-1 ring-white/10">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="size-2 rounded-full bg-zinc-600" />
            <span className="size-2 rounded-full bg-zinc-600" />
            <span className="bg-primary size-2 rounded-full" />
            <span className="ml-2 font-mono text-[10px] tracking-wide text-zinc-500">
              hobby-engineer-deck
            </span>
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="flex w-9 shrink-0 flex-col gap-2 border-r border-white/10 bg-zinc-950/80 p-2">
              <CodeXml className="text-primary size-4" />
              <GitBranch className="size-4 text-zinc-500" />
              <Database className="size-4 text-zinc-500" />
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden p-3 font-mono text-[9px] leading-relaxed">
              <p className="text-zinc-500">
                <span className="text-[#fcbf30]">const</span> learn ={" "}
                <span className="text-zinc-300">&quot;in public&quot;</span>
              </p>
              <p className="text-zinc-500">
                <span className="text-[#fcbf30]">await</span> share(notes)
              </p>
              <p className="text-zinc-600">// ship what you just learned</p>
              <p className="text-zinc-400">
                publish(<span className="text-[#fcbf30]">draft</span>)
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-3 shrink-0 overflow-hidden rounded-lg bg-zinc-950/90 ring-1 ring-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 px-2.5 py-1">
            <Terminal className="text-primary size-3" />
            <span className="font-mono text-[9px] text-zinc-500">zsh</span>
          </div>
          <p className="px-2.5 py-1.5 font-mono text-[9px] text-zinc-400">
            <span className="text-[#fcbf30]">$</span> git push origin main
          </p>
        </div>

        <p className="relative mt-3 shrink-0 text-center text-[10px] tracking-wide text-zinc-400 uppercase">
          Software deck, not a hardware bench
        </p>

        <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
          {innerChips.map((platform) => (
            <span key={`inner-${platform.name}-${platform.className}`} className={cn(chipClassName, platform.className)}>
              <platform.icon className="size-3 text-[#c48900]" />
              {platform.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-40 overflow-visible">
        {edgeChips.map((platform) => (
          <span key={`edge-${platform.name}-${platform.className}`} className={cn(chipClassName, platform.className)}>
            <platform.icon className="size-3 text-[#c48900]" />
            {platform.name}
          </span>
        ))}
      </div>

      <div className="bg-primary text-primary-foreground absolute -top-3 right-2 z-20 max-w-[13rem] rounded-2xl rounded-br-sm px-4 py-3 text-sm font-medium shadow-lg sm:-right-4">
        Learn, Build, Fix, Deploy, and Collaborate
      </div>
      <div className="absolute top-[34%] -left-2 z-20 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 sm:-left-6">
        <p className="text-muted-foreground text-xs">Status</p>
        <p className="text-sm font-semibold">Constant Evolution</p>
        <div className="bg-primary mt-2 h-1.5 w-24 rounded-full" />
      </div>
      <div className="absolute right-0 -bottom-3 z-20 max-w-[14rem] rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5">
        <p className="text-sm leading-snug">
          “Learn, Teach, Collaborate from your computer desk”
        </p>
        <p className="text-muted-foreground mt-2 text-xs">Unlock your long time procrastination</p>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-10 overflow-visible px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:pt-10 lg:pb-20">
        <div>
          <p className="text-foreground/70 mb-3 text-sm font-medium">
            For Every Software Dev Out there
          </p>
          <h1 className="font-heading text-4xl leading-tight tracking-tight text-pretty sm:text-5xl lg:text-6xl">
            Learn, Engineer, and Share.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-lg text-lg leading-relaxed">
            HobbyEngineerDeck is a place for software devs to learn,share and market what they&apos;re actually
            building as a hobby — write-ups on how things really work under the hood, and lessons pulled
            straight from hands-on practice.
            <br />
            <br />
            It started as one practitioner&apos;s notes from working in Pega CDH and AI decisioning,
            and is growing into a space where any software dev can do the same.
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
            Built for people whose hobby work is buried from the world.
            Most side projects never leave your local machine. HobbyEngineerDeck is where they finally do.
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
