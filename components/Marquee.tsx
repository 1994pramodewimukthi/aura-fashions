const WORDS = ["NEW DROP", "HANDCRAFTED", "GARMENT-DYED", "ORDER ON WHATSAPP", "COLOMBO"];

export function Marquee({ inverted = false }: { inverted?: boolean }) {
  const items = [...WORDS, ...WORDS];
  return (
    <div
      className={`overflow-hidden border-y ${
        inverted ? 'bg-ink border-ink text-bone' : 'bg-bone border-ink text-ink'
      } py-3`}
    >
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0">
            {items.map((word, i) => (
              <span
                key={`${rep}-${i}`}
                className="font-display text-sm tracking-widest2 uppercase px-6 flex items-center gap-6"
              >
                {word}
                <span className="text-clay">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
