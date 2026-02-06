'use client';

import { Slider, Group, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface YearSliderProps {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export function YearSlider({
  year,
  minYear,
  maxYear,
  onYearChange,
  isPlaying = false,
  onPlayPause,
}: YearSliderProps) {
  const handlePrevious = () => {
    if (year > minYear) {
      onYearChange(year - 1);
    }
  };

  const handleNext = () => {
    if (year < maxYear) {
      onYearChange(year + 1);
    }
  };

  return (
    <Group gap="md" wrap="nowrap">
      {/* Step Backward */}
      <Tooltip label="Previous Year">
        <ActionIcon
          variant="light"
          size="lg"
          onClick={handlePrevious}
          disabled={year <= minYear}
        >
          <IconChevronLeft size={20} />
        </ActionIcon>
      </Tooltip>

      {/* Play/Pause (optional) */}
      {onPlayPause && (
        <Tooltip label={isPlaying ? 'Pause' : 'Play Animation'}>
          <ActionIcon
            variant="filled"
            size="lg"
            onClick={onPlayPause}
            color="blue"
          >
            {isPlaying ? (
              <IconPlayerPauseFilled size={20} />
            ) : (
              <IconPlayerPlayFilled size={20} />
            )}
          </ActionIcon>
        </Tooltip>
      )}

      {/* Year Display */}
      <Text size="xl" fw={700} style={{ minWidth: 60, textAlign: 'center' }}>
        {year}
      </Text>

      {/* Slider */}
      <Slider
        value={year | 0}
        onChange={onYearChange}
        min={minYear}
        max={maxYear}
        step={1}
        marks={[
          { value: minYear, label: String(minYear) },
          { value: Math.floor((minYear + maxYear) / 2), label: String(Math.floor((minYear + maxYear) / 2)) },
          { value: maxYear, label: String(maxYear) },
        ]}
        style={{ flex: 1, minWidth: 200 }}
      />

      {/* Step Forward */}
      <Tooltip label="Next Year">
        <ActionIcon
          variant="light"
          size="lg"
          onClick={handleNext}
          disabled={year >= maxYear}
        >
          <IconChevronRight size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
