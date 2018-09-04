const orderModel = require("../models/Order");

exports.getList = function(req, res, next){
    let user = res.locals.user;
    let filters = req.query;
    console.log(filters);
    if(user){
        orderModel.getList(user, filters, function(orders, error){
            if(error){
                res.status(500).send({
                    message: 'Cannot get order list',
                    data: error
                });
            } else {
                let response = [];
                for(let i = 0 ; i < orders.length ; i++){
                    let creationDate = orders[i].creationDate.getTime();
                    response.push({
                        ordDescription: orders[i].ordDescription,
                        ordStatus: orders[i].ordStatus,
                        priority: orders[i].priority,
                        creationDate,
                        estimatedCost: orders[i].estimatedCost,
                        orderNo: orders[i].orderNo,
                        reportedBy: orders[i].reportedBy,
                        mobile: orders[i].mobile,
                        email: orders[i].email,
                        ordLoc: orders[i].ordLoc,
                        leaseId: orders[i].leaseId,
                        tenantId: orders[i].tenantId,
                        landlordId: orders[i].landlordId
                    });
                }
                res.status(200).send({
                    message: 'Orders fetched successfully',
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

exports.getSingleEntity = function(req, res, next){
    let orderId = req.params.id.toString();
    let user = res.locals.user;
    orderModel.getSingleEntity(orderId, user, function(order, error){
        if(error){
            res.status(500).send({
                message: 'Could not fetch data',
                data: error
            });
        } else {
            let creationDate = order.creationDate.getTime();
            let response = {
                ordDescription: order.ordDescription,
                ordStatus: order.ordStatus,
                priority: order.priority,
                creationDate: creationDate,
                estimatedCost: order.estimatedCost,
                orderNo: order.orderNo,
                reportedBy: order.reportedBy,
                mobile: order.mobile,
                email: order.email,
                ordLoc: order.ordLoc,
                leaseId: order.leaseId,
                tenantId: order.tenantId,
                landlordId: order.landlordId
            }
            res.status(200).send({
                message: 'Order details fetched',
                data: response
            });
        }
    });
}

exports.createEntity = function(req, res, next){
    let record = req.body;
    record.tenantId = res.locals.user._id;
    orderModel.createEntity(record, function(response, error){
        if(error){
            res.status(500).send({
                message: 'Cannot create order entity',
                data: error
            });
        } else {
            const invoice = require('../utils/Invoice');
            const order = Object.assign({}, response.data);
            invoice.generateInvoice(order).then(function (pdf) {
                const mailer = require('../utils/Mailer');
                mailer.sendAttachment("sagar20aug@gmail.com","Pdf sent",pdf);
            }).catch(function (error) {
                console.log(error);
            });
            res.status(200).send({
                message: 'Order entity created successfully',
                data: response
            });
        }
    });
}

exports.updateEntity = function(req, res, next){
    let orderId = req.params.id.toString();
    let updateRecord = req.body;
    let user = res.locals.user;
    let record = {};

    orderModel.getSingleEntity(orderId, user, function(order, error){
        if(error){
            res.status(500).send({
                message: 'Cannot update order entity',
                data: error
            });
        } else {
            record.ordDescription = updateRecord.ordDescription || order.ordDescription;
            record.ordStatus = updateRecord.ordStatus || order.ordStatus;
            record.priority = updateRecord.priority || order.priority;
            record.estimatedCost = updateRecord.estimatedCost || order.estimatedCost;
            record.orderNo = updateRecord.orderNo || order.orderNo;
            record.reportedBy = updateRecord.reportedBy || order.reportedBy;
            record.mobile = updateRecord.mobile || order.mobile;
            record.email = updateRecord.email || order.email;
            record.ordLoc = updateRecord.ordLoc || order.ordLoc;
            record.creationDate = updateRecord.creationDate || order.creationDate;
            record.leaseId = updateRecord.leaseId || order.leaseId;
            record.tenantId = updateRecord.tenantId || order.tenantId;
            record.landlordId = updateRecord.landlordId || order.landlordId;
            orderModel.updateEntity(orderId, record, function(response, error){
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

exports.deleteEntity = function(req, res, next){
    if(res.locals.user.role!='TENANT'){
        return res.status(403).send("Unauthorized user");
    }
    let id = req.params.id;
    orderModel.deleteEntity(id, function(deleted, error){
        if(deleted){
            res.send({
                message: 'Order deleted',
                data: null
            });
        } else {
            res.send({
                message: 'Unable to delete order',
                data: error
            })
        }
    });
}