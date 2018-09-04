
const kind = "Orders";
const Datastore = require('@google-cloud/datastore');
const projectId = 'propertymanagement-207415';
const datastore = new Datastore({
  projectId: projectId
});
const transaction = datastore.transaction();
var unidecode = require('unidecode');

exports.getList = function(user, filters, callback){
    const query = datastore.createQuery(kind);
    if(user.role.toLowerCase() == 'landlord'){
        query.filter('landlordId', '=', user._id);
        if(filters.tenantId){
            query.filter('tenantId', '=', filters.tenantId);
        }
    } else if(user.role.toLowerCase() == 'tenant'){
        query.filter('tenantId', '=', user._id);
        if(filters.landlordId){
            query.filter('landlordId', '=', filters.landlordId);
        }
    }
    if(filters.status){
        query.filter('ordStatus', '=', filters.status);
    }
    if(filters.priority){
        query.filter('priority', '=', filters.priority);
    }
    if(filters.tenantId){
        query.filter('tenantId', '=', filters.tenantId);
    }
    if(filters.leaseId){
        query.filter('leaseId', '=', filters.leaseId);
    }
    if(filters.orderNo){
        query.filter('orderNo', '=', filters.orderNo);
    }
    //RANGE CODE BELOW
    if(filters.creationDate){
        query.filter('creationDate', '>', filters.creationDate);
    }
    if(filters.estimatedCost){
        query.filter('estimatedCost', '>', filters.estimatedCost);
    }
    //LIKE queries remaining Order description, reported by, mobile, email, orderLoc
    // INCOMPLETE
    if(filters.ordDescription){
        query.filter('ordDescription', '>=', filters.ordDescription);
        console.log("-------------"+unidecode(filters.ordDescription+ "\ufffd"));
        query.filter('ordDescription', '<', unidecode(filters.ordDescription)+unidecode("\ufffd"));
        console.log(query);
    }
    if(filters.reportedBy){
        query.filter('reportedBy', '=', filters.reportedBy);
    }
    if(filters.mobile){
        query.filter('mobile', '=', filters.mobile);
    }
    if(filters.email){
        query.filter('email', '=', filters.email);
    }
    if(filters.orderLoc){
        query.filter('orderLoc', '=', filters.orderLoc);
    }
    //CODE REMAINING
    datastore.runQuery(query).then(results => {
        console.log(results);
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
}

exports.getSingleEntity = function(id, user, callback){
    const taskKey = datastore.key(["Orders", Number.parseInt(id)]);
    datastore.get(taskKey).then(results => {
        const order = results[0];
        if(user.role.toLowerCase() == 'tenant'){
            if(order.tenantId == user._id.toString()){
                callback(order, null);
            } else {
                callback(null, 'Cannot view this order');
            }
        } else if(user.role.toLowerCase() == 'landlord'){
            if(order.landlordId == user._id.toString()){
                callback(order, null);
            } else {
                callback(null, 'Cannot view this order');
            }
        } else {
            callback(null, 'Cannot view this order');
        }
    }).catch(function(error){
        callback(null, error);
    });
}

exports.createEntity = function(record, callback){
    const orderSave = {
        key:datastore.key(kind),
        data:{
        ordDescription: record.ordDescription,
        ordStatus: record.ordStatus,
        priority: record.priority,
        creationDate: new Date(),
        estimatedCost: record.estimatedCost,
        orderNo: record.orderNo,
        reportedBy: record.reportedBy,
        mobile: record.mobile,
        email: record.email,
        ordLoc: record.ordLoc,
        leaseId: record.leaseId,
        tenantId: record.tenantId,
        landlordId: record.landlordId
        }
    };
    datastore.save(orderSave).then(() => {
        callback(orderSave, null);
      })
      .catch(err => {
        console.error('ERROR:', err);
        callback(null, err);
      });
}

exports.updateEntity = function(id, record, callback){
    const taskKey = datastore.key(["Orders", Number.parseInt(id)]);
    const order = {
        key: taskKey,
        data: record
    };

    datastore.update(order).then(() => {
        callback(order,null);
    }).catch(err => {
        transaction.rollback();
        callback(null, err);
    });
}

exports.deleteEntity = function(id, callback){
    const taskKey = datastore.key([kind, Number.parseInt(id)]);
    datastore.delete(taskKey).then(() => {
        callback(true, null);
    }).catch(err => {
        callback(null, err);
    });
}