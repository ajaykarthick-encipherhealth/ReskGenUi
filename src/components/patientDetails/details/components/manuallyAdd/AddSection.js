import { Form, Input, Select } from "antd";

const AddSection = ({ id, section, selectMeat = "", pageNumbers }) => {
  return (
    <div className="mx-2 p-3 pt-4 border rounded">
      <div className="row ">
        <div className="col-6">
          <Form.Item
            label={
              <label className="mb-0">
                Page Number <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`pageNumber_${section?.replaceAll(" ", "-")}${
              selectMeat ? "_" + selectMeat : selectMeat
            }_${id}`}
            rules={[
              {
                required: true,
                message: "Please Select Page Number",
              },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Select
              options={pageNumbers}
              // size="large"
              // className={`ant_select_form hcc_form mb-2`}
              allowClear
            />
          </Form.Item>
        </div>
        <div className="col-6">
          <Form.Item
            label={
              <label className="mb-0">
                Reference <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`referance_${section?.replaceAll(" ", "-")}${
              selectMeat ? "_" + selectMeat : selectMeat
            }_${id}`}
            rules={[
              {
                required: true,
                message: "Please enter Referance",
              },
              {
                validator: (_, value) =>
                  value && value.trim() !== ""
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Reference cannot be empty or just spaces")
                      ),
              },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input name="referance" className="manually" />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default AddSection;
