exports.authSignUpResponse = (auth) => {
    return {
        id: auth._id
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