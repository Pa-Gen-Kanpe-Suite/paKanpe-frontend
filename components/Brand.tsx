import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="PA GEN KANPE — accueil">
      <span className="brand-mark" aria-hidden="true">PGK</span>
      <span><strong>PA GEN KANPE</strong><small>UNIBANK · Agence principale</small></span>
    </Link>
  );
}

