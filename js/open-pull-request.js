/*
@TODO:
 - Check if a exactly the same PR isn't already open
 - Check branche creation rights and/or create a fork otherwise
*/
/* @see http://michael.github.io/github/docs/2.3.0/Repository.html */
(function(p_oGlobal) {
    'use strict';

    var oLogger, sBranch, oConfig, oClient;

    function logInfo(p_sMessage) {
        oLogger.log('[OpenPullRequest] ' + p_sMessage);
    }

    /*---------------------------PROMISES---------------------------*/
    function createBranch(p_oXhr) {
        logInfo('HEAD = ' + p_oXhr.data.object.sha);

        logInfo('Creating Branch "' + sBranch + '"');
        var oRef = {
          'ref': 'refs/heads/' + sBranch,
          'sha': p_oXhr.data.object.sha
        };

        return oClient.createRef(oRef);
    }

    function fetchContent(p_oXhr) {
        logInfo('Fetching Content');

        return oClient.getSha(
            'heads/' + oConfig.target.branch,
            oConfig.target.path
        );
    }

    function passContentToCallback(p_oXhr) {
        logInfo('Passing content to callback');

        var sContent = p_oGlobal.atob(p_oXhr.data.content);
        var fCallback = oConfig.callbacks.updateContent;
        fCallback = fCallback.bind(oConfig.data);
        return fCallback(sContent);
    }

    function createCommit(p_sContent) {
        logInfo('Creating Commit');

        var fCallback = oConfig.callbacks.commitMessage;
        fCallback = fCallback.bind(oConfig.data);
        var sMessage = fCallback();

        return oClient.writeFile(
            sBranch,
            oConfig.target.path,
            p_sContent,
            sMessage, {'encode':true}
        );
    }

    function createPullRequest(p_oXhr) {
        logInfo('Creating Pull Request');

        return oClient.createPullRequest({
          'title': p_oXhr.data.commit.message.split("\n")[0],
          'body': '',
          'head': sBranch, /* or sUser + ":" + sBranch for cross-repository*/
          'base': oConfig.target.branch
        });
    }

    function finalise(p_oXhr) {
        logInfo('Pull request created: <a href="' + p_oXhr.data.html_url + '" target="_blank">' + p_oXhr.data.html_url + '</a>');
        logInfo('Done');
    }

    /*--------------------------------------------------------------------*/
    function openePullRequest() {

        sBranch = 'pull-request/' + new Date().toJSON().replace(/[^\d]/g, '');

        // @TODO: Use `new Promise().then` instead of line below?
        return oClient.getRef('heads/' + oConfig.target.branch)
            .then(createBranch)
            .then(fetchContent)
            .then(passContentToCallback)
            .then(createCommit)
            .then(createPullRequest)
            .then(finalise)
        ;
    }

    /* Define Pulbic API */
    p_oGlobal.openPullRequest = function (p_oConfig, p_oClient) {
        oClient = p_oClient;
        oConfig = p_oConfig;
        oLogger = oConfig.logger || p_oGlobal.console || {'log':function(){}, 'error': function () {}};

        return openePullRequest(p_oClient, p_oConfig);
    };
}(window));

/*EOF*/