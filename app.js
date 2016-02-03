/**
 * Created by a on 8/25/2015.
 */

var restify = require('restify');
//var cors = require('cors');
var config = require('config');
var dbModel = require('dvp-dbmodels');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var msg = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var sre = require('swagger-restify-express');
var format = require("stringformat");


var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;

var server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});

restify.CORS.ALLOW_HEADERS.push('authorization');

server.use(restify.CORS());
server.use(restify.fullResponse());


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());




server.get('/DVP/API/:version/QueueMusic/Profile/:name', function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusic HTTP  ");


    dbModel.QueueProfile.find({where: [{Name: req.params.name}]}).then(function (obj) {


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

    return next();

});


server.get('/DVP/API/:version/QueueMusic/Profiles', function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusics HTTP  ");


    dbModel.QueueProfile.findAll().then(function (obj) {


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

    return next();

});


server.del('/DVP/API/:version/QueueMusic/Profile/:name', function(req, res, next) {
    logger.debug("DVP-QueueMusic.destroyQueueMusic HTTP  ");


    dbModel.QueueProfile.find({where: [{Name: req.params.name}]}).then(function (obj) {


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

    return next();

});



server.get('/DVP/API/:version/QueueMusic/plain/Profile/:name', function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusic HTTP  ");


    dbModel.QueueProfile.find({where: [{Name: req.params.name}]}).then(function (obj) {


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

    return next();

});




server.post('/DVP/API/:version/QueueMusic/Profile', function(req, res, next){

    var profileData=req.body;
    var status = false;

    if(profileData) {

       var profile = dbModel.QueueProfile.build({


            Name: profileData.Name,
            Description: profileData.Description,
            Class: profileData.Class,
            Type: profileData.Type,
            Category: profileData.Category,
            CompanyId:1,
            TenantId:1,
            MOH: profileData.MOH,
            Announcement: profileData.Announcement,
            FirstAnnounement:  profileData.FirstAnnounement,
            AnnouncementTime: profileData.AnnouncementTime



        });


        profile
            .save()
            .then(function (obj) {
                try {


                        logger.debug('DVP-QueueMusic.CreateQueueMusic PGSQL object saved successful ');
                        status = true;

                        var instance = msg.FormatMessage(undefined,"Store Profile Done", status,obj);
                        res.write(instance);
                        res.end();


                }
                catch (ex) {
                    logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", ex);

                }

            }).catch(function(err){

                logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
                var instance = msg.FormatMessage(undefined,"Store Profile Failed", status,err);
                res.write(instance);
                res.end();



            });
    }else{

        logger.error("DVP-SystemRegistry.CreateQueueMusic Object Validation Failed", err);
        var instance = msg.FormatMessage(undefined,"Store Profile Object Validation Failed", status,undefined);
        res.write(instance);
        res.end();
    }


    return next();


});

server.put('/DVP/API/:version/QueueMusic/Profile/:name', function(req, res, next) {

    logger.debug("DVP-QueueMusic.GetQueueMusic HTTP  ");


    dbModel.QueueProfile.find({where: [{Name: req.params.name}]}).then(function (obj) {

        var profileData = req.body;

        if(obj){

            obj.updateAttributes({


                Name: profileData.Name,
                Description: profileData.Description,
                Class: profileData.Class,
                Type: profileData.Type,
                Category: profileData.Category,
                CompanyId:1,
                TenantId:1,
                MOH: profileData.MOH,
                Announcement: profileData.Announcement,
                FirstAnnounement:  profileData.FirstAnnounement,
                AnnouncementTime: profileData.AnnouncementTime



            }).then(function (obj) {
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


        }else{

            logger.error("DVP-SystemRegistry.UpdateQueueMusic failed ", err);
            var instance = msg.FormatMessage(undefined,"No profile found", status,undefined);
            res.write(instance);
            res.end();

        }



    }).catch(function (err) {

        logger.error("DVP-SystemRegistry.CreateQueueMusic failed ", err);
        var instance = msg.FormatMessage(undefined,"Get Profile Failed", status,err);
        res.write(instance);
        res.end();


    });

    return next();

});




var basepath = 'http://'+ "127.0.0.1" + ':' + hostPort;


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



function Crossdomain(req,res,next){


    var xml='<?xml version=""1.0""?><!DOCTYPE cross-domain-policy SYSTEM ""http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd""> <cross-domain-policy>    <allow-access-from domain=""*"" />        </cross-domain-policy>';

    /*var xml='<?xml version="1.0"?>\n';

     xml+= '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\n';
     xml+='';
     xml+=' \n';
     xml+='\n';
     xml+='';*/
    req.setEncoding('utf8');
    res.end(xml);

}
function Clientaccesspolicy(req,res,next){


    var xml='<?xml version="1.0" encoding="utf-8" ?>       <access-policy>        <cross-domain-access>        <policy>        <allow-from http-request-headers="*">        <domain uri="*"/>        </allow-from>        <grant-to>        <resource include-subpaths="true" path="/"/>        </grant-to>        </policy>        </cross-domain-access>        </access-policy>';
    req.setEncoding('utf8');
    res.end(xml);

}

server.get("/crossdomain.xml",Crossdomain);
server.get("/clientaccesspolicy.xml",Clientaccesspolicy);




server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});
