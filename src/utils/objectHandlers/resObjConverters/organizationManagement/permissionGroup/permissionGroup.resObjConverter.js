exports.permissionGroupCreateResponse = (permissionGroup) => {
    return {
        id: permissionGroup._id
    }
}

exports.permissionGroupGetAllResponse = (permissionGroups) => {
    return permissionGroups.map(permissionGroup => {
        return {
            id: permissionGroup._id,
            name: permissionGroup.name
        }
    })
}