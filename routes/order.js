const express = require('express');

const router = express.Router();
const orderController = require('../controllers/OrderController');
const datastoreController = require('../controllers/DatastoreController');
const authorize = require('../middleware/Authorize');

/**
 * @api {get} /order Get List
 * @apiName GetOrderList
 * @apiGroup OrderSet
 * @apiHeader {String} x-access-token Token
 * @apiSuccessExample Success-Response-for-landlord:
 * {
    "message": "Orders fetched successfully",
    "data": [
        {
            "_id": "5b0ffe999fdbd81934b1ef68",
            "ordDescription": "REPLACE FURNACE",
            "ordStatus": "Backlog",
            "priority": "Low",
            "creationDate": "1503360000000",
            "estimatedCost": 8100.42,
	        "orderNo": "100001",
            "reportedBy": "Jeremy",
            "mobile": "613-836-2535",
            "email": "Jeremy@sample.com",
            "ordLoc": "100001 REPLACE FURNACE",
            "leaseId": "TL1",
            "tenantId": "5b100c0173c8c90982255d54",
            "landlordId": "5b0fec054157d229a8c686ec"
        },
        {
            "_id": "5b0ffea19fdbd81934b1ef69",
            "ordDescription": "REPLACE FURNACE",
            "ordStatus": "Active",
            "priority": "Low",
            "creationDate": "1503360000000",
            "estimatedCost": 8100.42,
	        "orderNo": "100001",
            "reportedBy": "Jeremy",
            "mobile": "613-836-2535",
            "email": "def@ghy.com",
            "ordLoc": "100001 REPLACE FURNACE",
            "leaseId": "TL1",
            "tenantId": "USER_0002",
            "landlordId": "5b0fec054157d229a8c686ec"
        }
    ]
}
 *
 * @apiSuccessExample Success-Response-for-tenant
 * {
    "message": "Orders fetched successfully",
    "data": [
        {
            "_id": "5b0fec2324006412a6c70d69",
            "ordDescription": "REPLACE FURNACE",
            "ordStatus": "Backlog",
            "priority": "Low",
            "creationDate": "1503360000000",
            "estimatedCost": 8100.42,
	        "orderNo": "100001",
            "reportedBy": "Jeremy",
            "mobile": "613-836-2535",
            "email": "Jeremy@sample.com",
            "ordLoc": "100001 REPLACE FURNACE",
            "leaseId": "TL1",
            "tenantId": "5b100c0173c8c90982255d54",
            "landlordId": "USER_0001"
        },
        {
            "_id": "5b0ffe999fdbd81934b1ef68",
            "ordDescription": "REPLACE FURNACE",
            "ordStatus": "Backlog",
            "priority": "Low",
            "creationDate": "1503360000000",
            "estimatedCost": 8100.42,
	        "orderNo": "100001",
            "reportedBy": "Jeremy",
            "mobile": "613-836-2535",
            "email": "Jeremy@sample.com",
            "ordLoc": "100001 REPLACE FURNACE",
            "leaseId": "TL1",
            "tenantId": "5b100c0173c8c90982255d54",
            "landlordId": "5b0fec054157d229a8c686ec"
        }
    ]
}    
 */
router.get('/', authorize.verify, orderController.getList);

/**
 * @api {get} /order/:id Get Single Entity
 * @apiName GetOrder
 * @apiGroup OrderSet
 * @apiHeader {String} x-access-token Token
 * @apiParam (Param) {String} id OrderId
 * @apiSuccessExample Success-Response:
 *     {
    "message": "Order details fetched",
    "data": {
        "_id": "5b0ffea19fdbd81934b1ef69",
        "ordDescription": "REPLACE FURNACE",
        "ordStatus": "Backlog",
        "priority": "Low",
        "creationDate": "1503360000000",
        "estimatedCost": 8100.42,
	    "orderNo": "100001",
        "reportedBy": "Jeremy",
        "mobile": "613-836-2535",
        "email": "Jeremy@sample.com",
        "ordLoc": "100001 REPLACE FURNACE",
        "leaseId": "TL1",
        "tenantId": "USER_0002",
        "landlordId": "5b0fec054157d229a8c686ec"
    }
}
 *
 */
router.get('/:id', authorize.verify, orderController.getSingleEntity);

/**
 * @api {post} /order Create Single Entity
 * @apiName CreateOrder
 * @apiGroup OrderSet
 * @apiHeader {String} x-access-token Token
 * 
 * @apiParam (Body) {String} ordDescription Order Description
 * @apiParam (Body) {String} ordStatus Order Status
 * @apiParam (Body) {String} priority Priority
 * @apiParam (Body) {String} creationDate Creation Date
 * @apiParam (Body) {Number} estimatedCost Estimated Cost
 * @apiParam (Body) {String} orderno Order Number
 * @apiParam (Body) {String} reportedBy Reported By
 * @apiParam (Body) {String} mobile Mobile Number
 * @apiParam (Body) {String} email Email Id
 * @apiParam (Body) {String} ordLoc Order Location
 * @apiParam (Body) {String} leaseId Lease Id
 * @apiParam (Body) {String} lanlordId Landlord Id
 * @apiParamExample Request-Example:
 * {
	"ordDescription": "REPLACE FURNACE",
	"ordStatus": "Backlog",
	"priority": "Low",
	"creationDate": "1503360000000",
	"estimatedCost": 8100.42,
	"orderNo": "100001",
	"reportedBy": "Jeremy",
	"mobile": "613-836-2535",
	"email": "Jeremy@sample.com",
	"ordLoc": "100001 REPLACE FURNACE",
	"leaseId": "TL1",
	"tenantId": "USER_0002",
	"landlordId": "5b0fec054157d229a8c686ec"
}
 * @apiSuccessExample Success-Response:
 * {
    "message": "Order entity created successfully",
    "data": {
        "ordDescription": "REPLACE FURNACE",
        "ordStatus": "Backlog",
        "priority": "Low",
        "creationDate": "1503360000000",
        "estimatedCost": 8100.42,
	    "orderNo": "100001",
        "orderno": "100001",
        "reportedBy": "Jeremy",
        "mobile": "613-836-2535",
        "email": "Jeremy@sample.com",
        "ordLoc": "100001 REPLACE FURNACE",
        "leaseId": "TL1",
        "tenantId": "USER_0002",
        "landlordId": "5b0fec054157d229a8c686ec"
    }
}     
 */
router.post('/', authorize.tenant, orderController.createEntity);


/**
 * @api {put} /order/:id Update Single Entity
 * @apiName UpdateOrder
 * @apiGroup OrderSet
 * @apiHeader {String} x-access-token Token 
 * @apiParam (Param) {String} id Order Id
 * @apiParam (Body) {String} [ordDescription] Order Description
 * @apiParam (Body) {String} [ordStatus] Order Status
 * @apiParam (Body) {String} [priority] Priority
 * @apiParam (Body) {Number} [estimatedCost] Estimated Cost
 * @apiParam (Body) {String} [orderno] Order Number
 * @apiParam (Body) {String} [reportedBy] Reported By
 * @apiParam (Body) {String} [mobile] Mobile Number
 * @apiParam (Body) {String} [email] Email Id
 * @apiParam (Body) {String} [ordLoc] Order Location
 * 
 * @apiParamExample Request-Body: 
 * {
	"ordStatus": "Active"
	"email": "def@ghy.com"
}
 * @apiSuccessExample Success-Response:
 *     {
    "message": "Order entity successfully updated",
    "data": {
        "_id": "5b0ffea19fdbd81934b1ef69",
        "ordDescription": "REPLACE FURNACE",
        "ordStatus": "Active",
        "priority": "Low",
        "creationDate": "1503360000000",
        "estimatedCost": 8100.42,
	    "orderNo": "100001",
        "reportedBy": "Jeremy",
        "mobile": "613-836-2535",
        "email": "def@ghy.com",
        "ordLoc": "100001 REPLACE FURNACE",
        "leaseId": "TL1",
        "tenantId": "USER_0002",
        "landlordId": "5b0fec054157d229a8c686ec"
    }
}
 */
router.put('/:id', authorize.tenant, orderController.updateEntity);

router.post('/upload',datastoreController.addImage);

router.delete('/:id', authorize.verify, orderController.deleteEntity);

module.exports = router;