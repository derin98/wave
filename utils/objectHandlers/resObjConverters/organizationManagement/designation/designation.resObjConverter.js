exports.designationCreateResponse = (designation) => {
    return {
        id: designation._id
    }
}

exports.designationGetAllResponse = (designations) => {
    return designations.map(designation => {
        return {
            id: designation._id,
            name: designation.name
        }
    })
}