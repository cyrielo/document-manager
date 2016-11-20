class Document{

  constructor(){
    this.jwt = require('jsonwebtoken');
    this.config = require('./../config/config');
    this.models = require('./../models/index');
  }

  createDoc(req, res){

    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    this.models.documents.createDoc(req, verifyToken.id, verifyToken.role).then((document)=>{
      res.status(201).json({
        status: 'success',
        message: 'Document created successfully',
        data: document
      });
    }).catch((error)=>{
      res.status(403).json({
        status: 'fail',
        message: error
      })
    });
  }

  all(req, res){
    const
      limit = req.query.limit,
      offset = req.query.offset,
      byRole = req.query.role,
      byDate = req.query.date,
      verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    this.models.documents.all(limit, offset, byRole, byDate, verifyToken.id, verifyToken.role)
      .then((docs)=>{
        res.status(200).json({
          status: 'success',
          message: 'Documents listed',
          data: docs
        })
      }).catch((errorDetails)=>{
      res.status(errorDetails.statusCode).json({
        status: 'fail',
        message: errorDetails.message
      });
    })
  }

  getDoc(req, res){
    const docId = req.params.id;
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    this.models.documents.getDoc(verifyToken.id, docId)
      .then((document)=>{
        res.status(200).json({
          status: 'success',
          message: 'Document info loaded',
          data: document
        })
      }).catch((errorDetails)=>{
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message
        });
    })
  }

  updateDoc(req, res){
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    const docId = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    const access = req.body.access;

    const Validator = require('./../helpers/validate');
    const validate = new Validator();

    let update = {}, errors = [];

    if(!validate.isEmpty(title)){
      update.title = title;
    }else if(validate.isDefined(title)){
      errors.push('Title is empty');
    }

    if(!validate.isEmpty(content)){
      update.content = content;
    }else if(validate.isDefined(content)){
      errors.push('Content is empty');
    }

    if(!validate.isEmpty(access)){
      update.access = access;
    }else if(validate.isDefined(access)){
      errors.push('Access is empty');
    }

    if(errors.length < 1){
      this.models.documents.update(docId, verifyToken.id, update)
        .then((document)=>{
          res.status(201).json({
            status: 'success',
            message: 'Document created successfully',
            data: document
          });
        }).catch((errorDetails)=>{
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message
        })
      });
    }else{
      res.status(403).json({
        status: 'fail',
        message: 'You have errors in data submitted',
        data: errors
      });
    }


  }

  deleteDoc(req, res){

    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    const docId = req.params.id;

   // console.log(verifyToken);
    this.models.documents.deleteDoc(docId, verifyToken.id)
      .then(()=>{
      res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully',
      });
    }).catch((errorDetails)=>{
      res.status(errorDetails.statusCode).json({
        status: 'fail',
        message: errorDetails.message
      })
    });
  }

}

module.exports = Document;