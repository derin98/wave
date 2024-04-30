exports.teamCreateResponse = (team) => {
    return {
        id: team._id
    }
}

exports.teamGetAllResponse = (teams) => {
    return teams.map(team => {
        return {
            id: team._id,
            name: team.name
        }
    })
}