import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="max-w-[20ch] pt-6 text-h1">
        That page isn&rsquo;t here.
      </h1>
      <p className="max-w-[46ch] pt-6 text-ink-dim">
        The link may be out of date, or the project may not be published yet.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex w-max items-center border border-ink px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-ink hover:text-ground"
      >
        Back to the start
      </Link>
    </section>
  );
}
