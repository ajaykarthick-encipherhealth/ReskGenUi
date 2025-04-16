import { Button, DatePicker, Form, Input } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";
import { formatDateForIndex, getResponePopup } from "../../../../utils/reusable";
import AppTable from "../../../../components/tables";

const Projects = ({ createProject ,getProject,projectData,loading}) => {
    const [form] = Form.useForm();
    const columns = [
        {
          name: "Project Id",
          value: "projectId",
        },
        {
          name: "Project Name",
          value: "projectName",
        },
        {
          name: "Initiated Date",
          value: "projectInitiatedDate",
          sortable: true,
          isDate: true,
        },
        {
          name: "End  Date",
          value: "projectEndDate",
          sortable: true,
          isDate: true,
        },
        { name: "STATUS", value: "status", status: true, infoIcon: true },
      ];

    const handleSubmit = async (values) => {
        const projectInitiatedDate = formatDateForIndex({ date: values.projectInitiatedDate, index: 0 });
        const projectEndDate = formatDateForIndex({ date: values.projectEndDate, index: 1 });
        const data = {
            projectId: values?.projectId,
            projectName: values?.projectName,
            projectInitiatedDate,
            projectEndDate,
        };
        try {
            const res = await createProject(data);
       
            if(res?.status === "SUCCESS"){
                getResponePopup(res)
                form.resetFields();
                getProject()
            }
        } catch (error) {
            console.error("Project creation error:", error);
        }
    };

    useEffect(()=>{
        getProject()
    },[])

    return (
        <div>
            <div className="mt-5 mx-4">
                <Form
                    form={form}
                    className="customInput"
                    onFinish={handleSubmit}
                    layout="vertical"
                    autoComplete="off"
                    style={{ maxWidth: 300 }}
                >
                    <Form.Item
                        label="Project ID"
                        name="projectId"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Project ID",
                            },
                        ]}
                    >
                        <Input placeholder="Project ID" />
                    </Form.Item>
                    <Form.Item
                        label="Project Name"
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Project Name",
                            },
                        ]}
                    >
                        <Input placeholder="Project Name" />
                    </Form.Item>
                    <Form.Item
                        name="projectInitiatedDate"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Start Date",
                            },
                        ]}
                        label="Start Date"
                    >
                        <DatePicker
                            style={{ border: "1px solid #d9d9d9" }}
                            placeholder="Start Date"
                        />
                    </Form.Item>
                    <Form.Item
                        name="projectEndDate"
                        rules={[
                            {
                                required: true,
                                message: "Please enter End Date",
                            },
                        ]}
                        label="End Date"
                    >
                        <DatePicker
                            style={{ border: "1px solid #d9d9d9" }}
                            placeholder="End Date"
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="d-flex align-items-center justify-content-center">
                            <Button
                                htmlType="submit"
                                style={{
                                    width: 100,
                                    background: "rgb(4, 48, 111)",
                                    color: "#fff",
                                }}
                            >
                                Create
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <AppTable
              data={projectData?.content}
              column={columns}
              isPagination={false}
              loader={loading}
            />
            </div>
        </div>
    );
};
const enhancer = connect((state) => ({
    projectData:state?.tenantAdmin?.settings?.getProject?.data?.response,
    loading:state?.tenantAdmin?.settings?.getProjectLoader
}), {
    createProject: settingActions.createProjectAction,
    getProject:settingActions.getProjectAction,
    
});
export default enhancer(Projects);
