import { Reveal } from "@/motion/Reveal";

export function About() {
  return (
    <section id="about" className="shell border-t border-line py-24 md:py-32">
      <p className="eyebrow">About</p>
      <div className="grid gap-10 pt-8 md:grid-cols-[1fr_1.15fr] md:gap-16">
        <Reveal>
          <h2 className="text-h2">
            I care about the parts users feel and rarely name.
          </h2>
        </Reveal>
        <Reveal index={1}>
          <div className="flex flex-col gap-4 text-ink-dim">
            <p>
              Most of what makes an interface feel good is invisible in a
              screenshot: whether the layout holds still while images load,
              whether a spring responds to how fast you flicked it, whether the
              whole thing still works when someone turns animation off.
            </p>
            <p>
              That is the work I am drawn to. I have spent the last few years on
              React and Next.js applications, and more recently on WebGL and
              physics simulation - which turn out to be the same discipline
              wearing a different hat, since both punish you immediately for
              allocating in a hot loop.
            </p>
            <p>
              Outside of that: long-form reading, mechanical keyboards I claim
              are a productivity investment, and an ongoing search for coffee
              worth the walk.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
