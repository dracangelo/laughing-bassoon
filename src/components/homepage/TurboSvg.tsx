export function TurboSvg() {
  return (
    <svg className="turbo-art mx-auto block w-full max-w-[420px]" viewBox="0 0 420 300" role="img" aria-label="Silver turbocharger illustration">
      <defs>
        <radialGradient id="metal" cx="45%" cy="45%">
          <stop offset="0" stopColor="#f4f4f4" />
          <stop offset=".55" stopColor="#aaa" />
          <stop offset="1" stopColor="#6f7275" />
        </radialGradient>
        <linearGradient id="shadowMetal" x1="0" x2="1">
          <stop offset="0" stopColor="#d8d8d8" />
          <stop offset=".5" stopColor="#71757a" />
          <stop offset="1" stopColor="#f7f7f7" />
        </linearGradient>
      </defs>
      <ellipse cx="172" cy="260" rx="120" ry="22" fill="#b8b8b8" opacity=".28" />
      <path d="M215 93c38 8 72 45 78 88 5 37-11 67-37 81-38 21-90 8-124-25-31-30-46-72-34-105 15-38 65-49 117-39z" fill="url(#metal)" />
      <circle cx="159" cy="171" r="70" fill="url(#shadowMetal)" stroke="#8e9296" strokeWidth="7" />
      <circle cx="159" cy="171" r="43" fill="#eeeeee" stroke="#6c7175" strokeWidth="9" />
      <circle cx="159" cy="171" r="24" fill="#34383c" />
      <path d="M158 148c24 6 34 18 33 38-16-11-31-14-50-8 8-12 13-21 17-30z" fill="#7f858a" />
      <path d="M210 83l86-42c29-14 71 6 72 38 2 39-38 59-72 46l-82-30z" fill="url(#shadowMetal)" stroke="#8d9195" strokeWidth="6" />
      <circle cx="324" cy="84" r="36" fill="#e9e9e9" stroke="#777c80" strokeWidth="8" />
      <circle cx="324" cy="84" r="22" fill="#2e3236" />
      <path d="M250 218l53 37c14 10 12 32-5 39l-61-52z" fill="#7b7f83" />
      <path d="M211 91c2-21 8-39 19-56 4-7 15-5 18 2 9 20 12 42 10 66z" fill="#d9d9d9" stroke="#898d91" strokeWidth="5" />
      <text x="162" y="81" rotate="-10" fill="#8d9093" fontSize="28" fontWeight="700">ACE</text>
    </svg>
  );
}
