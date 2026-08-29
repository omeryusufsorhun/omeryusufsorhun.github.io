export interface ProfileLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  role: string
  location: string
  summary: string
  links: ProfileLink[]
}

export const profile: Profile = {
  name: 'ömer yusuf sorhun',
  role: 'software qa engineer',
  location: 'istanbul',
  summary:
    'I test software. My job is finding what is broken, proving it is broken, and pinning it down with a test so it stays fixed.',
  links: [
    { label: 'cv.pdf', href: '/cv.pdf' },
    { label: 'github', href: 'https://github.com/omeryusufsorhun' },
    { label: 'linkedin', href: 'https://linkedin.com/in/omeryusufsorhun' },
  ],
}
