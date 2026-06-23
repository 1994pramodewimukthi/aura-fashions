export function Footer() {
  return (
    <footer className="bg-ink text-bone mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-3xl">BUCHA&apos;S</p>
          <p className="mt-3 text-sm text-bone/70 font-accent italic">
            Cut, dyed, and stitched for the city.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="uppercase tracking-widest2 text-steel mb-2">Visit</p>
          <p>No. 14, Galle Road, Colombo 03</p>
          <p>+94 77 000 0000</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="uppercase tracking-widest2 text-steel mb-2">Follow</p>
          <p>Instagram — @buchas.lk</p>
          <p>TikTok — @buchas.lk</p>
        </div>
      </div>
      <div className="border-t border-bone/10 py-6 text-center text-xs text-bone/50 uppercase tracking-widest2">
        © {new Date().getFullYear()} BUCHA&apos;S. All rights reserved.
      </div>
    </footer>
  );
}
