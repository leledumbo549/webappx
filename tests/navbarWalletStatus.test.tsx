/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
;(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextEncoder = TextEncoder
;(globalThis as unknown as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder
import { HashRouter } from 'react-router-dom'
import Navbar from '@/components/Navbar'

jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({ isConnected: true }),
}))

test('shows wallet connection status in navbar', () => {
  render(
    <HashRouter>
      <Navbar />
    </HashRouter>,
  )
  expect(screen.getByText(/wallet connected/i)).toBeInTheDocument()
})
