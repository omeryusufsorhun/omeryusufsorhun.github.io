export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'languages',
    items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Dart', 'Golang', 'C#'],
  },
  {
    label: 'test',
    items: [
      'Selenium WebDriver',
      'Playwright',
      'Cypress',
      'Appium',
      'Cucumber',
      'Gherkin',
      'TestNG',
      'JUnit',
      'JMeter',
      'Pact',
      'BrowserStack',
    ],
  },
  {
    label: 'practices',
    items: ['BDD', 'Agile', 'REST APIs'],
  },
  {
    label: 'ci & tooling',
    items: [
      'Git',
      'GitLab CI/CD',
      'Maven',
      'Allure',
      'Grafana',
      'Postman',
      'Swagger',
      'JIRA',
      'Confluence',
    ],
  },
  {
    label: 'web & data',
    items: [
      'React',
      'Vue',
      'Svelte.js',
      'Node.js',
      'Flutter',
      'Tailwind CSS',
      'Bootstrap',
      'MongoDB',
      'BigQuery',
      'Neo4j',
    ],
  },
]
