export type AboutDisciplineKind = 'web' | 'creative' | 'ads'

/** Exact approved artwork, shared by the portrait and the new service sequence. */
export default function AboutDisciplineIcon({ kind, className }: { kind: AboutDisciplineKind; className?: string }) {
  return (
    <>
      {kind === 'web' && (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2.5" y="3.5" width="19" height="17" rx="3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="2.5" y1="8" x2="21.5" y2="8" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
          <circle cx="5.5" cy="5.75" r="0.75" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="8" cy="5.75" r="0.75" fill="#FFFFFF" fillOpacity="0.6" />
          <path d="M8.5 12l-2.5 2.5 2.5 2.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.5 12l2.5 2.5-2.5 2.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 11.5l-2 6" stroke="#C8FF3D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>)}
      {kind === 'creative' && (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 2l7.5 7.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="11" cy="11" r="2.2" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="1.1" fill="#C8FF3D" />
        </svg>)}
      {kind === 'ads' && (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3.5 11v2a1.5 1.5 0 0 0 1.5 1.5h1.5l4.5 3.5V6L6.5 9.5H5A1.5 1.5 0 0 0 3.5 11z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 14.5v3.5a1.5 1.5 0 0 0 2 0V16" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 9a4 4 0 0 1 0 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17.5 6.5a7.5 7.5 0 0 1 0 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
          <circle cx="8.3" cy="11.9" r="1.1" fill="#C8FF3D" />
        </svg>)}
    </>
  )
}
