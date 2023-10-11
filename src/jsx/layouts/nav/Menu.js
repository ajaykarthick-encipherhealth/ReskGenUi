import { SVGICON } from "../../constant/theme";

export const MenuList = [  
    {   
        title:'User Management',
        iconStyle:SVGICON.Apps,
        to: '/admin/user',
    },
    {   
        title:'File Management',
        iconStyle:SVGICON.Pages,
        to: '/admin/file-management',
    },
    {   
        title:'File View',
        iconStyle:SVGICON.TaskIcon,
        to: '/admin/file-view',
    },    
]

export const PhysicanMenuList = [
    {   
        title:'Dashboard',
        iconStyle: SVGICON.dashboardIcon,
        to: '/physician/dashboard',
    },
    {   
        title:'Patient List',
        iconStyle:SVGICON.patientListIcon,
        to: '/physician/patient',
    }
    
]