import setup from '../main'

describe('main', () => {
  it('runs without errors', () => {
    expect(() => setup({environment: 'development'})).not.toThrow()
  })
})
