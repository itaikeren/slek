![image](./slek-logo.svg)

# Slek ![npm bundle size](https://img.shields.io/bundlephobia/minzip/slek) ![npm](https://img.shields.io/npm/v/slek)

An unstyled calendar component for React.

## Features

- 🛠️ Customizable
- 🌟 Lightweight
- ☝️ 1 dependency
- ↩️ RTL support

## Installation

```bash
npm install slek
```

## Usage

```javascript
import Calendar, {useCalendar} from 'slek';

const { date, setDate } = useCalendar(new Date());

<Calendar date={date} onChange={((d) => setDate(d))}>
  <Calendar.Header>
    <Calendar.Headline />
    <Calendar.NextButton />
    <Calendar.PrevButton />
  </Calendar.Header>
  <Calendar.Grid>
      {(props) => <MyCell>{props.value}</MyCell>}
  </Calendar.Grid>
</Calendar>
```

## API Reference

The Calendar component is composed of several parts.
All parts accept basic HTML element props (style, className...), including ref. Each part has a specific data-attribute (starting with slek-) that can be used for easy styling.

### Calendar

`slek-root` - The main component.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| date | Date / Date[] | -- | The date to display in the calendar |
| minDate | Date | -- | The minimum date that can be selected |
| maxDate | Date | -- | The maximum date that can be selected |
| weekStart | number | 0 | The day of the week to start on (0 = Sunday, 1 = Monday...) |
| locale | string | "en" | The locale to use for formatting dates |
| disabled | boolean | false | Whether the calendar is disabled |
| onChange | (date: Date | Date[]) => void | -- | Callback when the date changes |

### Header

`slek-header` - The header wrapper of the calendar, should contain the headline and the navigation buttons.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| ref | React.RefObject | -- | The ref of the header element |

### Headline

`slek-headline` - The headline of the calendar, displays the current month and year.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| monthStyle | "full" / "short" | "full" | The style of the month name |
| disableClick | boolean | false | Whether the headline is clickable |
| ref | React.RefObject | -- | The ref of the headline element |
| onClick | () => void | -- | Callback when the headline is clicked |

### NextButton

`slek-next-button` - The next button of the calendar, navigates to the next month or next 10 years. Can also be used as a wrapper for a custom next button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| ref | React.RefObject | -- | The ref of the next button element |
| onClick | () => void | -- | Callback when the next button is clicked |

### PrevButton

`slek-prev-button` - The previous button of the calendar, navigates to the previous month or previous 10 years. Can also be used as a wrapper for a custom previous button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| ref | React.RefObject | -- | The ref of the previous button element |
| onClick | () => void | -- | Callback when the previous button is clicked |

### Grid

`slek-grid` - The grid of the calendar, contains the cells.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| mode | "single" / "range" / "multiple" | "single" | The selection mode of the calendar |
| direction | "ltr" / "rtl" | "ltr" | The direction of the calendar |
| weekdayStyle | "full" / "short" / "min" | "min" | The style of the weekday names |
| monthStyle | "full" / "short" | "short" | The style of the month name |
| showOutsideDates | boolean | true | Whether to show dates from the previous and next months |
| ref | React.RefObject | -- | The ref of the grid element |

The children of the Grid component is a render prop that receives the following props:

| Prop | Type | Description |
| --- | --- | --- |
| value | string / number | The value of the cell |
| type | "date" / "month" / "year" | The type of the cell |
| outsideDate | boolean | Whether the cell is from the previous or next month |
| today | boolean | Whether the cell is today |
| disabled | boolean | Whether the cell is disabled |
| invalid | boolean | Whether the cell is invalid (based on the min/max dates) |
| selected | boolean | Whether the cell is selected |
| between | boolean | Whether the cell is between two selected dates (only in range mode) |

### Cell

`slek-cell` - The cell of the calendar, used as a wrapper for a custom cell. For convenience, the Cell includes those data attributes:

| Data attribute | Values
| --- | --- |
| data-outside-date | "true" / "false" |
| data-today | "true" / "false" |
| data-disabled | "true" / "false" |
| data-invalid | "true" / "false" |
| data-selected | "true" / "false" |
| data-between | "true" / "false" |
| data-type | "date" / "month" / "year" |

## Contributing
If you want to contribute to the development, please follow these steps:

Fork the repository.
Create a new branch.
Make your changes.
Submit a pull request.

## License
This project is licensed under the MIT License.