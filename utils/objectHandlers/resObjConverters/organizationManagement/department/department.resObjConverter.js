exports.departmentCreateResponse = (department) => {
    return {
        id: department._id
    }
}

exports.departmentGetAllResponse = (departments) => {
    return departments.map(department => {
        return {
            id: department._id,
            name: department.name
        }
    })
}