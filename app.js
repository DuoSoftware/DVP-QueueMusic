/**
 * Created by a on 8/25/2015.
 */

var restify = require('restify');
var config = require('config');
var mongomodels = require('dvp-mongomodels');
var dbModel = require('dvp-dbmodels');
var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var msg = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
//var sre = require('swagger-restify-express');
var format = require("stringformat");
var User = require('dvp-mongomodels/model/User');
var Organization = require('dvp-mongomodels/model/Organisation');
var jwt = require('restify-jwt');
var secret = require('dvp-common-lite/Authentication/Secret.js');
var authorization = require('dvp-common-lite/Authentication/Authorization.js');
var moment = require('moment-timezone');
var BusinessUnit = require('dvp-mongomodels/model/BusinessUnit').BusinessUnit;
var healthcheck = require('dvp-healthcheck/DBHealthChecker');


var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("[Unhandled Exception] Node Exiting...");
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error(err);
  console.log("[Unhandled Rejection] Node Exiting...");
  process.exit(1);
});

var server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.use(jwt({secret: secret.Secret}).unless({path: ['/healthcheck']}));

var hc = new healthcheck(server, { pg: dbModel.SequelizeConn, mongo:mongomodels.connection });
hc.Initiate();

server.get('/DVP/API/:version/QueueMusic/Profile/:name', authorization({resource:"queuemusic", action:"read"}),function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusic HTTP  ");


    var company;
    var tenant;

    if(req&& req.user && req.user.company && req.user.tenant) {

        company =req.user.company;
        tenant = req.user.tenant;


        dbModel.QueueProfile.find({where: [{Name: req.params.name},{CompanyId: company}, {TenantId: tenant}]}).then(function (obj) {


            try {

                logger.debug("DVP-QueueMusic.GetQueueMusic Found ");

                var instance = msg.FormatMessage(undefined, "Get Queue Music done", true, obj);
                res.write(instance);

            } catch (exp) {

            }

            res.end();

        }).catch(function (err) {

            logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
            var instance = msg.FormatMessage(undefined,"Get Profile Failed", status,err);
            res.write(instance);
            res.end();


        });


    }else{

        res.write(msg.FormatMessage(err, "Token error, no company data found", false, undefined));
        res.end();

    }





    return next();

});


server.get('/DVP/API/:version/QueueMusic/Profiles', authorization({resource:"queuemusic", action:"read"}),function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusics HTTP  ");


    var company;
    var tenant;

    if(req&& req.user && req.user.company && req.user.tenant) {

        company =req.user.company;
        tenant = req.user.tenant;

        dbModel.QueueProfile.findAll({where:[{CompanyId: company}, {TenantId: tenant}]}).then(function (obj) {


            try {

                logger.debug("DVP-QueueMusic.GetQueueMusics Found ");

                var instance = msg.FormatMessage(undefined, "Get Queue Musics done", true, obj);
                res.write(instance);

            } catch (exp) {

            }

            res.end();

        }).catch(function (err) {

            logger.error("DVP-SystemRegistry.CreateQueueMusics failed ", err);
            var instance = msg.FormatMessage(undefined,"Get Queue Musics Failed", status,err);
            res.write(instance);
            res.end();


        });


    }else{

        res.write(msg.FormatMessage(err, "Token error, no company data found", false, undefined));
        res.end();

    }




    return next();

});


server.del('/DVP/API/:version/QueueMusic/Profile/:name',authorization({resource:"queuemusic", action:"delete"}), function(req, res, next) {

    logger.debug("DVP-QueueMusic.destroyQueueMusic HTTP  ");

    var company;
    var tenant;

    if(req&& req.user && req.user.company && req.user.tenant) {

        company =req.user.company;
        tenant = req.user.tenant;


        dbModel.QueueProfile.find({where: [{Name: req.params.name},{CompanyId: company}, {TenantId: tenant}]}).then(function (obj) {


            try {

                if(obj) {

                    logger.debug("DVP-QueueMusic.destroyQueueMusic Found ");
                    obj.destroy().then(function() {

                        logger.debug("DVP-QueueMusic.destroyQueueMusic destroyed ");

                    });



                    var instance = msg.FormatMessage(undefined, "Destroy Queue Music done", true, obj);
                    res.write(instance);

                }

            } catch (exp) {

            }

            res.end();

        }).catch(function (err) {

            logger.error("DVP-SystemRegistry.destroyQueueMusic failed ", err);
            var instance = msg.FormatMessage(undefined,"Find Profile Failed", status,err);
            res.write(instance);
            res.end();


        });


    }else{

        res.write(msg.FormatMessage(err, "Token error, no company data found", false, undefined));
        res.end();

    }




    return next();

});


server.get('/DVP/API/:version/QueueMusic/plain/Profile/:name', authorization({resource:"queuemusic", action:"read"}),function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusic HTTP  ");


    var company;
    var tenant;

    if(req&& req.user && req.user.company && req.user.tenant) {

        company =req.user.company;
        tenant = req.user.tenant;


        dbModel.QueueProfile.find({where: [{Name: req.params.name},{CompanyId: company}, {TenantId: tenant}]}).then(function (obj) {


            try {

                logger.debug("DVP-QueueMusic.GetQueueMusic Found ");

                if(obj){

                    var data = format("{0}:{1}:{2}:{3}", obj.MOH, obj.FirstAnnounement, obj.Announcement, obj.AnnouncementTime);
                    logger.debug("DVP-QueueMusic.GetQueueMusic Found ", data);
                    res.write(data);
                }


            } catch (exp) {

            }

            res.end();

        }).catch(function (err) {

            logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);

            res.write("");
            res.end();


        });


    }else{

        res.write(msg.FormatMessage(err, "Token error, no company data found", false, undefined));
        res.end();

    }




    return next();

});


server.post('/DVP/API/:version/QueueMusic/Profile', authorization({resource:"queuemusic", action:"write"}),function(req, res, next){


    try {
        var company;
        var tenant;

        if (req && req.user && req.user.company && req.user.tenant) {

            company = req.user.company;
            tenant = req.user.tenant;


            var profileData = req.body;
            var status = false;
            if (profileData) {

                var profile = dbModel.QueueProfile.build({


                    Name: profileData.Name,
                    Description: profileData.Description,
                    Class: profileData.Class,
                    Type: profileData.Type,
                    Category: profileData.Category,
                    CompanyId: company,
                    TenantId: tenant,
                    MOH: profileData.MOH,
                    Announcement: profileData.Announcement,
                    FirstAnnounement: profileData.FirstAnnounement,
                    AnnouncementTime: profileData.AnnouncementTime,
                    MaxQueueTime: profileData.MaxQueueTime,
                    PositionAnnouncement: profileData.PositionAnnouncement,
                    Language: profileData.Language


                });

                if (profileData.BusinessUnit) {
                    BusinessUnit.findOne({
                        company: company,
                        tenant: tenant,
                        unitName: profileData.BusinessUnit
                    }, function (errUnit, resUnit) {

                        if (errUnit) {
                            logger.error('DVP-QueueMusic.CreateQueueMusic Error in searching BusinessUnit ', errUnit);
                            profile.BusinessUnit=null;
                        }
                        else {
                            if (resUnit) {
                                profile.BusinessUnit = resUnit.unitName;

                            }
                            else {
                                logger.error('DVP-QueueMusic.CreateQueueMusic No BusinessUnit found ');
                                profile.BusinessUnit=null;
                            }
                        }

                        profile
                            .save()
                            .then(function (obj) {
                                try {


                                    logger.debug('DVP-QueueMusic.CreateQueueMusic PGSQL object saved successful ');
                                    status = true;

                                    var instance = msg.FormatMessage(undefined, "Store Profile Done", status, obj);
                                    res.write(instance);
                                    res.end();


                                }
                                catch (ex) {
                                    logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", ex);

                                }

                            }).catch(function (err) {

                            logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
                            var instance = msg.FormatMessage(undefined, "Store Profile Failed", status, err);
                            res.write(instance);
                            res.end();


                        });

                    });


                }
                else
                {
                    profile
                        .save()
                        .then(function (obj) {
                            try {


                                logger.debug('DVP-QueueMusic.CreateQueueMusic PGSQL object saved successful ');
                                status = true;

                                var instance = msg.FormatMessage(undefined, "Store Profile Done", status, obj);
                                res.write(instance);
                                res.end();


                            }
                            catch (ex) {
                                logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", ex);

                            }

                        }).catch(function (err) {

                        logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
                        var instance = msg.FormatMessage(undefined, "Store Profile Failed", status, err);
                        res.write(instance);
                        res.end();


                    });
                }



            } else {

                logger.error("DVP-SystemRegistry.CreateQueueMusic Object Validation Failed");
                var instance = msg.FormatMessage(undefined, "Store Profile Object Validation Failed", status, undefined);
                res.write(instance);
                res.end();
            }


        } else {

            res.write(msg.FormatMessage(new Error("Token error, no company data found"), "Token error, no company data found", false, undefined));
            res.end();

        }
    } catch (e) {
        res.write(msg.FormatMessage(e, "Exception in operation : Create Queue Music profile", false, undefined));
        res.end();
    }




    return next();


});


server.put('/DVP/API/:version/QueueMusic/Profile/:name', authorization({resource:"queuemusic", action:"write"}),function(req, res, next) {

    logger.debug("DVP-QueueMusic.UpdateQueueProfile HTTP  ");


    var company;
    var tenant;

    if(req&& req.user && req.user.company && req.user.tenant) {

        company =req.user.company;
        tenant = req.user.tenant;

        dbModel.QueueProfile.find({where: [{Name: req.params.name}]}).then(function (obj) {

            var profileData = req.body;

            if(obj){

                var updateObj={


                    Name: profileData.Name,
                    Description: profileData.Description,
                    Class: profileData.Class,
                    Type: profileData.Type,
                    Category: profileData.Category,
                    CompanyId:company,
                    TenantId:tenant,
                    MOH: profileData.MOH,
                    Announcement: profileData.Announcement,
                    FirstAnnounement:  profileData.FirstAnnounement,
                    AnnouncementTime: profileData.AnnouncementTime,
                    PositionAnnouncement: profileData.PositionAnnouncement,
                    MaxQueueTime: profileData.MaxQueueTime,
                    Language: profileData.Language,
                    DialTime: profileData.DialTime,
                    BusinessUnit:""

                };

                if(profileData.BusinessUnit )
                {
                    BusinessUnit.findOne({
                        company: company,
                        tenant: tenant,
                        unitName: profileData.BusinessUnit
                    },function (errUnit,resUnit) {

                        if(errUnit)
                        {
                            logger.error('DVP-QueueMusic.UpdateQueueProfile Error in searching BusinessUnit ', errUnit);
                            updateObj.BusinessUnit=null;
                        }
                        else
                        {
                            if(resUnit)
                            {
                                updateObj.BusinessUnit=resUnit.unitName;
                            }
                            else
                            {
                                logger.error('DVP-QueueMusic.UpdateQueueProfile No Business Units found ', errUnit);
                                updateObj.BusinessUnit="";
                            }
                        }

                        obj.updateAttributes(updateObj).then(function (obj) {
                            try {


                                logger.debug('DVP-QueueMusic.UpdateQueueMusic PGSQL object saved successful ');
                                status = true;

                                var instance = msg.FormatMessage(undefined,"Updated Profile Done", status,obj);
                                res.write(instance);
                                res.end();


                            }
                            catch (ex) {
                                logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ", ex);

                            }

                        }).catch(function(err){

                            logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ", err);
                            var instance = msg.FormatMessage(undefined,"Store Profile Failed", status,err);
                            res.write(instance);
                            res.end();



                        });
                    })

                }
                else
                {
                    obj.updateAttributes(updateObj).then(function (obj) {
                        try {


                            logger.debug('DVP-QueueMusic.UpdateQueueMusic PGSQL object saved successful ');
                            status = true;

                            var instance = msg.FormatMessage(undefined,"Updated Profile Done", status,obj);
                            res.write(instance);
                            res.end();


                        }
                        catch (ex) {
                            logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ", ex);

                        }

                    }).catch(function(err){

                        logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ", err);
                        var instance = msg.FormatMessage(undefined,"Store Profile Failed", status,err);
                        res.write(instance);
                        res.end();



                    });
                }



            }
            else{

                logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ");
                var instance = msg.FormatMessage(undefined,"No profile found", false,undefined);
                res.write(instance);
                res.end();

            }



        }).catch(function (err) {

            logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
            var instance = msg.FormatMessage(undefined,"Get Profile Failed", status,err);
            res.write(instance);
            res.end();


        });


    }else{

        res.write(msg.FormatMessage(err, "Token error, no company data found", false, undefined));
        res.end();

    }




    return next();

});


server.get('/DVP/API/:version/QueueMusic/AgentGreeting/:name/:language', authorization({resource:"queuemusic", action:"read"}),function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusics HTTP  ");


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;


    Organization.findOne({id: company}, function(err, organization) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Get Organisations Failed", false, undefined);
            res.writeHead(404);
            res.end(jsonString);
        }else{
            User.findOne({username: req.params.name,company: company, tenant: tenant}, function(err, users) {
                if (err) {

                    jsonString = messageFormatter.FormatMessage(err, "Get User Failed", false, undefined);
                    res.writeHead(404);
                    res.end(jsonString);

                }else{

                    if(users) {

                        jsonString = messageFormatter.FormatMessage(err, "Get User Successful", true, users.user_meta);
                        if(organization && organization.timeZone && organization.timeZone.tz){

                            var time = moment().tz(organization.timeZone.tz);
                            var greetingTime = getGreetingTime(time);
                            var language = req.params.language;

                            if(users.user_meta && users.user_meta.greetings && users.user_meta.greetings[language]){

                                var greetings =  users.user_meta.greetings[language];

                                if(greetings[greetingTime]){

                                    jsonString = messageFormatter.FormatMessage(undefined, "Get User greeting Successful", true, greetings[greetingTime]);
                                    res.writeHead(200);
                                    res.end(greetings[greetingTime]);

                                }else if(greetings["default"]){

                                    jsonString = messageFormatter.FormatMessage(undefined, "Get User greeting Successful", true, greetings["default"]);
                                    res.writeHead(200);
                                    res.end(greetings["default"]);

                                }else{

                                    jsonString = messageFormatter.FormatMessage(undefined, "Get User greeting Failed", false, undefined);
                                    res.writeHead(404);
                                    res.end(jsonString);
                                }


                            }else{
                                jsonString = messageFormatter.FormatMessage(undefined, "Get User greeting Failed", false, undefined);
                                res.writeHead(404);
                                res.end(jsonString);
                            }

                        }else{

                            jsonString = messageFormatter.FormatMessage(undefined, "Get Organization timezone Failed", false, undefined);
                            res.writeHead(404);
                            res.end(jsonString);
                        }

                    }else{
                        jsonString = messageFormatter.FormatMessage(undefined, "Get User Failed", false, undefined);
                        res.writeHead(404);
                        res.end(jsonString);

                    }
                }

            });
        }

    });

    return next();

});




function getGreetingTime (m) {
    var g = null; //return g

    if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.

    var split_afternoon = 12 //24hr time to split the afternoon
    var split_evening = 17 //24hr time to split the evening
    var currentHour = parseFloat(m.format("HH"));

    if(currentHour >= split_afternoon && currentHour <= split_evening) {
        g = "afternoon";
    } else if(currentHour >= split_evening) {
        g = "evening";
    } else {
        g = "morning";
    }

    return g;
}






//var basepath = 'http://'+ "127.0.0.1" + ':' + hostPort;

/*
 sre.init(server, {
 resourceName : 'QueueMusicService',
 server : 'restify', // or express
 httpMethods : ['GET', 'POST', 'PUT', 'DELETE'],
 basePath : basepath,
 ignorePaths : {
 GET : ['path1', 'path2'],
 POST : ['path1']
 }
 }
 );

 */





server.listen(hostPort, function () {
    console.log('%s listening at %s', server.name, server.url);
});
