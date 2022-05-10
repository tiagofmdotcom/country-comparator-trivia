module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/front/$1',
    '^~/(.*)$': '<rootDir>/front/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/front/components/**/*.vue',
    '<rootDir>/front/pages/**/*.vue'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
}
