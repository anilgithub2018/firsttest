
const kind = "Leases";
const Datastore = require('@google-cloud/datastore');
const projectId = 'propertymanagement-207415';
const datastore = new Datastore({
    projectId: projectId
});
const transaction = datastore.transaction();

exports.addTenantLease = function(tenantLease, callback){
    const taskKey = datastore.key(kind);
    const lease = {
        key:taskKey,
        data:{
        tenantName: tenantLease.tenantName,
        propAddress: tenantLease.propAddress,
        leaseStart: tenantLease.leaseStart,
        leaseEnd: tenantLease.leaseEnd,
        rent: tenantLease.rent,
        leaseStatus: tenantLease.leaseStatus,
        landlordId: tenantLease.landlordId,
        tenantId: tenantLease.tenantId
    }
    };
    datastore.save(lease).then(() => {
        console.log(lease);
        callback(lease, null);
    })
        .catch(err => {
            console.log('Failed');
            console.log(error);
            callback(null, error.errmsg);
        });
}

exports.getSingleEntity = function(id, callback){
    const taskKey = datastore.key([kind, Number.parseInt(id)]);
    datastore.get(taskKey).then(results => {
        const lease = results[0];
        callback(lease, null);
    }).catch(function(error){
        callback(null, error);
    });
}

exports.updateEntity = function(id, tenantLease, callback){
    const taskKey = datastore.key([kind, Number.parseInt(id)]);
    const lease = {
        key: taskKey,
        data: tenantLease
    };

    datastore.update(lease).then(() => {
        callback(lease,null);
    }).catch(err => {
        transaction.rollback();
        callback(null, err);
    });
}

exports.getList = function(userId, role, callback){
    if(role.toLowerCase() == 'landlord'){
        const query = datastore.createQuery(kind).filter('landlordId','=',userId);
        datastore.runQuery(query).then(results => {
            const entities = results[0];
            const info = results[1];

            if (info.moreResults !== Datastore.NO_MORE_RESULTS) {
                // If there are more results to retrieve, the end cursor is
                // automatically set on `info`. To get this value directly, access
                // the `endCursor` property.
                return runPageQuery(info.endCursor).then(results => {
                    // Concatenate entities
                    results[0] = entities.concat(results[0]);
                    return results;
                });
            }
            callback(entities,null);
        }).catch(function(error){
            callback(null, error);
        });
    } else {
        callback(null, 'No records found');
    }
}

exports.deleteEntity = function(id, callback){
    const taskKey = datastore.key([kind, Number.parseInt(id)]);
    datastore.delete(taskKey).then(() => {
        callback(true, null);
    }).catch(err => {
        callback(null, err);
    });
}