import { SVGICON } from "../../constant/theme";

export const MenuList = [
    {   
        title:'Dashboard',
        iconStyle: SVGICON.Home,
        to: '/dashboard',
    },
    {   
        title:'User Management',
        iconStyle:SVGICON.Apps,
        to: '/user-list',
    },
    // {   
    //     title:'PatientList',
    //     iconStyle:SVGICON.Apps,
    //     to: '/patient-list',
    // },
    {   
        title:'File Management',
        iconStyle:SVGICON.TaskIcon,
        to: '/file-management',
    },
    {   
        title:'File View',
        iconStyle:SVGICON.TaskIcon,
        to: '/file-view',
    },

    
]