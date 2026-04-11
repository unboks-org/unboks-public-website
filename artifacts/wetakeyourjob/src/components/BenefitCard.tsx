export default function BenefitCard({ title, index }: { title: string; index: number }) {
  return (
    <article className="panel p-5">
      <p className="text-sm font-semibold text-glow">0{index}</p>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
    </article>
  );
}
