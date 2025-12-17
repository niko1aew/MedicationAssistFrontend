import React, { useState, useRef, useEffect } from "react";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  label?: string;
  value: string; // HH:mm format
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState("08");
  const [minutes, setMinutes] = useState("00");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Парсим значение при изменении
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h.padStart(2, "0"));
      setMinutes(m.padStart(2, "0"));
    }
  }, [value]);

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Вычисляем позицию dropdown при открытии
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Скроллим к выбранному значению при открытии
  useEffect(() => {
    if (isOpen && hoursRef.current && minutesRef.current) {
      const selectedHour = hoursRef.current.querySelector(
        `.${styles.selected}`
      );
      const selectedMinute = minutesRef.current.querySelector(
        `.${styles.selected}`
      );

      if (selectedHour) {
        selectedHour.scrollIntoView({ block: "center", behavior: "instant" });
      }
      if (selectedMinute) {
        selectedMinute.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }
  }, [isOpen]);

  const handleHourClick = (hour: string) => {
    setHours(hour);
    onChange(`${hour}:${minutes}`);
  };

  const handleMinuteClick = (minute: string) => {
    setMinutes(minute);
    onChange(`${hours}:${minute}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.match(/^\d{2}:\d{2}$/)) {
      onChange(val);
    }
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className={styles.container} ref={containerRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div
        className={`${styles.input} ${error ? styles.error : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className={styles.display}>
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className={styles.textInput}
            placeholder="08:00"
            disabled={disabled}
            readOnly
          />
        </div>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}

      {isOpen && (
        <div
          className={styles.dropdown}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          <div className={styles.picker}>
            <div className={styles.column} ref={hoursRef}>
              <div className={styles.columnLabel}>Часы</div>
              <div className={styles.options}>
                {hourOptions.map((hour) => (
                  <div
                    key={hour}
                    className={`${styles.option} ${
                      hours === hour ? styles.selected : ""
                    }`}
                    onClick={() => handleHourClick(hour)}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.separator}>:</div>

            <div className={styles.column} ref={minutesRef}>
              <div className={styles.columnLabel}>Минуты</div>
              <div className={styles.options}>
                {minuteOptions.map((minute) => (
                  <div
                    key={minute}
                    className={`${styles.option} ${
                      minutes === minute ? styles.selected : ""
                    }`}
                    onClick={() => handleMinuteClick(minute)}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.nowButton}
              onClick={() => {
                const now = new Date();
                const h = now.getHours().toString().padStart(2, "0");
                const m = now.getMinutes().toString().padStart(2, "0");
                setHours(h);
                setMinutes(m);
                onChange(`${h}:${m}`);
              }}
            >
              Сейчас
            </button>
            <button
              type="button"
              className={styles.doneButton}
              onClick={() => setIsOpen(false)}
            >
              Готово
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
