exports.businessUnitCreateResponse = (businessUnit) => {
    return {
        id: businessUnit._id
    }
}

exports.businessUnitGetAllResponse = (businessUnits) => {
    return businessUnits.map(businessUnit => {
        return {
            id: businessUnit._id,
            name: businessUnit.name,
            shortName: businessUnit.shortName
        }
    })
}