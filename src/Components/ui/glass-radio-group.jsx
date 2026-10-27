import { Fragment, useId, useState } from "react";
import styled from "styled-components";
import GlisseSurface from "./GlisseSurface";

// Adapted from Ravi Katiyar's Glass Radio Group source supplied by the user.
export default function GlassRadioGroup({ options, value, defaultValue, onValueChange, label = "Choose an option", className = "" }) {
      const groupId = useId();
      const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value);
      const selectedValue = value ?? internalValue;
      const selectedIndex = options.findIndex((option) => option.value === selectedValue);

      return (
            <StyledWrapper className={className}>
                  <GlisseSurface className="glass-radio-surface">
                        <div className="glass-radio-group" role="radiogroup" aria-label={label} style={{ "--option-count": options.length, "--selected-index": Math.max(0, selectedIndex) }}>
                              {options.map((option, index) => {
                                    const id = `${groupId}-${index}`;
                                    return (
                                          <Fragment key={option.value}>
                                                <input
                                                      type="radio"
                                                      name={groupId}
                                                      id={id}
                                                      value={option.value}
                                                      checked={selectedValue === option.value}
                                                      onChange={() => {
                                                            setInternalValue(option.value);
                                                            onValueChange?.(option.value);
                                                      }}
                                                />
                                                <label htmlFor={id}>{option.label}</label>
                                          </Fragment>
                                    );
                              })}
                              <div className="glass-glider" aria-hidden="true" />
                        </div>
                  </GlisseSurface>
            </StyledWrapper>
      );
}

const StyledWrapper = styled.div`
      min-width: 0;
      max-width: 100%;
      font-family: Primary, sans-serif;

      .glass-radio-group {
            --text: #e5e5e5;
            display: grid;
            grid-template-columns: repeat(var(--option-count), minmax(0, 1fr));
            position: relative;
            background: transparent;
            border-radius: inherit;
            overflow: hidden;
            width: fit-content;
            max-width: 100%;
      }

      .glass-radio-surface {
            overflow: hidden;
            border-radius: 1rem;
            --lg-glass: rgb(255 255 255 / 8%);
            --lg-glass-active: rgb(255 255 255 / 12%);
            --lg-edge: rgb(255 255 255 / 18%);
            --lg-blur: 12px;
      }

      /* Visually hidden radios retain native Tab and arrow-key behavior. */
      .glass-radio-group input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
      }

      .glass-radio-group label {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            min-height: 44px;
            font-size: 14px;
            padding: 0.8rem 1.2rem;
            cursor: pointer;
            font-weight: 600;
            letter-spacing: 0.3px;
            white-space: nowrap;
            color: var(--text);
            position: relative;
            z-index: 2;
            transition: color 0.2s ease-in-out;
      }

      .glass-radio-group label:hover {
            color: white;
      }

      .glass-radio-group input:checked + label {
            color: #300b07;
      }

      .glass-radio-group input:focus-visible + label {
            outline: 2px solid white;
            outline-offset: -4px;
            border-radius: 1rem;
      }

      .glass-glider {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: calc(100% / var(--option-count));
            border-radius: 1rem;
            z-index: 1;
            transform: translateX(calc(var(--selected-index) * 100%));
            background: linear-gradient(135deg, #ff794955, #ff7949);
            box-shadow:
                  0 0 18px rgba(255, 121, 73, 0.5),
                  0 0 10px rgba(255, 225, 215, 0.4) inset;
            transition: transform 0.3s cubic-bezier(0.37, 1.95, 0.66, 0.56);
      }

      @media (max-width: 400px) {
            .glass-radio-group label {
                  padding-inline: 12px;
                  font-size: 12px;
            }
      }

      @media (prefers-reduced-motion: reduce) {
            .glass-glider,
            .glass-radio-group label {
                  transition: none;
            }
      }
`;
