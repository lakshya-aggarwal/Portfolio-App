import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-dim">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex gap-5">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-ink"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
