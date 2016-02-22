var Prom = require('bluebird');
var Fac = require('./db/instance_factory');

module.exports = function(admin) {
  
  return {
    //***********
    //USER
    //***********
    saveUser: function(profile) {
      return new Prom(function(resolve, reject) {
        if (profile['provider']) {
          if (profile['provider'] === 'facebook') {
            admin.User.findAll({
              where: {
                facebookId: profile['id']
              }
            }).then(function(res) {
              if (_.isEmpty(res)) {
                Fac.createUser({
                  name: profile['displayName'],
                  facebookId: profile['id']
                }).then(function(user) {
                  resolve(user.toJSON());
                });
              } else {
                resolve(res[0].toJSON());
              }
            }).catch(function(err) {
              reject(err);
            });
          }
        }
      });
    },
    //***********
    //PROJECT
    //***********
    /*{auth:{}, data:{}}*/
    createProject: function(data) {
      return new Prom(function(resolve, reject) {
        admin.Project.findAll({
          where: {
            name: data['data']['name']
          }
        }).then(function(res) {
          if (_.isEmpty(res)) {
            Fac.createProject(data['data'])
              .then(function(project) {
                resolve(project.toJSON());
              });
          } else {
            resolve(res[0].toJSON());
          }
        }).catch(function(err) {
          reject(err);
        });
      });
    },

    /*THROUGH TABLE*/
    /*{auth:{}, data:{}}*/
    getUserProjects: function(data) {
      return new Prom(function(resolve, reject) {
        admin.Project.findAll({
          where: {
            name: data['data']['name']
          },
          include: [{
            through: {
              model: admin.UserProject,
              where: {
                UserId: data['auth']['id']
              }
            }
          }]
        }).then(function(res) {
          if (_.isEmpty(res)) {
            Fac.createProject({
              name: data['data']['name'],
              UserId: data['auth']['id']
            }).then(function(project) {
              resolve(project.toJSON());
            });
          } else {
            resolve(res[0].toJSON());
          }
        }).catch(function(err) {
          reject(err);
        });
      });
    },

    /*{auth:{}, data:{}}*/
    getProjectContent: function(data) {
      return new Prom(function(resolve, reject) {
        admin.Content.findAll({
          where: {
            ProjectId: data['projectId']
          },
          include: [admin.ProjectContent]
        }).then(function(res) {
          resolve(res);
        }).catch(function(err) {
          reject(err);
        });
      });
    },

    //***********
    //CONTENT
    //***********
    createContent: function(data) {
      var self = this;
      return new Prom(function(resolve, reject) {
        //see if it exists
        self.checkContentExists(data)
          .then(function(isContent) {
            console.log("----------");
            console.log(isContent);
            console.log("----------");
            if (isContent) {
              resolve(isContent);
            } else {
              Fac.createContent(data)
                .then(function(content) {
                  //return the db instance
                  resolve(content);
                }).catch(function(err) {
                  reject(err);
                });
            }
          }).catch(function(err) {
            reject(err);
          });
      });
    },

    //{platform:'', name:''}
    checkContentExists: function(data) {
      return admin.Content.findAll({
        where: {
          platform: data['platform'],
          platformId: data['platformId']
        },
        include: [admin.Project]
      }).then(function(res) {
        if (res.length === 0) {
          return false;
        } else {
          //return instance
          return res[0];
        }
      });
    },

    /*{auth:{}, data:{}}*/
    getUserContent: function(data) {
      return new Prom(function(resolve, reject) {
        data = data || {};
        var auth = data['auth'] || session.getUser();
        var options = data['options'] || {};
        var where = options['where'] || {};
        if (!auth) {
          reject({
            message: 'No Auth'
          });
        }
        //use provided or default to all usercontent
        var defaultOptions = {
          UserId: auth['id']
        };
        var query = {
          //where: _.assign(defaultOptions, where),
          where: where,
          include: [admin.Project]
        };
        var finalQuery = _.merge(query, options);
        admin.Content.findAll(finalQuery)
          .then(function(res) {
            resolve(res);
          }).catch(function(err) {
            reject(err);
          });
      });
    },

    deleteContent: function(data) {
      return new Prom(function(resolve, reject) {
        data = data || {};
        var auth = data['auth'] || session.getUser();
        var options = data['options'] || {};
        var where = options['where'] || {};
        //use provided or default to all usercontent
        var defaultOptions = {
          UserId: auth['id']
        };
        var query = {
          where: _.assign(defaultOptions, where),
          include: [admin.Project]
        };
        var finalQuery = _.merge(query, options);
        admin.Content.findAll(finalQuery)
          .then(function(res) {
            var params = {
              Bucket: process.env.AWS_S3_CLIPS_BUCKET,
              /* required */
              Delete: { /* required */
                Objects: [],
                Quiet: true
              }
            };
            var objs = params['Delete']['Objects'];
            _.each(res, function(instance) {
              params['Delete']['Objects'].push({
                'Key': instance.toJSON()['uuid']
              });
              instance.destroy({
                force: true
              });
            });
            var deleteObjs = s3Client.deleteObjects(params);
            deleteObjs.on('end', function() {
              resolve(objs);
            });
          }).catch(function(err) {
            reject(err);
          });
      });
    },

    updateContent: function(data, options) {
      var tagId = data.tagId;
      delete data.tagId;

      return new Prom(function(resolve, reject) {
        admin.Content.update(data, options)
          .then(function(res) {
            console.log(options);
            console.log(res);
            console.log(tagId);
            if (tagId) {
              admin.ContentTag.findAll({
                where: {
                  TagId: tagId,
                  ContentId: options.where.id
                }
              }).then(function(contentTagRes) {
                console.log(contentTagRes);
                console.log(_.isEmpty(contentTagRes));
                if (_.isEmpty(contentTagRes)) {
                  console.log("Insert");
                  admin.ContentTag.create({
                    TagId: tagId,
                    ContentId: options.where.id
                  }).then(function() {
                    console.log("SUCCESS");
                    resolve();
                  });
                }
              }).catch(function(err) {
                reject(err);
              });
            } else {
              resolve();
            }
          })
          .catch(function(err) {
            reject(err);
          });
      });
    },

    //***********
    //TAGS
    //***********

    getTags: function(options) {
      options = options || {};

      return admin.Tag.findAll({
        include: [{
          model: admin.Project,
          through: {
            model: admin.ProjectTag,
            where: options.where
          }
        }]
      });
      /*return admin.ProjectTag.findAll({
        where: where.where,
        include: [admin.Tag]
      })*/
      /*.then(function(res) {
              return admin.
            });*/
    },

    updateTag: function(data, where) {
      console.log(data, where);
      return admin.Tag.update(data, where);
    },

    createTag: function(data) {
      var names = data.name.split(',');
      var formatted = [];
      _.each(names, function(tagName) {
        var fmt = Utils.removeExtraspace(tagName);
        fmt = fmt.toLowerCase();
        if (fmt && fmt !== "") {
          formatted.push(fmt);
        }
      });

      //because formatted
      delete data.name;

      return Prom.map(formatted, function(name) {
        return Fac.createTag(_.merge(data, {
          name: name
        }));
      });
    },

    /*{auth:{}, data:{}}*/
    getTagContent: function(data) {
      return new Prom(function(resolve, reject) {
        admin.Content.findAll({
          where: {
            tagUuids: {
              $iLike: "%" + data['TagId'] + "%"
            }
          }
        }).then(function(res) {
          resolve(res);
          console.log(res);
        }).catch(function(err) {
          reject(err);
        });


      });
    }


  }
};