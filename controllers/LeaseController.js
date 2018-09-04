
const tenantLeaseModel = require("../models/TenantLease");

exports.addLease = function(req,res,next){
    if(res.locals.user.role!='LANDLORD'){
        return res.status(403).send("Unauthorized user");
    }
    let lease = {};
    lease.tenantName = req.body.tenantName;
    lease.propAddress = req.body.propAddress;
    lease.leaseStart = req.body.leaseStart;
    lease.leaseEnd = req.body.leaseEnd;
    lease.rent = req.body.rent;
    lease.leaseStatus = req.body.leaseStatus;
    lease.landlordId = req.body.landlordId;
    lease.tenantId = req.body.tenantId;
    tenantLeaseModel.addTenantLease(lease,function(tenantLease, error){
        if(error){
            res.error('Cannot save lease : ' + error, null, {
                type: 0,
                title: 'error',
                message: 'Something went wrong. Cannot update details'
            });
        } else{
            console.log(tenantLease);
            res.send(tenantLease);
        }
    });
}

exports.updateLease = function(req, res, next){
    if(res.locals.user.role!='LANDLORD'){
        return res.status(403).send("Unauthorized user");
    }
    let leaseId = req.params.id.toString();
    let updateRecord = req.body;
    let record = {};
    tenantLeaseModel.getSingleEntity(leaseId, function(lease, error){
        if(error){
            res.status(500).send({
                message: 'Cannot update order entity',
                data: error
            });
        } else {
            record.tenantName = updateRecord.tenantName || lease.tenantName;
            record.propAddress = updateRecord.propAddress || lease.propAddress;
            record.leaseStart = updateRecord.leaseStart || lease.leaseStart;
            record.leaseEnd = updateRecord.leaseEnd || lease.leaseEnd;
            record.rent = updateRecord.rent || lease.rent;
            record.leaseStatus = updateRecord.leaseStatus || lease.leaseStatus;
            record.landlordId = updateRecord.landlordId || lease.landlordId;
            record.tenantId = updateRecord.tenantId || lease.tenantId;
            tenantLeaseModel.updateEntity(leaseId, record, function(response, error){
                if(error){
                    res.status(500).send({
                        message: 'Cannot update order entity',
                        data: error
                    });
                } else {
                    res.status(200).send({
                        message: 'Order entity successfully updated',
                        data: response
                    });
                }
            });
        }
    });
}

exports.getSingleEntity = function(req, res, next){
    if(res.locals.user.role!='LANDLORD'){
        return res.status(403).send("Unauthorized user");
    }
    let leaseId = req.params.id.toString();
    tenantLeaseModel.getSingleEntity(leaseId, function(lease, error){
        if(error){
            res.status(500).send({
                message: 'Could not fetch data',
                data: error
            });
        } else {
            let leaseStart = lease.leaseStart;
            let leaseEnd = lease.leaseEnd;
            let response = {
                tenantName: lease.tenantName,
                propAddress: lease.propAddress,
                leaseStart: leaseStart,
                leaseEnd: leaseEnd,
                rent: lease.rent,
                leaseStatus: lease.leaseStatus,
                landlordId: lease.landlordId,
                tenantId: lease.tenantId
            }
            res.status(200).send({
                message: 'Lease details fetched',
                data: response
            });
        }
    });
}

exports.getList = function(req, res, next){
    if(res.locals.user.role!='LANDLORD'){
        return res.status(403).send("Unauthorized user");
    }
        let user = res.locals.user;
            if(user){
                if(user.role=='TENANT'){
                    res.status(403).send({message:"Not registered as Landlord",data:null});
                }
                tenantLeaseModel.getList(user._id.toString(), user.role, function(lease, error){
                    if(error){
                        res.status(500).send({
                            message: 'Cannot get order list',
                            data: error
                        });
                    } else {
                        let response = [];
                        for(let i = 0 ; i < lease.length ; i++){
                            let leaseStart = lease[i].leaseStart;
                            let leaseEnd = lease[i].leaseEnd;
                            response.push({
                                tenantName: lease[i].tenantName,
                                propAddress: lease[i].propAddress,
                                leaseStart: leaseStart,
                                leaseEnd: leaseEnd,
                                rent: lease[i].rent,
                                leaseStatus: lease[i].leaseStatus,
                                landlordId: lease[i].landlordId,
                                tenantId: lease[i].tenantId
                            });
                        }
                        res.status(200).send({
                            message: 'Lease fetched successfully',
                            data: response
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: 'User not found',
                    data: null
                });
            }
}

exports.deleteEntity = function(req, res, next){
    if(res.locals.user.role!='LANDLORD'){
        return res.status(403).send("Unauthorized user");
    }
    let id = req.params.id;
    tenantLeaseModel.deleteEntity(id, function(deleted, error){
        if(deleted){
            res.send({
                message: 'Lease deleted',
                data: null
            });
        } else {
            res.send({
                message: 'Unable to delete lease',
                data: error
            })
        }
    });
}