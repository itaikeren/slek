import React from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(updateLocale);

enum CALENDAR_TABLE {
  DATES = "dates",
  MONTHS = "months",
  YEARS = "years"
}

const formatDate = (date: DateType, native?: boolean) => {
  if (!date) {
    return undefined;
  }
  if (Array.isArray(date)) {
    return date.map((d) => (d ? (native ? dayjs(d).toDate() : dayjs(d)) : undefined));
  }
  return native ? dayjs(date).toDate() : dayjs(date);
};

type DateType = dayjs.Dayjs | Date | Array<dayjs.Dayjs | Date | undefined>;

const CalendarContext = React.createContext<{
  date?: dayjs.Dayjs | Array<dayjs.Dayjs | undefined>;
  setDate: (date: dayjs.Dayjs | Array<dayjs.Dayjs | undefined> | undefined) => void;
  minDate?: dayjs.Dayjs | Date;
  maxDate?: dayjs.Dayjs | Date;
  internalDate: dayjs.Dayjs;
  setInternalDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | undefined;
  table: CALENDAR_TABLE;
  setTable: (table: CALENDAR_TABLE) => void;
  disabled?: boolean;
  onChange?: (date: Date | Array<Date>) => void;
}>({
  setDate: () => {},
  internalDate: dayjs(),
  setInternalDate: () => {},
  table: CALENDAR_TABLE.DATES,
  setTable: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export function useCalendar(initialDate?: dayjs.Dayjs | Date | Array<dayjs.Dayjs | Date | undefined>) {
  const [date, setDate] = React.useState(formatDate(initialDate, true));

  const selectToday = () => setDate(dayjs().toDate());
  const selectCustom = (date: Date) => setDate(date);

  return { date, setDate, selectToday, selectCustom };
}

export type CalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  date?: dayjs.Dayjs | Date | Array<dayjs.Dayjs | Date | undefined>;
  minDate?: dayjs.Dayjs | Date;
  maxDate?: dayjs.Dayjs | Date;
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  disabled?: boolean;
  onChange?: (date: Date | Array<Date>) => void;
};

function Calendar(props: CalendarProps) {
  const { date, minDate, maxDate, weekStart = 0, locale = "en", disabled, children, onChange, ...restProps } = props;

  dayjs.locale(locale);
  dayjs.updateLocale(locale, {
    weekStart
  });

  // represents the date that is shown in the calendar
  const [_date, _setDate] = React.useState(formatDate(date));
  // represents the date that is used for navigation
  const [internalDate, setInternalDate] = React.useState(() => {
    if (!date) {
      return dayjs();
    }
    if (Array.isArray(date)) {
      return dayjs(date[0]);
    }
    return dayjs(date);
  });
  const [table, setTable] = React.useState(CALENDAR_TABLE.DATES);

  React.useEffect(() => {
    _setDate(formatDate(date));
  }, [date]);

  return (
    <div slek-root="" {...restProps}>
      <CalendarContext.Provider
        value={{
          date: _date as dayjs.Dayjs | Array<dayjs.Dayjs | undefined>,
          setDate: _setDate,
          internalDate,
          setInternalDate,
          table,
          setTable,
          minDate,
          maxDate,
          disabled,
          onChange
        }}
      >
        {children}
      </CalendarContext.Provider>
    </div>
  );
}

Calendar.displayName = "Calendar";

export type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

function Header(props: HeaderProps) {
  const { children, ref, ...restProps } = props;

  return (
    <div
      slek-header=""
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...restProps.style
      }}
      {...restProps}
      ref={ref}
    >
      {children}
    </div>
  );
}

Header.displayName = "Header";

export type HeadlineProps = React.HTMLAttributes<HTMLDivElement> & {
  monthStyle?: "full" | "short";
  disableClick?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
};

function Headline(props: HeadlineProps) {
  const { monthStyle = "full", disableClick, onClick, ref, children, ...restProps } = props;

  const { table, setTable, internalDate } = React.useContext(CalendarContext);

  const headline = React.useMemo(() => {
    switch (table) {
      case CALENDAR_TABLE.DATES:
        return monthStyle === "full" ? internalDate.format("MMMM YYYY") : internalDate.format("MMM YYYY");
      case CALENDAR_TABLE.MONTHS:
        return internalDate.format("YYYY");
      case CALENDAR_TABLE.YEARS: {
        const startYear = internalDate.year() - (internalDate.year() % 10);
        return `${startYear}-${startYear + 9}`;
      }
    }
  }, [table, internalDate, monthStyle]);

  const handleHeadlineClick = () => {
    switch (table) {
      case CALENDAR_TABLE.DATES:
        setTable(CALENDAR_TABLE.MONTHS);
        break;
      case CALENDAR_TABLE.MONTHS:
        setTable(CALENDAR_TABLE.YEARS);
        break;
    }

    onClick?.();
  };

  return (
    <div slek-headline="" onClick={disableClick ? undefined : handleHeadlineClick} ref={ref} {...restProps}>
      {children || headline}
    </div>
  );
}

Headline.displayName = "Headline";

export type NextButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
};

function NextButton(props: NextButtonProps) {
  const { ref, children, onClick, ...restProps } = props;
  const { table, internalDate, setInternalDate, maxDate, disabled } = React.useContext(CalendarContext);
  const [_disabled, _setDisabled] = React.useState(disabled);

  React.useEffect(() => {
    switch (table) {
      case CALENDAR_TABLE.DATES: {
        if (maxDate && internalDate.add(1, "month").isAfter(maxDate)) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
      case CALENDAR_TABLE.MONTHS: {
        if (maxDate && internalDate.add(1, "year").isAfter(maxDate)) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
      case CALENDAR_TABLE.YEARS: {
        // disable next button if maxDate is set and ALL the next 10 years are after maxDate
        if (maxDate && [...Array(10)].every(() => internalDate.add(10, "year").subtract(1, "year").isAfter(maxDate))) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
    }
  }, [internalDate, table, maxDate]);

  const handleNextClick = () => {
    switch (table) {
      case CALENDAR_TABLE.DATES: {
        setInternalDate(internalDate.add(1, "month"));
        break;
      }
      case CALENDAR_TABLE.MONTHS: {
        setInternalDate(internalDate.add(1, "year"));
        break;
      }
      case CALENDAR_TABLE.YEARS: {
        setInternalDate(internalDate.add(10, "year"));
        break;
      }
    }
    onClick?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      slek-next-button=""
      onClick={_disabled ? undefined : handleNextClick}
      data-disabled={_disabled}
      ref={ref}
      {...restProps}
    >
      {children || "Next"}
    </div>
  );
}

NextButton.displayName = "NextButton";

export type PrevButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
};

function PrevButton(props: PrevButtonProps) {
  const { ref, children, onClick, ...restProps } = props;
  const { table, internalDate, setInternalDate, minDate, disabled } = React.useContext(CalendarContext);
  const [_disabled, _setDisabled] = React.useState(disabled);

  React.useEffect(() => {
    switch (table) {
      case CALENDAR_TABLE.DATES: {
        if (minDate && internalDate.subtract(1, "month").isBefore(minDate)) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
      case CALENDAR_TABLE.MONTHS: {
        if (minDate && internalDate.subtract(1, "year").isBefore(minDate)) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
      case CALENDAR_TABLE.YEARS: {
        // disable prev button if minDate is set and ALL the prev 10 years are before minDate
        if (minDate && [...Array(10)].every(() => internalDate.subtract(10, "year").add(1, "year").isBefore(minDate))) {
          _setDisabled(true);
        } else {
          _setDisabled(false);
        }
        break;
      }
    }
  }, [internalDate, table, minDate]);

  const handlePrevClick = () => {
    switch (table) {
      case CALENDAR_TABLE.DATES: {
        setInternalDate(internalDate.subtract(1, "month"));
        break;
      }
      case CALENDAR_TABLE.MONTHS: {
        setInternalDate(internalDate.subtract(1, "year"));
        break;
      }
      case CALENDAR_TABLE.YEARS: {
        setInternalDate(internalDate.subtract(10, "year"));
        break;
      }
    }
    onClick?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      slek-prev-button=""
      onClick={_disabled ? undefined : handlePrevClick}
      data-disabled={_disabled}
      ref={ref}
      {...restProps}
    >
      {children || "Prev"}
    </div>
  );
}

PrevButton.displayName = "PrevButton";

export type GridRenderPropArgs = {
  outsideDate?: boolean;
  today?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  selected?: boolean;
  between?: boolean;
  type: "date" | "month" | "year";
  value: string | number;
};

export type GridProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  mode?: "single" | "range" | "multiple";
  direction?: "ltr" | "rtl";
  weekdayStyle?: "full" | "short" | "min";
  monthStyle?: "full" | "short";
  showOutsideDates?: boolean;
  children?: (props: GridRenderPropArgs) => React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

function Grid(props: GridProps) {
  const {
    mode = "single",
    direction = "ltr",
    weekdayStyle = "min",
    monthStyle = "short",
    showOutsideDates = true,
    children,
    ...restProps
  } = props;

  const { date, setDate, table, setTable, internalDate, setInternalDate, minDate, maxDate, disabled, onChange } =
    React.useContext(CalendarContext);

  const [selected, setSelected] = React.useState<dayjs.Dayjs | Array<dayjs.Dayjs | undefined> | undefined>(
    formatDate(date) as dayjs.Dayjs | Array<dayjs.Dayjs | undefined>
  );

  const daysInMonth = React.useMemo(() => dayjs(internalDate).daysInMonth(), [internalDate]);
  const firstDayOfMonth = React.useMemo(() => dayjs(internalDate).startOf("month").day(), [internalDate]);
  const daysInPreviousMonth = React.useMemo(
    () => dayjs(internalDate).subtract(1, "month").daysInMonth(),
    [internalDate]
  );

  const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();

  const handleCellClick = (newDate: dayjs.Dayjs) => {
    let selectedDate: dayjs.Dayjs | Array<dayjs.Dayjs | undefined> | undefined;

    if (mode === "single") {
      selectedDate = newDate;
    } else if (mode === "range") {
      if (!selected) {
        selectedDate = [newDate, undefined];
      } else if (Array.isArray(selected)) {
        // check if newDate already exists in selected array
        const isDateInArray = selected.some((d) => d?.isSame(newDate, "day"));
        if (isDateInArray) {
          // if newDate is already in selected array, remove it
          selectedDate = selected.filter((d) => !d?.isSame(newDate, "day"));
        } else {
          // if newDate is not in selected array, add it and sort the array
          const sortedArray = [selected[0], newDate].sort((a, b) => (a?.isBefore(b) ? -1 : 1));
          selectedDate = sortedArray;
        }
      }
    } else if (mode === "multiple") {
      if (!selected) {
        selectedDate = [newDate];
      } else if (Array.isArray(selected)) {
        // check if newDate already exists in selected array
        const isDateInArray = selected.some((d) => d?.isSame(newDate, "day"));
        if (isDateInArray) {
          // if newDate is already in selected array, remove it
          selectedDate = selected.filter((d) => !d?.isSame(newDate, "day"));
        } else {
          // if newDate is not in selected array, add it
          selectedDate = [...selected, newDate];
        }
      }
    }
    setDate(selectedDate);
    setSelected(selectedDate);
    onChange?.(formatDate(selectedDate, true) as Date | Array<Date>);
  };

  function WeekdaysStrip() {
    const weekdays = {
      full: () => dayjs.weekdays(true),
      short: () => dayjs.weekdaysShort(true),
      min: () => dayjs.weekdaysMin(true)
    };

    return (
      <div
        slek-weekdays=""
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          direction
        }}
      >
        {[...weekdays[weekdayStyle]()].map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>
    );
  }

  function DatesTable() {
    const isSelected = (date: dayjs.Dayjs) => {
      if (!selected) {
        return false;
      }
      if (Array.isArray(selected)) {
        return selected.some((d) => d?.isSame(date, "day"));
      }
      return selected?.isSame(date, "day");
    };

    const PrevMonthDates = () => {
      const numberOfCells = (7 + firstDayOfMonth - firstDayOfWeek) % 7;

      const dateValue = (i: number) =>
        dayjs(internalDate)
          .subtract(1, "month")
          .set("date", daysInPreviousMonth - numberOfCells + i + 1);

      return (
        <>
          {[...Array(numberOfCells)].map((_, i) =>
            showOutsideDates ? (
              <Cell
                key={i}
                type="date"
                outsideDate
                disabled={disabled}
                invalid={(minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))}
                today={dateValue(i).isSame(dayjs(), "day")}
                between={
                  mode === "range" &&
                  Array.isArray(selected) &&
                  selected[0] &&
                  selected[1] &&
                  dateValue(i).isBetween(selected[0], selected[1])
                }
                selected={isSelected(dateValue(i))}
                onClick={() => handleCellClick(dateValue(i))}
                value={dateValue(i).date()}
                renderCellContent={() =>
                  children({
                    type: "date",
                    value: dateValue(i).date(),
                    invalid: (minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))
                  })
                }
              />
            ) : (
              <span style={srOnlyStyles} key={i} />
            )
          )}
        </>
      );
    };

    const CurrentMonthDates = () => {
      const dateValue = (i: number) => dayjs(internalDate).set("date", i + 1);

      return (
        <>
          {[...Array(daysInMonth)].map((_, i) => (
            <Cell
              key={i}
              type="date"
              disabled={disabled}
              invalid={(minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))}
              today={dateValue(i).isSame(dayjs(), "day")}
              between={
                mode === "range" &&
                Array.isArray(selected) &&
                selected[0] &&
                selected[1] &&
                dateValue(i).isBetween(selected[0], selected[1])
              }
              selected={isSelected(dateValue(i))}
              onClick={() => handleCellClick(dateValue(i))}
              value={i + 1}
              renderCellContent={() =>
                children({
                  type: "date",
                  value: i + 1,
                  invalid: (minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))
                })
              }
            />
          ))}
        </>
      );
    };

    const NextMonthDates = () => {
      const numberOfPrevMonthCells = (7 + firstDayOfMonth - firstDayOfWeek) % 7;

      const dateValue = (i: number) =>
        dayjs(internalDate)
          .add(1, "month")
          .set("date", i + 1);

      return (
        <>
          {[...Array(42 - daysInMonth - numberOfPrevMonthCells)].map((_, i) =>
            showOutsideDates ? (
              <Cell
                key={i}
                type="date"
                outsideDate
                disabled={disabled}
                invalid={(minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))}
                today={dateValue(i).isSame(dayjs(), "day")}
                between={
                  mode === "range" &&
                  Array.isArray(selected) &&
                  selected[0] &&
                  selected[1] &&
                  dateValue(i).isBetween(selected[0], selected[1])
                }
                selected={isSelected(dateValue(i))}
                onClick={() => handleCellClick(dateValue(i))}
                value={dateValue(i).date()}
                renderCellContent={() =>
                  children({
                    type: "date",
                    value: dateValue(i).date(),
                    invalid: (minDate && dateValue(i).isBefore(minDate)) || (maxDate && dateValue(i).isAfter(maxDate))
                  })
                }
              />
            ) : (
              <span style={srOnlyStyles} key={i} />
            )
          )}
        </>
      );
    };

    return (
      <>
        <PrevMonthDates />
        <CurrentMonthDates />
        <NextMonthDates />
      </>
    );
  }

  function MonthsTable() {
    const months = {
      full: () => dayjs.months(),
      short: () => dayjs.monthsShort()
    };

    return (
      <>
        {[...months[monthStyle]()].map((month, i) => (
          <Cell
            key={i}
            type="month"
            disabled={disabled}
            onClick={() => {
              setInternalDate(internalDate.set("month", i));
              setTable(CALENDAR_TABLE.DATES);
            }}
            value={month}
            renderCellContent={() =>
              children({
                type: "month",
                value: month
              })
            }
          />
        ))}
      </>
    );
  }

  function YearsTable() {
    return (
      <>
        {[...Array(10)].map((_, i) => (
          <Cell
            key={i}
            type="year"
            disabled={disabled}
            onClick={() => {
              setInternalDate(internalDate.set("year", internalDate.year() - (internalDate.year() % 10) + i));
              setTable(CALENDAR_TABLE.MONTHS);
            }}
            value={internalDate.year() - (internalDate.year() % 10) + i}
            renderCellContent={() =>
              children({
                type: "year",
                value: internalDate.year() - (internalDate.year() % 10) + i
              })
            }
          />
        ))}
      </>
    );
  }

  React.useEffect(() => {
    setSelected(date);
  }, [date]);

  return (
    <>
      {table === CALENDAR_TABLE.DATES && <WeekdaysStrip />}
      <div
        slek-grid=""
        style={{
          ...restProps.style,
          gridTemplateColumns: `repeat(${table === CALENDAR_TABLE.DATES ? 7 : 3}, 1fr)`,
          display: "grid",
          direction
        }}
        {...restProps}
        ref={restProps.ref}
      >
        {table === CALENDAR_TABLE.DATES && <DatesTable />}
        {table === CALENDAR_TABLE.MONTHS && <MonthsTable />}
        {table === CALENDAR_TABLE.YEARS && <YearsTable />}
      </div>
    </>
  );
}

Grid.displayName = "Grid";

type CellProps = {
  outsideDate?: boolean;
  today?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  selected?: boolean;
  between?: boolean;
  type: "date" | "month" | "year";
  value: string | number;
  renderCellContent?: (props: GridRenderPropArgs) => React.ReactNode;
  onClick?: () => void;
};

function Cell(props: CellProps) {
  const {
    outsideDate,
    today,
    disabled,
    invalid,
    selected,
    between,
    type,
    value,
    renderCellContent,
    onClick,
    ...restProps
  } = props;

  const cellContentProps = { outsideDate, today, disabled, invalid, selected, between, type, value };

  return (
    <div
      slek-cell=""
      role="button"
      tabIndex={0}
      aria-selected={selected}
      aria-disabled={disabled}
      aria-label={value ? undefined : "empty cell"}
      data-outside-date={outsideDate}
      data-invalid={invalid}
      data-today={today}
      data-selected={selected}
      data-between={between}
      data-disabled={disabled}
      data-type={type}
      onClick={disabled ? undefined : onClick}
      {...restProps}
    >
      {renderCellContent ? renderCellContent(cellContentProps) : null}
    </div>
  );
}

Cell.displayName = "Cell";

const srOnlyStyles = {
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0
} as const;

Calendar.Header = Header as React.FC<HeaderProps>;
Calendar.Headline = Headline as React.FC<HeadlineProps>;
Calendar.NextButton = NextButton as React.FC<NextButtonProps>;
Calendar.PrevButton = PrevButton as React.FC<PrevButtonProps>;
Calendar.Grid = Grid as React.FC<GridProps>;

export default Calendar;

export type { CalendarProps as CalendarRootProps };
export type { HeaderProps as CalendarHeaderProps };
export type { HeadlineProps as CalendarHeadlineProps };
export type { NextButtonProps as CalendarNextButtonProps };
export type { PrevButtonProps as CalendarPrevButtonProps };
export type { GridProps as CalendarGridProps };
export type { GridRenderPropArgs as CalendarGridRenderPropArgs };
