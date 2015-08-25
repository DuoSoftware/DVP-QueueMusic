/**
 * Created by a on 8/25/2015.
 */

var restify = require('restify');
var config = require('config');
var dbModel = require('DVP-DBModels');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var msg = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var sre = require('swagger-restify-express');


var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;

var server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});

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
                res.end();



            });
    }else{

        logger.error("DVP-SystemRegistry.CreateQueueMusic Object Validation Failed");
        var instance = msg.FormatMessage(undefined,"Store Profile Object Validation Failed", status,undefined);
        res.write(instance);
        res.end();
    }


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
)







server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});