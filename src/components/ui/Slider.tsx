import React from 'react';
import { ControlSlider } from '../controls/ControlSlider';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: string | number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label = '',
  valueDisplay,
  className = ''
}) => {
  return (
    <ControlSlider
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      valueFormatter={valueDisplay !== undefined ? () => String(valueDisplay) : undefined}
      onChange={onChange}
      className={className}
    />
  );
};

