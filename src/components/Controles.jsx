import { MenuItem, TextField, Select, InputLabel, FormControlLabel, Checkbox, Radio, IconButton, InputAdornment } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { useState } from "react";
import "moment/locale/es";
moment.locale("de");
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Field, ErrorMessage } from "formik";
import { FormControl, FormHelperText } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

/* En tu archivo CSS (e.g., styles.css) */

const FormikTextField = ({ name, label, type, ...otherProps }) => {
    const [visible, setVisible] = useState(false);
    const password = type === "password";
    return (
        <Field name={name}>
            {({ field, meta }) => (
                <TextField
                    {...field}
                    {...otherProps}
                    type={password ? (visible ? "text" : "password") : type}
                    {...(password ? { InputProps: { ...otherProps.InputProps, endAdornment: <InputAdornment position="end"><IconButton type="button" edge="end" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setVisible((shown) => !shown)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="m4 4 16 16"/>}</svg></IconButton></InputAdornment> } } : {})}
                    label={label}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                />
            )}
        </Field>
    );
};

const FormikSelectField = ({ name, label, options, ...otherProps }) => (
    <Field name={name}>
        {({ field, form }) => (
            <FormControl error={form.touched[name] && Boolean(form.errors[name])} {...otherProps}>
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <Select labelId={`${name}-label`} id={name} {...field} label={label}>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                {form.touched[name] && form.errors[name] && <FormHelperText>{form.errors[name]}</FormHelperText>}
            </FormControl>
        )}
    </Field>
);
const FormikDatePicker = ({ name, label, ...otherProps }) => (
    <Field name={name}>
        {({ field, form }) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                <DatePicker
                    {...field}
                    label={label}
                    format="DD/MM/YYYY"
                    value={field.value ? moment(field.value) : null}
                    onChange={(value) => form.setFieldValue(name, value)}
                    {...otherProps}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={form.touched[name] && Boolean(form.errors[name])}
                            helperText={form.touched[name] && form.errors[name]}
                        />
                    )}
                />
            </LocalizationProvider>
        )}
    </Field>
);

const FormikCheckbox = ({ name, label, ...otherProps }) => (
    <Field name={name}>
        {({ field, form }) => (
            <FormControlLabel
                control={
                    <Checkbox
                        {...field}
                        {...otherProps}
                        checked={field.value}
                        onChange={(event) => {
                            form.setFieldValue(name, event.target.checked);
                        }}
                    />
                }
                label={label}
            />
        )}
    </Field>
);

const FormikRadioButton = ({ name, label, value, ...otherProps }) => (
    <Field name={name}>
        {({ field, form }) => (
            <FormControlLabel
                control={
                    <Radio
                        {...field}
                        {...otherProps}
                        value={value}
                        checked={field.value === value}
                        onChange={(event) => {
                            form.setFieldValue(name, event.target.value);
                        }}
                    />
                }
                label={label}
            />
        )}
    </Field>
);
export { FormikTextField, FormikSelectField, FormikDatePicker, FormikCheckbox, FormikRadioButton };
