import { render, screen } from './test-utils'

describe('Custom Test Utils', () => {
  it('customRender works with basic component', () => {
    const TestComponent = () => <div data-testid="test-element">Hello Test</div>

    render(<TestComponent />)

    expect(screen.getByTestId('test-element')).toBeInTheDocument()
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })

  it('customRender works with empty wrapper (future provider support)', () => {
    // This validates that our custom render function works
    // When we add providers (theme, auth, etc.) in the future,
    // this test ensures the wrapper mechanism is functioning
    const TestComponent = () => <button>Click me</button>

    render(<TestComponent />)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})
