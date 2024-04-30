exports.userTypeCreateResponse = (userType) => {
    return {
        id: userType._id
    }
}

exports.userTypeGetAllResponse = (userTypes) => {
    return userTypes.map(userType => {
        return {
            id: userType._id,
            name: userType.name
        }
    })
}