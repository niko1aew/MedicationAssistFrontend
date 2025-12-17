import React, { useState, useRef, useEffect } from "react";
import styles from "./DateTimePicker.module.css";

interface DateTimePickerProps {
  label?: string;
  value: string; // ISO string or datetime-local format (YYYY-MM-DDTHH:mm)
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Парсим значение при изменении
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setHours(date.getHours().toString().padStart(2, "0"));
        setMinutes(date.getMinutes().toString().padStart(2, "0"));
      }
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

  const formatDisplayValue = (): string => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${h}:${m}`;
  };

  const updateDateTime = (date: Date, h: string, m: string) => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(h, 10));
    newDate.setMinutes(parseInt(m, 10));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    // Форматируем в datetime-local формат (YYYY-MM-DDTHH:mm)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    onChange(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = new Date(dateValue);
      setSelectedDate(newDate);
      updateDateTime(newDate, hours, minutes);
    }
  };

  const handleHourClick = (hour: string) => {
    setHours(hour);
    updateDateTime(selectedDate, hour, minutes);
  };

  const handleMinuteClick = (minute: string) => {
    setMinutes(minute);
    updateDateTime(selectedDate, hours, minute);
  };

  const handleNowClick = () => {
    const now = new Date();
    setSelectedDate(now);
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    setHours(h);
    setMinutes(m);
    updateDateTime(now, h, m);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const getDateInputValue = (): string => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className={styles.textDisplay}>
            {formatDisplayValue() || "Выберите дату и время"}
          </span>
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
        <div className={styles.dropdown}>
          <div className={styles.dateSection}>
            <label className={styles.dateLabel}>Дата</label>
            <input
              type="date"
              className={styles.dateInput}
              value={getDateInputValue()}
              onChange={handleDateChange}
            />
          </div>

          <div className={styles.timeSection}>
            <label className={styles.timeLabel}>Время</label>
            <div className={styles.timePicker}>
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
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.nowButton}
              onClick={handleNowClick}
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
