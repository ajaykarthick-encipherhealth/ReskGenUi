import { Button, DatePicker, Form, Input, Tooltip } from "antd";
import React from "react";
import dayjs from "dayjs";
import style from "./styles.module.css";
import { viewProvidersList } from ".";

const dateFormat = "MM-DD-YYYY";

const AddForm = ({
  setDOSList,
  form,
  selectedDate,
  setSelectedDate,
  providersList,
  setProvidersList,
  showAddForm,
  setShowAddForm,
}) => {
  const validateThreeDigitNumber = (_, value) => {
    if (!value || /^\d{1,3}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid 3-digit number"));
  };
  const handleDatePicker = (date, dateString) => {
    setSelectedDate(dateString);
  };
  const AddProvider = (values) => {
    setProvidersList((prev) => {
      const maxId =
        prev?.length > 0 ? Math.max(...prev.map((item) => item?.id)) : 0;
      return [...prev, { id: maxId + 1, name: values?.providerName }];
    });
    form.resetFields();
  };
  const handleDelete = (id) => {
    setProvidersList((prev) => prev?.filter((item) => item?.id !== id));
  };
  const submitProviderForm = () => {
    setDOSList((prev) => {
      const maxId =
        prev?.length > 0 ? Math.max(...prev.map((item) => item?.id)) : 0;
      return [
        ...prev,
        {
          id: maxId + 1,
          date: selectedDate,
          providersList: providersList,
        },
      ];
    });
    setProvidersList([]);
    setSelectedDate(null);
  };

  return (
    <div>
      {showAddForm ? (
        <>
          <div className="d-flex justify-content-between">
            <label
              className={`${style.dateField} d-flex justify-content-center align-items-center`}
            >
              DOS
            </label>
            <Button
              className={style.cancelBtn}
              onClick={() => {
                setShowAddForm(false);
              }}
            >
              cancel
            </Button>
          </div>
          <div className="providerAddPicker">
            <DatePicker
              defaultValue={dayjs("05-20-2017", dateFormat)}
              format={dateFormat}
              suffixIcon={false}
              value={selectedDate ? dayjs(selectedDate, dateFormat) : ""}
              style={{ border: "1px solid #8888" }}
              onChange={handleDatePicker}
              className="providerAddPicker"
            />
          </div>
          <div className={style.formContainer}>
            <Form
              form={form}
              onFinish={AddProvider}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label={<label className={style.dateField}>Provider Name</label>}
                name="providerName"
                rules={[
                  { required: true, message: " Please Enter Provider name" },
                ]}
              >
                <Input placeholder="Enter Provider name" />
              </Form.Item>
              <Form.Item
                label={<label className={style.dateField}>Page Number</label>}
                name="pageNumber"
                rules={[
                  { required: true, message: "Please enter page number" },
                  { validator: validateThreeDigitNumber },
                ]}
              >
                <Input maxLength={3} placeholder="Enter Page Number" />
              </Form.Item>
              <Form.Item className="d-flex justify-content-center">
                <Button htmlType="submit" type="primary">
                  ADD
                </Button>
              </Form.Item>
            </Form>
            <div className={`row`} style={{ padding: "0px 10px" }}>
              {viewProvidersList({
                list: providersList,
                isDeletable: true,
                handleDelete: handleDelete,
              })}
            </div>
            {providersList?.length > 0 && (
              <div className="d-flex justify-content-center mt-4">
                <Tooltip title={selectedDate ? "" : "Please Select Date"}>
                  <Button
                    type="primary"
                    onClick={submitProviderForm}
                    disabled={selectedDate ? false : true}
                  >
                    Submit
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
          }}
        >
          Add
        </Button>
      )}
    </div>
  );
};

export default AddForm;
