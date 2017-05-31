export default {
    auth: {
        authorized: false
    },
    user: {
        _id: null,
        name: 'Unknown',
        errors: null,
        success: false
    },
    regions: {
        data: [],
        errors: null,
        fetching: false
    },
    servers: {
        tableData: [],
        chartData: [],
        stats:[],
        errors: null,
        fetching: false
    },
    settings: {
        admins:[],
        interval: '24h',
        regions: [],
        slo_metrics:[],
        APItoken:'',
        version:'1.2',
        adfs: [],
        fetching: false,
        errors: null,
        success: false
    }
}
