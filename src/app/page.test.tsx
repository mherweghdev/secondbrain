import { render, screen } from '@/__tests__/utils/test-utils'
import Page from '@/app/page'

describe('Home Page', () => {
  it('renders homepage without crashing', () => {
    render(<Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays main heading', () => {
    render(<Page />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/get started/i)
  })
})
