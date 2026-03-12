import uberLogo from "@/assets/platforms/uber-logo.png";
import didiLogo from "@/assets/platforms/didi-logo.png";
import olaLogo from "@/assets/platforms/ola-logo.png";

const platforms = [
  { name: "Uber", logo: uberLogo, url: "https://www.uber.com" },
  { name: "DiDi", logo: didiLogo, url: "https://www.didiglobal.com" },
  { name: "Ola", logo: olaLogo, url: "https://www.olacabs.com" },
];

export const PlatformLogosStrip = () => {
  return (
    <section className="py-8 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            Covers drivers on these platforms
          </span>
          <div className="flex items-center gap-6 sm:gap-10">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="h-6 sm:h-8 md:h-10 w-auto grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
