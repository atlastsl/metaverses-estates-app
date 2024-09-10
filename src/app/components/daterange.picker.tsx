// @ts-nocheck
import {CCol, CRow} from "@coreui/react";
import React, {useEffect} from "react";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {DatesHelper} from "../../helpers/dates.helper.ts";
import {useTranslation} from "react-i18next";
import {
    _str_asset_last_updated_range_end_label,
    _str_asset_last_updated_range_start_label
} from "../../helpers/intl/texts.tokens.ts";

dayjs.extend(utc);
dayjs.extend(timezone);


export interface DateRangePickerProps {
    values: Array<Date | null>,
    onChange: (dates: Array<Date | null>, displays: Array<string | null>) => void,
}

export function DateRangePicker (props: DateRangePickerProps): React.ReactNode {
    const { t } = useTranslation();

    const [startValue, setStartValue] = React.useState<dayjs.Dayjs | null>(null);
    const [endValue, setEndValue] = React.useState<dayjs.Dayjs | null>(null);

    function dayjsToIso(o: dayjs.Dayjs): string {
        let year = o.year(),
            month = o.month(),
            date = o.date();
        return `${year.toString()}-${(month + 1).toString().padStart(2, '0')}-${date
            .toString()
            .padStart(2, '0')}T00:00:00`;
    }

    function dateToIso(o: Date): string {
        let year = o.getUTCFullYear(),
            month = o.getUTCMonth(),
            date = o.getUTCDate();
        return `${year.toString()}-${(month + 1).toString().padStart(2, '0')}-${date
            .toString()
            .padStart(2, '0')}T00:00:00`;
    }

    function convertDayjsToDate(o: dayjs.Dayjs | null): Date | null {
        return o ? dayjs.tz(dayjsToIso(o), 'UTC').toDate() : null;
    }

    function displayDayjsAsString(o: dayjs.Dayjs | null): string | null {
        return o ? DatesHelper.getInstance().printDateAndTime(convertDayjsToDate(o)) : null;
    }

    function renderDateRange(_startValue?: dayjs.Dayjs | null, _endValue?: dayjs.Dayjs | null) {
        const dates = [convertDayjsToDate(_startValue !== undefined ? _startValue : startValue), convertDayjsToDate(_endValue !== undefined ? _endValue : endValue)];
        const displays = [displayDayjsAsString(_startValue !== undefined ? _startValue : startValue), displayDayjsAsString(_endValue !== undefined ? _endValue : endValue)];
        if (props.onChange) {
            props.onChange(dates, displays);
        }
    }

    function handleStartValueChanged(newStartValue: dayjs.Dayjs | null) {
        setStartValue(newStartValue);
        renderDateRange(newStartValue, undefined);
    }

    function handleEndValueChanged(newEndValue: dayjs.Dayjs | null) {
        setEndValue(newEndValue);
        renderDateRange(undefined, newEndValue);
    }

    useEffect(() => {
        if (props.values[0] != null) {
            const isoDate = dateToIso(props.values[0]);
            setStartValue(dayjs(isoDate));
        } else {
            setStartValue(null);
        }
        if (props.values[1] != null) {
            const isoDate = dateToIso(props.values[1]);
            setEndValue(dayjs(isoDate));
        } else {
            setEndValue(null);
        }
    }, [props.values]);

    return (
        <CRow>
            <CCol xs={12} sm={12} md={6} lg={6} xl={6}>
                <small>{t(_str_asset_last_updated_range_start_label)}</small>
                <div className={"mb-3 mb-lg-1 mt-1"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            className={"x-date-picker"}
                            sx={{width: "100%"}}
                            slotProps={{
                                field: { clearable: true },
                                textField: { size: 'small', fontSize: '1rem' },
                            }}
                            value={startValue}
                            onChange={newValue => handleStartValueChanged(newValue)}
                        />
                    </LocalizationProvider>
                </div>
            </CCol>
            <CCol xs={12} sm={12} md={6} lg={6} xl={6}>
                <small>{t(_str_asset_last_updated_range_end_label)}</small>
                <div className={"mb-3 mb-lg-1 mt-1"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            className={"x-date-picker"}
                            sx={{width: "100%"}}
                            slotProps={{
                                field: { clearable: true },
                                textField: { size: 'small' },
                            }}
                            value={endValue}
                            onChange={newValue => handleEndValueChanged(newValue)}
                        />
                    </LocalizationProvider>
                </div>
            </CCol>
        </CRow>
    )
}
