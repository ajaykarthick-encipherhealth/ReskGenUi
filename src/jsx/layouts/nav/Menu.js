import { SVGICON } from "../../constant/theme";

export const MenuList = [  
    {   
        title:'User Management',
        iconStyle:SVGICON.Usermanagement,
        to: '/admin/user',
    },
    {   
        title:'Patient File',
        iconStyle:SVGICON.Apps,
        to: '/admin/patient',
    },
    {   
        title:'File Management',
        iconStyle:SVGICON.File,
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
    // {   
    //     title:'Patient List1',
    //     iconStyle:SVGICON.patientListIcon,
    //     to: '/physician/patient',
    // },
    {   
        title:'Patient List',
        iconStyle:SVGICON.patientListIcon,
        to: '/physician/patients',
    },
    //  {   
    //     title:'User',
    //     iconStyle:SVGICON.Usermanagement,
    //     to: '/physician/user',
    // },
    
]