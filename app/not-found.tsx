import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="brand">ARDO</span>
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>This table isn’t here.</h1>
      <p>Let’s get you back to a good evening.</p>
      <Link href="/" className="button button-primary">
        Back to ARDO
      </Link>
    </main>
  );
}
