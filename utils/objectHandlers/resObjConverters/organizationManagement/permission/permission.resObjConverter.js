exports.permissionCreateResponse = (permission) => {
    return {
        id: permission._id
    }
}

exports.permissionGetAllResponse = (permissions) => {
    return permissions.map(permission => {
        return {
            id: permission._id,
            name: permission.name
        }
    })
}