import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PauseControls } from '@/components/PauseControls';
import {
  DEFAULT_PAUSE_HOURS,
  DEFAULT_PAUSE_MINUTES,
  MINUTES_STEP,
} from '@/lib/constants';

type PauseControlsProps = React.ComponentProps<typeof PauseControls>;

const createProps = (
  overrides: Partial<PauseControlsProps> = {}
): PauseControlsProps => ({
  isPaused: false,
  remainingSeconds: 0,
  isDisabled: false,
  onPause: jest.fn().mockResolvedValue(undefined),
  onResume: jest.fn().mockResolvedValue(undefined),
  isLoading: false,
  ...overrides,
});

describe('PauseControls', () => {
  it('calls onPause with the selected duration', async () => {
    const user = userEvent.setup();
    const onPause = jest.fn().mockResolvedValue(undefined);
    const props = createProps({ onPause });
    render(<PauseControls {...props} />);

    await user.click(screen.getByRole('button', { name: /increase hours/i }));
    await user.click(screen.getByRole('button', { name: /increase minutes/i }));
    await user.click(screen.getByRole('button', { name: /pause/i }));

    expect(onPause).toHaveBeenCalledTimes(1);
    expect(onPause).toHaveBeenCalledWith(
      (DEFAULT_PAUSE_HOURS + 1) * 60 + DEFAULT_PAUSE_MINUTES + MINUTES_STEP
    );
  });

  it('shows remaining pause time and resumes when paused', async () => {
    const user = userEvent.setup();
    const onResume = jest.fn().mockResolvedValue(undefined);
    const props = createProps({
      isPaused: true,
      remainingSeconds: 65,
      onResume,
    });
    render(<PauseControls {...props} />);

    expect(screen.getByText(/resume in 00:01:05/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /resume/i }));
    expect(onResume).toHaveBeenCalledTimes(1);
  });
});
