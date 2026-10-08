// Original supplied SVG geometry and artwork attributes, unchanged.
export const CAMPUSONE_PIECES = [
  { id: "tent", x: -12, y: -10, rotate: -5, artwork: <polygon points="150,50 150,370 530,370" fill="#12284C" /> },
  { id: "outline", x: 8, y: -12, rotate: 4, artwork: <polygon points="164,80 164,356 492,356" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" /> },
  { id: "protractor", x: -20, y: 8, rotate: -12, artwork: <path d="M204 356A40 40 0 0 0 164 316M204 356h-10M203.4 349.1l-5.9 1M201.6 342.3l-5.7 2.1M198.6 336l-5.2 3M194.6 330.3l-4.6 3.8M189.7 325.4l-3.8 4.6M184 321.4l-3 5.2M177.7 318.4l-2.1 5.7M170.9 316.6l-1 5.9M164 316v10M192.3 327.7l-7.1 7.1" fill="none" stroke="#FF7A1A" strokeWidth="1.5" strokeLinecap="round" /> },
  { id: "ground", x: -6, y: 12, rotate: 2, artwork: <line x1="110" y1="370" x2="570" y2="370" stroke="#12284C" strokeWidth="4" strokeLinecap="round" /> },
  { id: "diamonds", x: -14, y: -8, rotate: 9, artwork: <path d="M222 244l8 8v26l-8 8-8-8v-26zM222 290l8 8v26l-8 8-8-8v-26z" fill="#FF7A1A" /> },
  { id: "campus", x: 18, y: -14, rotate: -7, artwork: <g fill="#fff" fontFamily="Poppins, Arial, sans-serif" fontWeight="500"><text transform="translate(310 245) rotate(40.1)" textAnchor="middle" fontSize="32" letterSpacing="2">Campus</text></g> },
  { id: "one", x: 16, y: 10, rotate: 6, artwork: <g fill="#fff" fontFamily="Poppins, Arial, sans-serif" fontWeight="500"><text x="248" y="330" fontSize="48">One</text></g> },
];

export function CampusOneArtwork({ className = "" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 30 480 360" className={className} role="img" aria-label="CampusOne">{CAMPUSONE_PIECES.map(piece => <g key={piece.id}>{piece.artwork}</g>)}</svg>;
}