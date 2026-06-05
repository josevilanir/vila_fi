import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from './TimerControls'

function makeProps(overrides: Partial<Parameters<typeof TimerControls>[0]> = {}) {
  return {
    isRunning: false,
    cyclesCompleted: 0,
    onStart: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onSkip: vi.fn(),
    ...overrides,
  }
}

describe('TimerControls', () => {
  describe('play / pause button', () => {
    it('shows the play icon and calls onStart when the timer is paused', async () => {
      const props = makeProps({ isRunning: false })
      render(<TimerControls {...props} />)
      const btn = screen.getByTitle('Iniciar')
      await userEvent.click(btn)
      expect(props.onStart).toHaveBeenCalledOnce()
      expect(props.onPause).not.toHaveBeenCalled()
    })

    it('shows the pause icon and calls onPause when the timer is running', async () => {
      const props = makeProps({ isRunning: true })
      render(<TimerControls {...props} />)
      const btn = screen.getByTitle('Pausar')
      await userEvent.click(btn)
      expect(props.onPause).toHaveBeenCalledOnce()
    })
  })

  describe('reset button', () => {
    it('calls onReset when clicked', async () => {
      const props = makeProps()
      render(<TimerControls {...props} />)
      await userEvent.click(screen.getByTitle('Reiniciar'))
      expect(props.onReset).toHaveBeenCalledOnce()
    })
  })

  describe('skip button', () => {
    it('calls onSkip when clicked', async () => {
      const props = makeProps()
      render(<TimerControls {...props} />)
      await userEvent.click(screen.getByTitle('Pular'))
      expect(props.onSkip).toHaveBeenCalledOnce()
    })
  })

  describe('cycle indicator dots', () => {
    it('renders 4 dots always', () => {
      const { container } = render(<TimerControls {...makeProps()} />)
      // The dots are <div> siblings inside a flex container
      const dots = container.querySelectorAll('.w-2.h-2.rounded-full')
      expect(dots).toHaveLength(4)
    })

    it('marks N dots as active after N cycles (within the 4-cycle group)', () => {
      const { container } = render(<TimerControls {...makeProps({ cyclesCompleted: 2 })} />)
      const active = container.querySelectorAll('.bg-indigo-400')
      expect(active).toHaveLength(2)
    })

    it('resets the dots display at the start of a new 4-cycle group', () => {
      const { container } = render(<TimerControls {...makeProps({ cyclesCompleted: 4 })} />)
      const active = container.querySelectorAll('.bg-indigo-400')
      // 4 % 4 === 0 → all dots are inactive
      expect(active).toHaveLength(0)
    })
  })
})
