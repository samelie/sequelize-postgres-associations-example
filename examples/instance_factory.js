var uuid = require('node-uuid');
var Prom = require('bluebird');
var _ = require('lodash');

'use strict';
module.exports = (function() {
  'use strict';
  var admin;

  function _autofill(data) {
    var autofill = {
      ProjectId: session.getProject()['id'],
      uuid: uuid.v4()
    };
    _.forIn(autofill, function(val, key) {
      if (!data[key]) {
        data[key] = val;
      }
    });
  }

  function init(a) {
    admin = a;
  }

  //**************
  //USER
  //**************

  function createUser(data) {
    return admin.User.create(_.assign(data, {
      uuid: uuid.v4()
    }));
  }

  //**************
  //PROJECT
  //**************

  function createProject(data) {
    var projectData = _.assign(data, {
      uuid: uuid.v4()
    });
    return admin.Project.create(projectData)
      .then(function(projectInstance) {
        return admin.UserProject.create({
          UserId: session.getUser().id,
          ProjectId: projectInstance.id
        });
      });
  }

  //**************
  //CONTENT
  //**************

  function createContent(data) {
    _autofill(data);
    return admin.Content.create(data)
      .then(function(contentInstance) {
        return admin.ProjectContent.create({
          ContentId: contentInstance.id,
          ProjectId: session.getProject().id
        }).then(function(){
          return contentInstance;
        });
      });
  }

  //**************
  //TAG
  //**************

  function createTag(data) {
    return new Prom(function(resolve, reject) {
      _autofill(data);
      admin.Tag.create(data)
        .then(function(tagInstance) {
          var resInstanceData = tagInstance.toJSON();
          admin.ProjectTag.create({
            TagId: resInstanceData.id,
            ProjectId: session.getProject().id
          }).then(function() {
            if (data.ContentId) {
              admin.ContentTag.create({
                ContentId: data.ContentId,
                TagId: data.TagId
              }).then(function() {
                resolve(resInstanceData);
              });
            } else {
              resolve(resInstanceData);
            }
          });
        }).catch(function(err) {
          console.log(err);
          reject();
        });
    });
  }


  //**************
  //CONTENT TAG
  //**************

  return {
    init: init,
    createProject: createProject,
    createContent: createContent,
    createTag: createTag,
    createUser: createUser
  }
})();