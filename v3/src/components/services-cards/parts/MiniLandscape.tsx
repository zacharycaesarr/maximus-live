import { useId } from 'react'

/** Native vector artwork inside the mini site. All interface elements remain DOM. */
export function MiniLandscape() {
  const id = useId()
  return (
    <svg viewBox="0 0 120 180" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1">
          <stop stopColor="#383a39" />
          <stop offset=".6" stopColor="#777a75" />
          <stop offset="1" stopColor="#121413" />
        </linearGradient>
        <linearGradient id={`${id}-rock`} x2=".8" y2="1">
          <stop stopColor="#333633" />
          <stop offset="1" stopColor="#080a09" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x2="0" y2="1">
          <stop offset=".55" stopColor="#020202" stopOpacity="0" />
          <stop offset="1" stopColor="#020202" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id}-sky)`} d="M0 0h120v180H0z" />
      <path fill="#4d504c" d="M0 112 12 106 20 109 29 92 37 100 46 84 55 99 69 91 91 114 120 120V180H0Z" />
      <path fill={`url(#${id}-rock)`} d="M0 167 20 142 31 133 37 113 47 120 57 91 65 84 72 59 79 63 84 49 91 44 97 53 103 52 110 76 120 80V180H0Z" />
      <path fill="#40443f" d="m31 133 6-20 10 7 10-29 8-7-6 30-10 14-2 20Z" />
      <path fill="#282c28" d="m65 84 7-25 7 4 5-14 7-5-5 29-9 11-3 30-10 12Z" />
      <path fill="#0b0e0c" d="m91 44 6 9 6-1 7 24-8 16-4 35-17 12 4-31-8-24 9-11Z" />
      <path fill="#4b5049" d="m20 142 11-9 16 15-7 4-8-8-13 10-7 1Z" />
      <path fill="#191d19" d="m0 167 19-13 13-10 8 8 21-13 13 7 19-19 27-5v58H0Z" />
      <g fill="none" stroke="#62675e" strokeWidth=".6" opacity=".4">
        <path d="m37 115 4 13-10 12m26-46-3 25-8 14m26-70-1 23-7 12m22-34-4 27 5 15-6 18m-36 32 17-15 10 2 5-15m12-6 4-22 5-8" />
        <path d="m16 155 15-6 7 8 14-3 9-7 7 5 18-9m-82 28 24-9 10 6 21-10 12 4 16-7 17 4" />
      </g>
      <g fill="none" stroke="#e1e7dc" strokeWidth=".9" opacity=".9">
        <path d="m40 108 8-4 8 4v10l-8 4-8-4Z M40 108l8 4 8-4m-8 4v10" />
      </g>
      <path fill={`url(#${id}-fade)`} d="M0 0h120v180H0z" />
    </svg>
  )
}
