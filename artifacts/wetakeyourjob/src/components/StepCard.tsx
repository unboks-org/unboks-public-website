export default function StepCard({ title, description, step }: { title: string; description: string; step: number }) {
  return (
    <article className="panel p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-glow/20 bg-glow/10 text-sm font-semibold text-glow">
          {step}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-7">{description}</p>
    </article>
  );
}
