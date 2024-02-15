exports.createBusinessUnitObject = (req) => {
    return {
        name: req.body.name,
        shortName: req.body.shortName,
        isEnabled: req.body.isEnabled ? req.body.isEnabled : true,
        createdBy: req.userId
    };
};

exports.updateBusinessUnitObject = (req) => {
    const businessUnitObject = {
        updatedBy: req.userId
    };
    if(req.body.name) businessUnitObject.name = req.body.name;
    if(req.body.shortName) businessUnitObject.shortName = req.body.shortName;
    if(req.body.isEnabled !== undefined) businessUnitObject.isEnabled = req.body.isEnabled;

    return businessUnitObject;
};



