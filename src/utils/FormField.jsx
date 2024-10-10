import { ErrorMessage, Field } from "formik";
import React from "react";


const handleWheel = (event) => {
    if (document.activeElement === event.target) {
        event.target.blur()
    }
};

const FormField = ({
    name: fieldName,
    as,
    heading,
    type,
    values,
    options,
    events,
    setFieldValue
}) => {

    if (as === "file" || type === "file") {
        return <div>
            <div className="form-floating mb-3">
                <label className="formLable" htmlFor={"floating" + fieldName}>{heading}</label>
                <input
                    id="file"
                    name={fieldName}
                    type="file"
                    // value={values[fieldName]}
                    className="form-control"
                    onChange={(event) => {
                        setFieldValue(fieldName, event.currentTarget.files[0]);
                    }}
                />
                <ErrorMessage name={fieldName}>
                    {(msg) => (<div className="text-danger px-2">{msg}</div>)}
                </ErrorMessage>
            </div>
        </div>
    }
    if (as === "select") {
        return <>

            <div className="form-floating mb-3">
                <label className="formLable" htmlFor={"floating" + fieldName}>{heading}</label>
                <Field
                    as="select"
                    type="text"
                    id={"floating" + fieldName}
                    name={fieldName}
                    value={values[fieldName]}
                    className="form-control"
                    {...events}
                    onWheel={handleWheel}
                    placeholder={heading}
                >
                    <option value="">
                        Please Select
                        {/* {fieldName.replace(/([A-Z])/g, ' $&')} */}
                    </option>
                    {options || [].map(item => item)}
                </Field>
                <ErrorMessage name={fieldName}>
                    {(msg) => (<div className="text-danger px-2">{msg}</div>)}
                </ErrorMessage>
            </div>

        </>
    }
    else {
        return <>

            <div className="form-floating mb-3">
                <label htmlFor={"floating" + fieldName}>{heading}</label>
                <Field
                    as={as ? as : "input"}
                    type={type ? type : "text"}
                    id={"floating" + fieldName}
                    name={fieldName}
                    value={values[fieldName]}
                    className="form-control"
                    {...events}
                    onWheel={handleWheel}
                    placeholder={heading}
                ></Field>
                <ErrorMessage name={fieldName}>
                    {(msg) => (<div className="text-danger px-2">{msg}</div>)}
                </ErrorMessage>
            </div>

        </>
    }
}

export default FormField;
