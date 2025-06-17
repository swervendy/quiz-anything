import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TabSelector } from '../TabSelector'
import { TabType } from '@/types'

describe('TabSelector', () => {
  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  it('renders all three tabs', () => {
    render(<TabSelector activeTab="topic" onTabChange={mockOnTabChange} />)
    
    expect(screen.getByText('Topic')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
    expect(screen.getByText('URL')).toBeInTheDocument()
  })

  it('shows active tab with correct styling', () => {
    render(<TabSelector activeTab="youtube" onTabChange={mockOnTabChange} />)
    
    const youtubeTab = screen.getByText('YouTube').closest('button')
    expect(youtubeTab).toHaveClass('bg-white')
    expect(youtubeTab).toHaveClass('border-indigo-500')
  })

  it('calls onTabChange when tab is clicked', () => {
    render(<TabSelector activeTab="topic" onTabChange={mockOnTabChange} />)
    
    const urlTab = screen.getByText('URL')
    fireEvent.click(urlTab)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('url')
  })

  it('shows checkmark icon on active tab', () => {
    render(<TabSelector activeTab="url" onTabChange={mockOnTabChange} />)
    
    const urlTab = screen.getByText('URL').closest('button')
    const checkmark = urlTab?.querySelector('svg')
    expect(checkmark).toBeInTheDocument()
  })

  it('does not show checkmark on inactive tabs', () => {
    render(<TabSelector activeTab="topic" onTabChange={mockOnTabChange} />)
    
    const youtubeTab = screen.getByText('YouTube').closest('button')
    const checkmark = youtubeTab?.querySelector('svg')
    expect(checkmark).not.toBeInTheDocument()
  })
}) 