
const express = require('express');
const authorize = require('../middleware/Authorize');

const router = express.Router();
const leaseController = require('../controllers/LeaseController');

/**
 * @api {post} /lease Create Single Entity
 * @apiName CreateLease
 * @apiGroup TenantLease
 * @apiHeader {String} x-access-token Token
 * 
 * @apiParam (Body) {String} tenantName Tenant Name
 * @apiParam (Body) {String} propAddress Property Address
 * @apiParam (Body) {Date} leaseStart Lease Start Date
 * @apiParam (Body) {Date} leaseEnd Lease End Date
 * @apiParam (Body) {Number} rent Rent
 * @apiParam (Body) {String} leaseStatus Lease Status
 * @apiParam (Body) {String} landlordId Landlord Id
 * @apiParam (Body) {String} tenantId Tenant Id
 * @apiParamExample Request-Example:
 * {
	"tenantName" : "Sagar",
    "propAddress" : "Ikeva",
    "leaseStart" : "01/06/2018 GMT",
    "leaseEnd" : "01/06/2019 GMT",
    "rent" : 2000,
    "leaseStatus" : "Active",
    "landlordId" : "5b1105698e5f60036c582f05",
    "tenantId" : "5b11140f5c9fff31b3001570"
}
 * @apiSuccessExample Success-Response:
 * {
    "tenantName": "Sagar",
    "propAddress": "Ikeva",
    "leaseStart": "01/06/2018 GMT",
    "leaseEnd": "01/06/2019 GMT",
    "rent": 2000,
    "leaseStatus": "Active",
    "landlordId": "5b1105698e5f60036c582f05",
    "tenantId": "5b11140f5c9fff31b3001570"
}
 */
router.post('/add',authorize.verify, leaseController.addLease);


/**
 * @api {put} /lease/:id Update Single Entity
 * @apiName UpdateLease
 * @apiGroup TenantLease
 * @apiHeader {String} x-access-token Token 
 * @apiParam (Body) {String} tenantName Tenant Name
 * @apiParam (Body) {String} propAddress Property Address
 * @apiParam (Body) {Date} leaseStart Lease Start Date
 * @apiParam (Body) {Date} leaseEnd Lease End Date
 * @apiParam (Body) {Number} rent Rent
 * @apiParam (Body) {String} leaseStatus Lease Status
 * @apiParam (Body) {String} landlordId Landlord Id
 * @apiParam (Body) {String} tenantId Tenant Id
 * 
 * @apiParamExample Request-Body: 
 * {
	"tenantName":"Shrinath Prabhu"
}
 * @apiSuccessExample Success-Response:
 *     {
    "message": "Order entity successfully updated",
    "data": {
        "_id": "5b1128f7cb21910368595c44",
        "tenantName": "Shrinath Prabhu",
        "propAddress": "Ikeva",
        "leaseStart": "2018-01-06T00:00:00.000Z",
        "leaseEnd": "2019-01-06T00:00:00.000Z",
        "rent": 2000,
        "leaseStatus": "Active",
        "landlordId": "5b1105698e5f60036c582f05",
        "tenantId": "5b11140f5c9fff31b3001570"
    }
}
 */
router.put('/:id',authorize.verify, leaseController.updateLease);

/**
 * @api {get} /lease/:id Get Single Lease Details
 * @apiName GetLeaseDetails
 * @apiGroup TenantLease
 * @apiHeader {String} x-access-token Token
 * @apiParam (Param) {String} id LeaseId
 * @apiSuccessExample Success-Response:
 *    {
    "message": "Lease details fetched",
    "data": {
        "tenantName": "Sagar",
        "propAddress": "Ikeva",
        "leaseStart": 1515196800000,
        "leaseEnd": 1546732800000,
        "rent": 2000,
        "leaseStatus": "Active",
        "landlordId": "5b1105698e5f60036c582f05",
        "tenantId": "5b11140f5c9fff31b3001570"
    }
}
 *
 */
router.get('/:id',authorize.verify, leaseController.getSingleEntity);


/**
 * @api {get} /lease Get List
 * @apiName GetLeaseList
 * @apiGroup TenantLease
 * @apiHeader {String} x-access-token Token
 * @apiSuccessExample Success-Response:
 * {
    "message": "Lease fetched successfully",
    "data": [
        {
            "tenantName": "Sagar",
            "propAddress": "Ikeva",
            "leaseStart": 1515196800000,
            "leaseEnd": 1546732800000,
            "rent": 2000,
            "leaseStatus": "Active",
            "landlordId": "5b1105698e5f60036c582f05",
            "tenantId": "5b11140f5c9fff31b3001570"
        }
    ]
}
 *   
 */
router.get('/',authorize.verify, leaseController.getList);

router.delete('/:id', authorize.verify, leaseController.deleteEntity);

module.exports = router;