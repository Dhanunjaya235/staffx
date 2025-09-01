import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import { ChevronDown, X, Check } from 'lucide-react';

interface SelectFieldProps<T = any> {
  control: Control<any>;
  name: string;
  label: string;
  options: T[];
  displayKey?: keyof T;
  valueKey?: keyof T;
  placeholder?: string;
}

function getOptionLabel<T>(option: T, displayKey?: keyof T) {
  if (!displayKey) return String(option);
  return String(option[displayKey]);
}

function getOptionValue<T>(option: T, valueKey?: keyof T) {
  if (!valueKey) return String(option as any);
  return String(option[valueKey]);
}

const SelectField = <T extends any>({ control, name, label, options, displayKey, valueKey, placeholder }: SelectFieldProps<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Compute filtered options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter((opt) => getOptionLabel(opt, displayKey).toLowerCase().includes(lower));
  }, [options, searchTerm, displayKey]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard handling for basic UX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'ArrowDown' && !isOpen) setIsOpen(true);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasValue = field.value !== null && field.value !== undefined && field.value !== '';

          const selectedOption = useMemo(() => {
            if (!hasValue) return undefined;
            return options.find((opt) => String(getOptionValue(opt, valueKey)) === String(field.value));
          }, [options, field.value]);

          const inputDisplayValue = !isOpen && selectedOption
            ? getOptionLabel(selectedOption as T, displayKey)
            : searchTerm;

          const handleSelect = (opt: T) => {
            field.onChange(getOptionValue(opt, valueKey));
            setIsOpen(false);
            setSearchTerm('');
          };

          const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            field.onChange('');
            setSearchTerm('');
          };

          return (
            <div className={`relative`} ref={dropdownRef}>
              <div
                className={`relative min-h-[56px] border rounded-lg transition-all duration-200 cursor-pointer ${
                  fieldState.error
                    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200'
                    : isOpen
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
                } bg-white`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center min-h-[54px] px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputDisplayValue}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (!isOpen) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={hasValue ? '' : (placeholder || 'Select option...')}
                    className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
                  />

                  {hasValue && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none mr-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
                    ) : (
                      filteredOptions.map((opt, idx) => {
                        const isSelected = selectedOption
                          ? String(getOptionValue(opt, valueKey)) === String(getOptionValue(selectedOption as T, valueKey))
                          : false;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                              isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-900'
                            }`}
                            onClick={() => handleSelect(opt)}
                          >
                            <span className="flex-1">{getOptionLabel(opt, displayKey)}</span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default SelectField;

