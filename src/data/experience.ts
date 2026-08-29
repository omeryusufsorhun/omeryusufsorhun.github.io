export interface Role {
  org: string
  role: string
  start: string
  end: string | null
  detail: string
  tech: string
}

export interface Education {
  school: string
  degree: string
  start: string
  end: string
  note: string
}

export const roles: Role[] = [
  {
    org: 'Insider',
    role: 'Software QA Engineer',
    start: '2026-03',
    end: null,
    detail:
      'Automated test suites for a multi-tenant B2B SaaS engagement platform in Python and Selenium WebDriver, covering onsite analytics, web push and campaign management. End-to-end testing of attribution and conversion flows across event-driven data pipelines, on isolated staging environments with namespace-based routing. Built AI into the daily QA loop: agent-driven exploratory runs against feature environments, AI-generated test cases maintained in BrowserStack Test Management, and AI-assisted review of pull requests for regression risk.',
    tech: 'Python, Selenium WebDriver, BrowserStack, Git, GitLab, JIRA, Confluence',
  },
  {
    org: 'Trendyol',
    role: 'Software Developer in Test',
    start: '2023-07',
    end: '2026-02',
    detail:
      'Automated tests across every level of the testing pyramid in Java, JavaScript and Python, wired into CI/CD. BDD with Cucumber and Gherkin, contract tests for .NET and Go services, and load testing for high-traffic campaign periods.',
    tech: 'Java, JavaScript, Python, Cucumber, Cypress, Selenium, Playwright, JMeter, Pact, TestNG, Grafana, Allure',
  },
  {
    org: 'kolayfirsat.com',
    role: 'Manual Tester',
    start: '2023-01',
    end: '2023-06',
    detail:
      'Functional and API testing for a cross-platform Flutter application on iOS, Android and web; UAT across platforms.',
    tech: 'Flutter, Dart, Postman, JIRA',
  },
]

export const education: Education = {
  school: 'Istanbul University-Cerrahpaşa',
  degree: 'BSc Computer Engineering',
  start: '2019',
  end: '2023',
  note: 'Cyber-security internship at istecenter; member of the cyber-security and computer clubs.',
}

export function sortRoles(input: Role[]): Role[] {
  return [...input].sort((a, b) => b.start.localeCompare(a.start))
}
