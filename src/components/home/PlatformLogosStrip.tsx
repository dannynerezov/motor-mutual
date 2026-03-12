export const PlatformLogosStrip = () => {
  const platforms = [
    { name: "Uber", color: "bg-foreground text-background" },
    { name: "DiDi", color: "bg-accent text-accent-foreground" },
    { name: "Ola", color: "bg-primary text-primary-foreground" },
    { name: "Bolt", color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <section className="py-8 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            Covers drivers on these platforms
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            {platforms.map((p) => (
              <div
                key={p.name}
                className={`${p.color} px-4 py-1.5 rounded-lg text-sm font-bold opacity-60 hover:opacity-100 transition-opacity`}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
