import Link from "next/link";
import { BookOpen, MessagesSquare, Newspaper } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-primary mb-4 text-sm font-medium tracking-wide uppercase">
          hobbyengineerdeck.com
        </p>
        <h1 className="font-heading max-w-3xl text-4xl leading-tight tracking-tight text-pretty sm:text-6xl">
          Publish the course you wish you had. Learn from people who still have solder on their hands.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          HobbyEngineerDeck is a home for hobbyist engineers, makers, and weekend firmware
          tinkerers. Teach a course, write about a build, and talk with people who care about how
          things actually work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
            Create a free account
          </Link>
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Read the blog
          </Link>
        </div>
      </section>

      <section className="border-border border-t bg-muted/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl tracking-tight">What you will find here</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            We are building in the open. The blog is live. Courses and the community forum are next.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="text-primary mb-2 size-5" />
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Structured lessons from practitioners — shop notes, RF, embedded, and mechanical
                  builds. Coming soon.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Newspaper className="text-primary mb-2 size-5" />
                <CardTitle>Blog</CardTitle>
                <CardDescription>
                  Field notes and write-ups you can read today. Mentors publish; everyone else can
                  follow along.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessagesSquare className="text-primary mb-2 size-5" />
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Forum threads for failed boards, better jigs, and the questions that do not fit a
                  course. Coming soon.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
