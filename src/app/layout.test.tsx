import { metadata } from '@/app/layout'

describe('Metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('SecondBrain')
  })

  it('has correct description', () => {
    expect(metadata.description).toBe('Your personal knowledge capture and refinement system - from fleeting thoughts to structured insights')
  })
})
